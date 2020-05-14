+++
comments = "true"
date = 2020-05-14T04:00:00Z
image = "/uploads/TroubleshootingOpenstack.png"
tags = ["containers", "CloudOps", "Openstack"]
title = "Troubleshooting Openstack: Servicios en contenedores y notas de HA"

+++
Las versiones anteriores de  OpenStack  utilizaban Systemd para administrar los servicios para el control plane.  Pero desde la versión [Queens](https://releases.openstack.org/queens/index.html) (Equivalente a Red Hat Openstack Platform 13) ahora los servicios se ejecutan en  contenedores.  Proyectos como Openstack evolucionan bastante en cada versión. Ahora mismo la instalación ha ido evolucionando y la mayoria de las tareas se ejecutan con Ansible, solo por mencionar un ejemplo.  Esta evolución ha sido gradual pero ahora en la versión Train incluso el Undercloud se ejecuta en contenedores y con [podman](https://podman.io/whatis.html) como el cli por default sustituyendo al de docker.

El cambio no es menor y el proceso de despliegue es totalmente diferente.  Debemos saber que cambian la rutas de los archivos de configuración, de los archivos de log, pero también la manera en la que se inician los servicios y la forma la que debemos realizar tareas de troubleshooting y debugging. Esta es una guia de apoyo para quien deba llevar estas tareas acabo.

La instalación de los ambientes donde he  obteniendo esta experiencia esta basada en TripleO, ya sea con [RHOSP](https://www.redhat.com/es/technologies/linux-platforms/openstack-platform) o con la versión upstream de Openstack instalado en CentOS , es decir [RDO](https://www.rdoproject.org/rdo/).

NOTA: Los siguientes comandos usan docker como cliente, pero funcionan igual con podman. Depende de la versión de Openstack que estamos usando.

## Pre-Check de servicios y contenedores

Ante el caso de un troubleshooting deberiamos primero obtener un diagnotico rápido de la situación. Con los siguientes 2 scripts obtenemos infromación general de la salud del Openstack.. Esta validación puede ahorrarnos tiempo:

**Revisión general de los servicios**

Podemos realizar una validación rápida consultando los servicios de Openstack desde el CLI. Podemos ejecutar estas validaciones con un script en bash desde el undercloud.

check_services.sh:

    source /home/stack/overcloudrc
    openstack volume service list
    openstack hypervisor list
    openstack network agent list

La salida sería simiar a:

    +------------------+------------------------+------+---------+-------+----------------------------+
    | Binary           | Host                   | Zone | Status  | State | Updated At                 |
    +------------------+------------------------+------+---------+-------+----------------------------+
    | cinder-scheduler | controller02           | nova | enabled | up    | 2020-05-14T04:45:52.000000 |
    | cinder-scheduler | controller01           | nova | enabled | up    | 2020-05-14T04:45:48.000000 |
    | cinder-scheduler | controller03           | nova | enabled | up    | 2020-05-14T04:45:52.000000 |
    | cinder-volume    | hostgroup@tripleo_ceph | nova | enabled | up    | 2020-05-14T04:45:47.000000 |
    +------------------+------------------------+------+---------+-------+----------------------------+
    +--------------------------------------+---------------------+-----------------+--------------+-------+
    | ID                                   | Hypervisor Hostname | Hypervisor Type | Host IP      | State |
    +--------------------------------------+---------------------+-----------------+--------------+-------+
    | cc023c60-c2e9-414b-b017-38c9c47390d2 | compute01.shcp.gob  | QEMU            | 172.28.96.14 | up    |
    +--------------------------------------+---------------------+-----------------+--------------+-------+
    +--------------------------------------+----------------------+-----------------------+-------------------+-------+-------+-------------------------------+
    | ID                                   | Agent Type           | Host                  | Availability Zone | Alive | State | Binary                        |
    +--------------------------------------+----------------------+-----------------------+-------------------+-------+-------+-------------------------------+
    | 276ef646-c294-4cf4-bdda-42ad903579a5 | OVN Controller agent | controller03.localhost| n/a               | :-)   | UP    | ovn-controller                |
    | df32e280-eed2-4313-82d5-169f761fd848 | OVN Controller agent | compute01.localhost   | n/a               | :-)   | UP    | ovn-controller                |
    | ba38cb5b-44fb-4362-87be-27a56cedc107 | OVN Metadata agent   | compute01.localhost   | n/a               | :-)   | UP    | networking-ovn-metadata-agent |
    | ad9f8b60-ab42-47e5-b8d2-1fffb0f3f228 | OVN Controller agent | controller02.localhost| n/a               | :-)   | UP    | ovn-controller                |
    | 8eccb86f-fe41-4254-8c98-f1b0407014e0 | OVN Controller agent | controller01.localhost| n/a               | :-)   | UP    | ovn-controller                |
    +--------------------------------------+----------------------+-----------------------+-------------------+-------+-------+-------------------------------+

