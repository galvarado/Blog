+++
comments = "true"
date = 2020-05-18T05:00:00Z
draft = true
image = "/uploads/TroubleshootingOpenstack.png"
tags = ["containers", "CloudOps", "Openstack"]
title = "Troubleshooting Openstack: Servicios en contenedores y notas de HA"

+++
Las versiones anteriores de  OpenStack  utilizaban  Systemd para administrar los servicio para el control plane.  Pero desde la versión [Queens](https://releases.openstack.org/queens/index.html) (Equivalente a Red Hat Openstack Platform 13) ahora los servicios se ejecutan en  contenedores.  Proyectos como Openstack evolucionan bastante en cada versión. Ahora mismo la instalación ha ido evolucionando y la mayoria de las tareas se ejecutan con Ansible, solo por mencionar un ejemplo.  Esta evolución ha sido gradual pero ahora en la versión Train incluso el Undercloud se ejecuta en contenedores y con [podman](https://podman.io/whatis.html) como el cli por default sustituyendo al de docker.

El cambio no es menor y el proceso de despliegue es totalmente diferente.  Debemos saber que cambian la rutas de los archivos de configuración, de los archivos de log, pero también la manera en la que se inician los servicios y la forma la que debemos realizar tareas de troubleshooting y debugging. Esta es una guia de apoyo para quien deba llevar estas tareas acabo.

La instalación de los ambientes donde he  obteniendo esta experiencia esta basada en TripleO, ya sea con [RHOSP](https://www.redhat.com/es/technologies/linux-platforms/openstack-platform) o con la versión upstream de Openstack instalado en CentOS , es decir [RDO](https://www.rdoproject.org/rdo/).

## Aspectos básicos de los servicios en contenedores

**  
Archivos de configuración**

Los archivos de configuración de los servicios de openstack como nova.conf, los archivos de apache/httpd, horizon (django) y cualquier otro proyecto están la ruta:

    /var/lib/config-data/puppet-generated/

Cualquier cambio a estos archivos de configuración requieren de un reinicio del contenedor para que tome efecto.

    $ podman restart [CONTAINER_NAME]

**Archivos de log**

Todos los logs ahora se encuentran en:

    /var/log/containers

Dentro de este directorio están organizados por proyectos, podrás en contrar un directorio para nova, otro para cinder, uno para rabbitmq, etc.

## Precheck de servicios y contenedores

Me gustaría compartir 2 sencillos scripts que nos permiten realizar una evaluación rápida de la situación. Esta validación puede ahorarnos tiempo:

**Revisón general de los servicios**

Podemos realizar una validación rápida consutando los servicios de Openstack desde el CLI. Podemos ejecutar estas validaciones con un script en bash

check_services.sh

    source /home/stack/overcloudrc

    openstack volume service list

    openstack hypervisor list

    openstack network agent list

    Debuggear un contenedor

**Revisión de nodo de control**

El siguiente script nos permite saber la salud de la base de datos, rabbitmq, haproxy, redis.

check_health.sh

    echo -e  "\n\n########## Pacemaker Status ##########"

    pcs status

    echo -e  "\n\n########## RabbitMQ Status ##########"

    docker exec -ti $(docker ps | grep -oP "rabbitmq-bundle-docker-[0-9]+") rabbitmqctl cluster_status

    echo -e "\n\n########## Galera status Status ##########"

    docker exec -ti $(docker ps | grep -oP "galera-bundle-docker-[0-9]+") mysql -e "SHOW GLOBAL STATUS LIKE 'wsrep_%'" | grep -E -- 'wsrep_local_state_comment|wsrep_evs_state'

Dentro del nodo de control, ejecutamos el siguiente script que nos da un panorama de los servicios/contenedores que se están ejecutando

Después de realizar esta revisón rápida, podemos tener una idea de donde comenzar el debugging así que manos a la obra. 

## Debuggear los contenedores

**Monitorear los contenedores**

**Activar modo debug**

Se debe modificar el parametro en el archivo de configuración de cada servicio. Podemos editar el archivo con vi o nano o ejecutar crudini, por ejemplo para activar debug en nova:

    $ sudo crudini --set /var/lib/config-data/puppet-generated/nova/etc/nova/nova.conf DEFAULT debug true

Posteriormente reiniciar el contenedor

    $ podman restart [CONTAINER_NAME]

**Acceder a los contenedores**

    $ podman exec -ti [CONTAINER_NAME] /bin/bash

**Ejecutar comandos en los contenedores**

    $ podman exec -ti [CONTAINER_NAME] [COMMAND]

Por ejemplo, conocer el estado de rabbitmq en el contenedor que se está ejecutando:

    $ podman exec -ti rabbitmq-bundle-docker-0 rabbitmqctl cluster_status

**Inspeccionar el contenedor**

Nos permite conocer la estructura y los metadatos del contenedor. Proporciona información sobre los montajes de volumenes en el contenedor, las etiquetas del contenedor, el comando del contenedor, etc.

    $ podman inspect  [CONTAINER_NAME] 

**Exportar un contenedor**

Cuando el contenedor falla, no sabemos que sucedió. Primero que nada debemos revisar los logs de las rutas antes mencionadas, por lo general son las salidas de stdout. Pero una gran opción es exportar la estructura del sistema de archivos del contenedor, esto nos dejará ver otros archivos de logs que pueden no estar en los volúmenes montados.

Así exportamos el sistema de archivos completo de un contenedor gacia  un archivo tar que podremos explorar:

    $ podman export [CONTAINER_NAME] -o [FILENAME].tar

Donde \[FILENAME\] es el nombre que deseamos colocar para el archivo tar.

**Conocer que comando está ejecutando el contenedor**

Esto es útil para saber como se inician los contenedores y sus argumentos

    $ podman inspect --format='{{range .Config.Env}} -e "{{.}}" {{end}} {{range .Mounts}} -v {{.Source}}:{{.Destination}}{{if .Mode}}:{{.Mode}}{{end}}{{end}} -ti {{.Config.Image}}' $CONTAINER_ID_OR_NAME

Para iniciar el contenedor de manera manual entonces podemos copiar la salida anterior y ejecutarla:

    $ podman run --rm [OUTPUT] /bin/bash

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

### HAproxy

HAProxy es el balanceador de carga que distribuye las peticiones a  los controladores, que finalente ejecutan los servicios/contenedores de control plane de OpenStack.

Los múltiples servicios de  Openstack se configuran con HAProxy y las configuraciones se encuentran en el archivo:

     /var/lib/config-data/haproxy/etc/haproxy/haproxy.cfg

Para cada servicio en ese archivo, puede ver las siguientes propiedades:

* listen: el nombre del servicio que está escuchando las solicitudes
* bind: la dirección IP y el número de puerto TCP en el que escucha el servicio
* server: el nombre de cada servidor que proporciona el servicio, la dirección IP del servidor y el puerto de escucha, y otra información.

El siguiente ejemplo muestra cómo se configura el servicio de  Cinder en el archivo haproxy.cfg:

EJEMPLO

Este ejemplo de configuración de HAProxy para el servicio Cinder identifica las direcciones IP y los puertos en los que se ofrece el servicio Cinder (puerto 8777 en 172.16.0.10 y 192.168.1.150).

La dirección 172.16.0.10 es una dirección IP virtual en la red API interna (VLAN201) para usar dentro de la nube superior, y la dirección IP virtual 192.168.1.150 está en la red externa (VLAN100) para proporcionar acceso a la red API desde fuera de la nube

HAProxy puede dirigir las solicitudes realizadas para esas dos direcciones IP a overcloud-controller-0 (172.16.0.13:8777), overcloud-controller-1 (172.16.0.14:8777) o overcloud-controller-2 (172.16.0.15:8777) .

Las opciones establecidas en estos servidores permiten las comprobaciones de estado (comprobación) y el servicio se considera muerto después de cinco comprobaciones de estado fallidas (caída 5). El intervalo entre dos comprobaciones de estado consecutivas se establece en 2000 milisegundos (o 2 segundos) entre 2000. Un servidor se considera operativo después de 2 comprobaciones de estado exitosas (aumento 2).

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

    $ sudo pcs resource show haproxy-clone

EJEMPLO

Aunque HAProxy proporciona servicios de alta disponibilidad al balancear el tráfico de carga de los servicios seleccionados, mantenemos HAProxy altamente disponible configurándolo como un servicio bundle de  Pacemaker.

**Bundle complejo - Recursos Multi-state**

Los servicios de Galera y Redis se ejecutan como recursos Multi-state. Así es como se ve la salida de estado para estos  servicios:

SALIDA DE COMANDO

Para el recurso galera-master, los tres controladores se ejecutan como master. Para el recurso redis, el nodo X  como master, mientras que los otros dos controladores se ejecutan como slave.

Una vez entendido como funcionan los recursos en HA, podemos aplicar los comandos antes mencionados para debuggear su estado.

Si te parece útil, por favor comparte =)

Referencias y más recursos:

[https://naleejang.tistory.com/217](https://naleejang.tistory.com/217 "https://naleejang.tistory.com/217")

[http://tripleo.org/install/containers_deployment/tips_tricks.html](http://tripleo.org/install/containers_deployment/tips_tricks.html "http://tripleo.org/install/containers_deployment/tips_tricks.html")

[https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/16.0/html/understanding_red_hat_openstack_platform_high_availability/pacemaker#simple-bundle-overview](https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/16.0/html/understanding_red_hat_openstack_platform_high_availability/pacemaker#simple-bundle-overview "https://access.redhat.com/documentation/en-us/red_hat_openstack_platform/16.0/html/understanding_red_hat_openstack_platform_high_availability/pacemaker#simple-bundle-overview")