**Revisión de nodo de control**

Podemos ejecutar l siguiente script dentro de un nodo de control para saber la salud de los contenedores, el cluster de base de datos(Galera), Rabbitmq, HAProxy, Redis y Ceph.

check_health.sh:

    echo -e  "\n\n########## Containers unhealthy ##########"
    docker ps | grep unhealthy
    echo -e  "\n\n########## Pacemaker Status ##########"
    pcs status
    echo -e  "\n\n########## RabbitMQ Status ##########"
    docker exec -ti $(docker ps | grep -oP "rabbitmq-bundle-docker-[0-9]+") rabbitmqctl cluster_status
    echo -e "\n\n########## Galera Status ##########"
    docker exec -ti $(docker ps | grep -oP "galera-bundle-docker-[0-9]+") mysql -e "SHOW GLOBAL STATUS LIKE 'wsrep_%'" | grep -E -- 'wsrep_local_state_comment|wsrep_evs_state'
    echo -e "\n\n########## Redis Status ##########"
    docker exec -ti $(docker ps | grep -oP "redis-bundle-docker-[0-9]+")  ps -efw
    echo -e "\n\n########## HAProxy Status ##########"
    docker exec -it $(docker ps | grep -oP "haproxy-bundle-docker-[0-9]+") ps -efw
    echo -e "\n\n########## Ceph Status ##########"
    docker exec -ti $(docker ps | grep -oP "ceph-mon-controller01[0-9]*") ceph -s

La salida:

    ########## Containers unhealthy ##########
    
    ba53346c88d6        docker.io/tripleotrain/centos-binary-nova-scheduler:current-tripleo       "dumb-init --singl..."   26 hours ago        Up 26 hours (unhealthy)                       nova_scheduler
    5d7024a18ec1        docker.io/tripleotrain/centos-binary-nova-conductor:current-tripleo       "dumb-init --singl..."   26 hours ago        Up 26 hours (unhealthy)                       nova_conductor
    ee4a7107250b        docker.io/tripleotrain/centos-binary-cinder-scheduler:current-tripleo     "dumb-init --singl..."   26 hours ago        Up 26 hours (unhealthy)                       cinder_scheduler
    cf907b8344d6        docker.io/tripleotrain/centos-binary-heat-engine:current-tripleo          "dumb-init --singl..."   26 hours ago        Up 26 hours (unhealthy)                       heat_engine
    
    ########## Pacemaker Status ##########
    
    Cluster name: tripleo_cluster
    Stack: corosync
    Current DC: controller03 (version 1.1.20-5.el7_7.2-3c4c782f70) - partition with quorum
    Last updated: Wed May 13 23:50:15 2020
    Last change: Tue May 12 21:11:01 2020 by root via crm_resource on controller01
    15 nodes configured
    47 resources configured
    Online: [ controller01 controller02 controller03 ]
    GuestOnline: [ galera-bundle-0@controller01 galera-bundle-1@controller02 galera-bundle-2@controller03 ovn-dbs-bundle-0@controller01 ovn-dbs-bundle-1@controller02 ovn-dbs-bundle-2@controller03 rabbitmq-bundle-0@controller01 rabbitmq-bundle-1@controller02 rabbitmq-bundle-2@controller03 redis-bundle-0@controller01 redis-bundle-1@controller02 redis-bundle-2@controller03 ]
    Full list of resources:
     Docker container set: rabbitmq-bundle [cluster.common.tag/centos-binary-rabbitmq:pcmklatest]
       rabbitmq-bundle-0	(ocf::heartbeat:rabbitmq-cluster):	Started controller01
       rabbitmq-bundle-1	(ocf::heartbeat:rabbitmq-cluster):	Started controller02
       rabbitmq-bundle-2	(ocf::heartbeat:rabbitmq-cluster):	Started controller03
     Docker container set: galera-bundle [cluster.common.tag/centos-binary-mariadb:pcmklatest]
       galera-bundle-0	(ocf::heartbeat:galera):	Master controller01
       galera-bundle-1	(ocf::heartbeat:galera):	Master controller02
       galera-bundle-2	(ocf::heartbeat:galera):	Master controller03
     Docker container set: redis-bundle [cluster.common.tag/centos-binary-redis:pcmklatest]
       redis-bundle-0	(ocf::heartbeat:redis):	Master controller01
       redis-bundle-1	(ocf::heartbeat:redis):	Slave controller02
       redis-bundle-2	(ocf::heartbeat:redis):	Slave controller03
     ip-172.28.91.49	(ocf::heartbeat:IPaddr2):	Started controller01
     ip-172.28.99.9	(ocf::heartbeat:IPaddr2):	Started controller02
     ip-172.28.96.8	(ocf::heartbeat:IPaddr2):	Started controller03
     ip-172.28.96.9	(ocf::heartbeat:IPaddr2):	Started controller01
     ip-172.28.94.9	(ocf::heartbeat:IPaddr2):	Started controller02
     ip-172.28.95.9	(ocf::heartbeat:IPaddr2):	Started controller03
     Docker container set: haproxy-bundle [cluster.common.tag/centos-binary-haproxy:pcmklatest]
       haproxy-bundle-docker-0	(ocf::heartbeat:docker):	Started controller01
       haproxy-bundle-docker-1	(ocf::heartbeat:docker):	Started controller02
       haproxy-bundle-docker-2	(ocf::heartbeat:docker):	Started controller03
     Docker container set: ovn-dbs-bundle [cluster.common.tag/centos-binary-ovn-northd:pcmklatest]
       ovn-dbs-bundle-0	(ocf::ovn:ovndb-servers):	Master controller01
       ovn-dbs-bundle-1	(ocf::ovn:ovndb-servers):	Slave controller02
       ovn-dbs-bundle-2	(ocf::ovn:ovndb-servers):	Slave controller03
     ip-172.28.96.7	(ocf::heartbeat:IPaddr2):	Started controller01
     Docker container: openstack-cinder-volume [cluster.common.tag/centos-binary-cinder-volume:pcmklatest]
       openstack-cinder-volume-docker-0	(ocf::heartbeat:docker):	Started controller02
    Daemon Status:
      corosync: active/enabled
      pacemaker: active/enabled
      pcsd: active/enabled
    
    ########## RabbitMQ Status ##########
    
    Cluster status of node rabbit@controller01
    [{nodes,[{disc,[rabbit@controller01,rabbit@controller02,
                    rabbit@controller03]}]},
     {running_nodes,[rabbit@controller03,rabbit@controller02,rabbit@controller01]},
     {cluster_name,<<"rabbit@controller01.shcp.gob">>},
     {partitions,[]},
     {alarms,[{rabbit@controller03,[]},
              {rabbit@controller02,[]},
              {rabbit@controller01,[]}]}]
    
    ########## Galera Status ##########
    
    | wsrep_evs_state               | OPERATIONAL                                                                                                          |
    | wsrep_local_state_comment     | Synced                                                                                                               |
    
    ########## Redis Status ##########
    
    UID          PID    PPID  C STIME TTY          TIME CMD
    root           1       0  0 May12 ?        00:00:00 dumb-init --single-child -- /bin/bash /usr/local/bin/kolla_start
    root           8       1  0 May12 ?        00:00:32 /usr/sbin/pacemaker_remoted
    redis         85       1  0 May12 ?        00:01:50 /usr/bin/redis-server 172.28.96.11:6379
    root      153828       0 24 23:50 ?        00:00:00 ps -efw
    
    ########## HAProxy Status ##########
    
    UID          PID    PPID  C STIME TTY          TIME CMD
    root           1       0  0 May12 ?        00:00:00 dumb-init --single-child -- /bin/bash /usr/local/bin/kolla_start
    root           8       1  0 May12 ?        00:00:00 /usr/sbin/haproxy-systemd-wrapper -f /etc/haproxy/haproxy.cfg
    haproxy       15       8  0 May12 ?        00:00:00 /usr/sbin/haproxy -f /etc/haproxy/haproxy.cfg -Ds
    haproxy       16      15  0 May12 ?        00:12:43 /usr/sbin/haproxy -f /etc/haproxy/haproxy.cfg -Ds
    root       11343       0  0 23:50 ?        00:00:00 ps -efw
    
    ########## Ceph Status ##########
    
      cluster:
        id:     f61a82a5-f279-4959-94a6-2fcf69f8f3c0
        health: HEALTH_OK
      services:
        mon: 3 daemons, quorum controller01,controller02,controller03 (age 27h)
        mgr: controller01(active, since 27h), standbys: controller02, controller03
        osd: 36 osds: 36 up (since 4h), 36 in (since 27h)
      data:
        pools:   3 pools, 768 pgs
        objects: 1.32k objects, 1.6 GiB
        usage:   42 TiB used, 262 TiB / 304 TiB avail
        pgs:     768 active+clean

Después de realizar esta revisión rápida, podemos tener una idea de donde comenzar el debugging así que manos a la obra.

## Aspectos básicos de los servicios en contenedores

**Archivos de configuración**

Los archivos de configuración de los servicios de openstack como nova.conf, los archivos de apache/httpd, horizon (django) y cualquier otro proyecto están la ruta:

    /var/lib/config-data/puppet-generated/

Cualquier cambio a estos archivos de configuración requieren de un reinicio del contenedor para que tome efecto.

    $ docker restart [CONTAINER_NAME]

**Archivos de log**

Todos los logs ahora se encuentran en:

    /var/log/containers

Dentro de este directorio están organizados por proyectos, podrás en contrar un directorio para nova, otro para cinder, uno para rabbitmq, etc.

### Debuggear los contenedores

**Monitorear los contenedores**

    $ docker ps 

**Activar modo debug**

Se debe modificar el parametro en el archivo de configuración de cada servicio. Podemos editar el archivo con vi o nano o ejecutar crudini, por ejemplo para activar debug en nova:

    $ sudo crudini --set /var/lib/config-data/puppet-generated/nova/etc/nova/nova.conf DEFAULT debug true

Posteriormente reiniciar el contenedor

    $ docker restart [CONTAINER_NAME]

**Acceder a los contenedores**

    $ docker exec -ti [CONTAINER_NAME] /bin/bash

**Ejecutar comandos en los contenedores**

    $ docker exec -ti [CONTAINER_NAME] [COMMAND]

Por ejemplo, conocer el estado de rabbitmq en el contenedor que se está ejecutando:

    $ docker exec -ti rabbitmq-bundle-docker-0 rabbitmqctl cluster_status

**Inspeccionar el contenedor**

Nos permite conocer la estructura y los metadatos del contenedor. Proporciona información sobre los montajes de volumenes en el contenedor, las etiquetas del contenedor, el comando del contenedor, etc.

    $ docker inspect  [CONTAINER_NAME] 

**Exportar un contenedor**

Cuando el contenedor falla, no sabemos que sucedió. Primero que nada debemos revisar los logs de las rutas antes mencionadas, por lo general son las salidas de stdout. Pero una gran opción es exportar la estructura del sistema de archivos del contenedor, esto nos dejará ver otros archivos de logs que pueden no estar en los volúmenes montados.

Así exportamos el sistema de archivos completo de un contenedor hacia  un archivo tar que podremos explorar:

    $ docker export [CONTAINER_NAME] -o [FILENAME].tar

Donde \[FILENAME\] es el nombre que deseamos colocar para el archivo tar.

**Conocer que comando está ejecutando el contenedor**

Esto es útil para saber como se inician los contenedores y sus argumentos

    $ docker inspect --format='{{range .Config.Env}} -e "{{.}}" {{end}} {{range .Mounts}} -v {{.Source}}:{{.Destination}}{{if .Mode}}:{{.Mode}}{{end}}{{end}} -ti {{.Config.Image}}' $CONTAINER_ID_OR_NAME

Para iniciar el contenedor de manera manual entonces podemos copiar la salida anterior y ejecutarla:

    $ docker run --rm [OUTPUT] /bin/bash

**Paunch**

[Paunch](https://github.com/openstack/paunch) es una herramineta para iniciar y administrar contenedores utilizando archivos de configuración basados ​​en YAML. Estos archivos se pueden encontrar en el directorio que se muestra a continuación:

    /var/lib/tripleo-config/

_En estos ejemplos estaré usando el contenedor openstack-cinder-volume-docker-0._

Para ver el archivo de configuración con el que se inicia el contenedor:

    paunch debug --file /var/lib/tripleo-config/container-startup-config-step_4.json --container openstack-cinder-volume-docker-0 --action dump-json

Conocer el comando con el que paunch inicia el contenedor:

    paunch debug --file /var/lib/tripleo-config/container-startup-config-step_4.json --container openstack-cinder-volume-docker-0 --action print-cmd

## Recursos en Alta Disponibilidad

Comprender como funcionan los recursos de balanceo de carga y alta disponibilidad en Openstack  nos permiten debuggear los servicios más rápido.

### VirtualIPs

Cada recurso que se expone en Openstack se  establece en una dirección IP virtual que los clientes usan para solicitar acceso a un servicio. Si el nodo de control asignado a esa dirección IP falla, la dirección IP se reasigna a un controlador diferente. Además, las peticiones a estas VIPs se balancean al resto de los nodos vía HAProxy.

Las IPs las usa más de un servicio y algunos servicios se exponen en más de una IP. Por ejemplo, Horizon se expone de manera pública e interna.  Existen 7 de ellas y las encontraremos en las configuraciones de HAProxy y Pacemaker. En el proceso de despliegue podemos elegir IPs fijas para estas VIPs, estas se indentifican de la siguiente manera:

**DashboardFixedIp:**

* IP del segmento External API. Para exponer servicios de manera pública.
* Principalmente para keystone y para horizon. Es usada por HAProxy y Pacemaker.

**ControlFixedIP**

* IP del segmento de Control Plane
* Principalmente para keystone_admin.  Es usada por HAProxy.

**InternalApiVirtualFixedIP**

* IP del segmento Internal API. Para exponer servicios de manera interna.
* Principalmente para MySQL y keystone. Es usada por HAProxy y Pacemaker.

**RedisVirtualFixedIP**

* IP del segmento Internal API.
* Para exponer redis de manera interna. Es usada por HAProxy y Pacemaker.

**StorageVirtualFixedIPs**

* IP del segmento Internal API. 
* Para exponer swift de manera interna.Es usada por HAProxy y Pacemaker.

**StorageMgmtVirtualFixedIPs**

* Es usada por Pacemaker.

**OVNDBsVirtualFixedIPs**

* IP del segmento Internal API. 
* Para exponer la base de datos de [OVN](https://en.wikipedia.org/wiki/OVN). Es usada por Pacemaker.

_Nota: La IP de StorageMgmt y  OVNDBs no se gestiona en HAProxy._

### HAProxy

HAProxy es el balanceador de carga que distribuye las peticiones a  los controladores, que finalmente ejecutan los servicios/contenedores de control plane de Openstack.

Los múltiples servicios de  Openstack se configuran con HAProxy y las configuraciones se encuentran en el archivo:

     /var/lib/config-data/haproxy/etc/haproxy/haproxy.cfg

Para ver las configuraciones en el contenedor de HAProxy, podemos ejecutar en algún nodo de control:

    docker exec -it $(docker ps | grep -oP "haproxy-bundle-docker-[0-9]+") cat  /etc/haproxy/haproxy.cfg

Para cada servicio en ese archivo, puede ver las siguientes propiedades:

* listen: el nombre del servicio que está escuchando las solicitudes
* bind: la dirección IP y el número de puerto TCP en el que escucha el servicio
* server: el nombre de cada servidor que proporciona el servicio, la dirección IP del servidor y el puerto de escucha, y otra información.

El siguiente ejemplo muestra cómo se configura  el balanceo para el servicio de Horizon en el archivo haproxy.cfg:

    listen horizon
      bind 172.128.96.9:443 transparent ssl crt /etc/pki/tls/private/overcloud_endpoint.pem
      bind 172.128.96.9:80 transparent
      bind 172.128.99.9:443 transparent ssl crt /etc/pki/tls/private/overcloud_endpoint.pem
      bind 172.128.99.9:80 transparent
      mode http
      cookie SERVERID insert indirect nocache
      http-request set-header X-Forwarded-Proto https if { ssl_fc }
      http-request set-header X-Forwarded-Proto http if !{ ssl_fc }
      option forwardfor
      option httpchk
      redirect scheme https code 301 if !{ ssl_fc }
      rsprep ^Location:\ http://(.*) Location:\ https://\1
      server controller01.internalapi.localhost 172.128.96.11:80 check cookie controller01.internalapi.localhost fall 5 inter 2000 rise 2
      server controller02.internalapi.localhost 172.128.96.12:80 check cookie controller02.internalapi.localhost fall 5 inter 2000 rise 2
      server controller03.internalapi.localhost 172.128.96.13:80 check cookie controller03.internalapi.localhost fall 5 inter 2000 rise 2

Para el servicio de horizon se  identifican las direcciones IP y los puertos en los que se ofrece el servicio, es decir el bind.  Puerto 443 y 80 en las IPs:

* 172.128.96.9
* 172.128.99.9

La dirección  172.128.96.9 es una dirección IP virtual en la red API interna para uso dentro de la nube y la dirección IP virtual 172.128.99.9 está en la red externa para proporcionar acceso desde fuera de la nube.

HAProxy balancea las peticiones realizadas para esas dos direcciones IP hacia los nodos de control, en su dirección de la red API internal:

* controller01.internalapi.localhost 172.128.96.11
* controller02.internalapi.localhost 172.128.96.12
* controller03.internalapi.localhost 172.128.96.13

Las opciones establecidas  permiten las comprobaciones de estado y el servicio se considera inactivo después de cinco comprobaciones de estado fallidas (fail 5). El intervalo entre dos comprobaciones de estado  se establece en 2000 milisegundos o 2 segundos. Un servidor se considera operativo después de 2 comprobaciones de estado exitosas (rise 2).

### Pacemaker

En una implementación de Openstack en alta disponibilidad (HA), existen cuatro tipos de servicios: contenedores core,contededores  activos-pasivos, systemd y contenedor simples. Pacemaker ejecuta y administra los servicios de contenedores core y activos-pasivos

Todos los demás servicios son administrados directamente por systemd con el comando systemctl o por Podman/Docker con el comando podman/docker.

**Contenedores core**

Los servicios básicos de contenedores incluyen Galera, RabbitMQ, Redis y HAProxy. Estos servicios se ejecutan en todos los nodos del controlador. son servicios activo/activo.

**Contenedores Activo/Pasivo**

Los servicios activos/pasivos se ejecutan en un solo nodo controlador a la vez e incluyen servicios como openstack-cinder-volume. El failover del servicio activo-pasivo se  realizar con Pacemaker.

Las acciones fallidas relacionadas con los recursos administrados por Pacemaker se pueden  ver mediante el comando:

    $ pcs status

Hay diferentes tipos  de problemas que pueden ocurrir. En general, puede ser un error en general del nodo de control o un error de un recurso específico.

**Problema de nodos de control**

Si fallan las comprobaciones de estado de un controlador,  podemos acceder al  controlador y comprobar si los servicios pueden iniciar . Los problemas  al iniciar los servicios podrían indicar un problema de comunicación/red entre los nodos de control.

**Problema de recursos individuales**

Si los servicios de un controlador  funcionan, pero solo un recurso individual falla, lo primero sería  interpretar la salida del comando de estado (pcs status).

A partir de este punto debemos investigar los recursos que están fallando, para esto debemos primero entender como función Pacemaker,  a continuación una breve resumen de este funcionamiento y como debuggear un contenedor controlado por pacemaker que está fallando.

**Pacemaker Bundles**

Un bundle o paquete, es un conjunto de servicios y  ahora también contenedores que pacemaker  implementa en  los nodos de control.

Para cada paquete o bundle, podemos ver los siguientes detalles:

* El nombre que Pacemaker asigna al servicio.
* La referencia al contenedor que está asociado con el paquete
* La lista de las réplicas que se ejecutan en los diferentes controladores con su estado

Si alguno de los recursos falla de alguna manera, se debería de observaren la salida del pcs status  debajo de _Failed Actions._

**Bundle simple**

Para ver detalles sobre un servicio de paquete en particular, como el bundle de haproxy, usamos el comando:

    $ sudo pcs resource show haproxy-bundle

La salida se ve así:

    Bundle: haproxy-bundle
      Docker: image=cluster.common.tag/centos-binary-haproxy:pcmklatest network=host options="--user=root --log-driver=journald -e KOLLA_CONFIG_STRATEGY=COPY_ALWAYS" replicas=3 run-command="/bin/bash /usr/local/bin/kolla_start"
      Storage Mapping:
       options=ro source-dir=/var/lib/kolla/config_files/haproxy.json target-dir=/var/lib/kolla/config_files/config.json (haproxy-cfg-files)
       options=ro source-dir=/var/lib/config-data/puppet-generated/haproxy/ target-dir=/var/lib/kolla/config_files/src (haproxy-cfg-data)
       options=ro source-dir=/etc/hosts target-dir=/etc/hosts (haproxy-hosts)
       options=ro source-dir=/etc/localtime target-dir=/etc/localtime (haproxy-localtime)
       options=rw source-dir=/var/lib/haproxy target-dir=/var/lib/haproxy (haproxy-var-lib)
       options=ro source-dir=/etc/pki/ca-trust/extracted target-dir=/etc/pki/ca-trust/extracted (haproxy-pki-extracted)
       options=ro source-dir=/etc/pki/tls/certs/ca-bundle.crt target-dir=/etc/pki/tls/certs/ca-bundle.crt (haproxy-pki-ca-bundle-crt)
       options=ro source-dir=/etc/pki/tls/certs/ca-bundle.trust.crt target-dir=/etc/pki/tls/certs/ca-bundle.trust.crt (haproxy-pki-ca-bundle-trust-crt)
       options=ro source-dir=/etc/pki/tls/cert.pem target-dir=/etc/pki/tls/cert.pem (haproxy-pki-cert)
       options=rw source-dir=/dev/log target-dir=/dev/log (haproxy-dev-log)
       options=ro source-dir=/etc/pki/tls/private/overcloud_endpoint.pem target-dir=/var/lib/kolla/config_files/src-tls/etc/pki/tls/private/overcloud_endpoint.pem (haproxy-cert)

Aunque HAProxy proporciona servicios de alta disponibilidad al balancear el tráfico de carga de los servicios seleccionados, mantenemos HAProxy altamente disponible configurándolo como un servicio bundle de  Pacemaker. Por tanto HAProxy se ejecuta en cada nodo de control.

**Bundle  multi-state**

Los servicios de Galera y Redis se ejecutan como recursos multi-state.

Para el recurso de galera , los tres controladores se ejecutan como master. Para el recurso de OVN y Redis, existe un nodo master, mientras que los otros dos controladores se ejecutan como slave.

Aunque un servicio podría estar ejecutándose en múltiples controladores al mismo tiempo, el controlador en sí podría no estar escuchando la dirección IP que se necesita para llegar a esos servicios. Esto lo gestiona HAProxy.

Una vez entendido como funcionan los recursos en HA, podemos aplicar los comandos antes mencionados sobre los contenedores para debuggear su estado.

Si te parece útil, por favor comparte =)

Referencias y otros recursos:

[https://naleejang.tistory.com/217](https://naleejang.tistory.com/217 "https://naleejang.tistory.com/217")

[http://tripleo.org/install/containers_deployment/tips_tricks.html](http://tripleo.org/install/containers_deployment/tips_tricks.html "http://tripleo.org/install/containers_deployment/tips_tricks.html")

[https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/16.0/html/understanding_red_hat_openstack_platform_high_availability/pacemaker#simple-bundle-overview](https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/16.0/html/understanding_red_hat_openstack_platform_high_availability/pacemaker#simple-bundle-overview "https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/16.0/html/understanding_red_hat_openstack_platform_high_availability/pacemaker#simple-bundle-overview")