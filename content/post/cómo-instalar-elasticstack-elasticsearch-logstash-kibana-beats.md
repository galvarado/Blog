+++
comments = "true"
date = 2020-02-06T19:00:00Z
draft = true
image = "/uploads/ElasticStack.png"
tags = ["devops", "architecture", "elasticsearch"]
title = "Cómo instalar y configurar ElasticStack: Elasticsearch, Logstash, Kibana, Beats"

+++
El objetivo de este tutorial es instalar y configurar todo el Elastic Stack para centralizar los logs de nuestras aplicaciones. Esto puede ser muy útil  para identificar problemas en los servidores o aplicaciones, ya que  permite realizar búsquedas en todos los logs desde un solo sitio, con esto podemos identificar problemas que abarcan varios servidores vinculando los logs durante un período de tiempo específico.

Los componentes que instalaremos son:

* [Elasticsearch](https://www.elastic.co/products/elasticsearch): Motor de búsqueda  distribuido que almacena todos los datos recopilados.
* [Logstash](https://www.elastic.co/products/logstash): Procesamiento de datos, para  ingestar logs de múltiples fuentes simultáneamente y  transformarlos antes de que se indexen en Elasticsearch.
* [Kibana](https://www.elastic.co/products/kibana): Interfaz web para buscar en los logs y crear gráficas  y  dashboards.
* [Beats](https://www.elastic.co/products/beats): Agentes que transportan los datos, en este caso los archivos de logs hacia logstash para su procesamiento y posterior almacenamiento.

Para una introducción a todos los componentes y casos de uso de Elasicsearch [puedes ver este post](https://galvarado.com.mx/post/introducci%C3%B3n-a-elastic-stack/).

## Flujo de datos

Este diagrama nos ayuda a entender el flujo que seguiran los logs de nuestras aplicaciones para ser centralizados usando el Elastic Stack:
<center>
![](/uploads/ELKdataflow.png)
</center>

1. **Beats** obtiene los logs de las aplicaciones y los envía a Logstash.
2. **Logstash** recibe los datos, los transforma y los almacena en Elasticsearch.
3. **Elasticsearch** indexa los datos, este es el repositorio donde se almacenarán los logs.
4. **Kibana** accede a Elasticsearch para realizan consultas y analisis.

## Prerequisitos

La versión que instalaremos será la 7.6 para todos los componentes del stack. Instalaremos Elasticsearch en una arquitectutra de alta disponibilidad, 3 nodos master y 3 nodos de datos (datanodes). Kibana y Logstash no se instalarán en alta disponibilidad. La instalación se realizará en máquinas virtuales, a continuación el inventario que usaré:

* 3 Máquinas virtuales como Elasticsearch Master Nodes
* 3 Máquinas virtuales como Elasticsearch Data Nodes
* 1 Máquina virtual para Logstash
* 1 Máquina virtual para Kibana

Todas las Máquinas virtuales que usaré tienen 2GB RAM y 2 CPUs. Los requerimientos de CPU, Memoria y Disco dependen de cada caso de uso, el dimensionamiento de RAM y CPU que elegí es para un laboratorio. Una referencia para producción  [se puede encontrar aquí](https://www.elastic.co/guide/en/elasticsearch/guide/current/hardware.html).

La instalación se realizará usando el Sistema Operativo CentOS versión 8.

_Nota: Para laboratorios todos los componentes se pueden instalar en la misma máquina virtual o incluso en un entorno local (laptop)._

En cada servidor definiremos el archivo /etc/hosts para resolución de nombres de dominio local. Esto para no depender de crear registros DNS. Los hostnames son importantes porque la configuración de elasticsearch solicita hostnames y de esta manera se podrá resolver la IP de cada host.

En mi caso agregué al archivo /etc/hosts de cada nodo:

    159.89.89.122   master01
    159.89.88.78    master02
    159.89.89.207   master03
    159.89.89.222   data01
    142.93.249.78   data02
    159.89.89.72    data03
    159.89.94.70    logstash
    165.227.83.121  kibana

## Prerequisito - Instalar Java 8

En todos las máquinas virtuales instalamos Java 8 pues es un requisito:

    $ yum update
    $ yum install java-1.8.0-openjdk
    $ java -version
    openjdk version "1.8.0_242"
    OpenJDK Runtime Environment (build 1.8.0_242-b08)
    OpenJDK 64-Bit Server VM (build 25.242-b08, mixed mode)

## Instalación Elasticsearch

Para instalar Elasticsearch podemos descargar el paquete desde el sito  de Elastic o utilizar el repositorio RPM. Para la instalación mediante YUM utilizando el RPM:

1\. Importar la clave PGP de Elasticsearch:

    $ rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

2\. Crear un archivo llamado elasticsearch.repo en el directorio /etc/yum.repos.d/:

    [elasticsearch]
    name=Elasticsearch repository for 7.x packages
    baseurl=https://artifacts.elastic.co/packages/7.x/yum
    gpgcheck=1
    gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
    enabled=0
    autorefresh=1
    type=rpm-md

3\. Instalar con yum

    $ sudo yum install --enablerepo=elasticsearch elasticsearch

### Configuración Elasticsearch

Repetimos los pasos anteriores para todos los nodos de Elasticsearch, tanto los nodos master como los nodos de datos (datanodes).

Elasticsearch es un motor que está diseñado para ser distruibuido y ofrecer alta disponibilidad. Esto quiere decir que para crear el cluster tenemos opciones de configuración predefinidas y fácil de llenar.

La configuración del cluster se realiza mediante el archivo /etc/elasticsearch/elasticsearch.yml, modificamos los siguientes parametros:

* cluster.name: Nombre del cluster
* node.name: Nombre del nodo
* node.master: True o False, para determinar si un nodo es master node o es data node
* node.data: True o False, para determinar si un nodo es master node o es data node
* network.host: IP del nodo
* http.port: Puerto donde se habilita Elasticsearch, default 9200
* discover.seed_hosts: Lista de IPs de todos los nodos que forman el cluster (masternodes y datanodes)
* cluster.initial_master_nodes: Lista de hostnames de los nodos master  del cluster

Por ejemplo en mi caso:

    cluster.name: elasticsearchcluster
    node.name: master01
    node.master: true
    node.data: false
    network.host: 159.89.89.122
    http.port: 9200
    discovery.seed_hosts: ["159.89.89.122", "159.89.88.78", "159.89.89.207", "159.89.89.222", "142.93.249.78", "159.89.89.72"]
    cluster.initial_master_nodes: ["master01", "master02", "master03"]

_Nota: Distinguir entre las opciones node.master y node.data para designar el rol correcto para cada nodo. En este ejemplo tenemos 3 master nodes y 3 data nodes._

Una ves configurados todos los nodos del cluster, levantamos el servicio en cada uno. Primero habilitados el servicio para encienda automáticamente cuando el SO inicie:

    $ systemctl daemon-reload
    $ systemctl enable elasticsearch.service

Ahora, iniciamos elasticsearch:

    $ sudo systemctl start elasticsearch.service
    # sudo systemctl status elasticsearch.service
    ● elasticsearch.service - Elasticsearch
       Loaded: loaded (/usr/lib/systemd/system/elasticsearch.service; enabled; vendor preset: disabled)
       Active: active (running) since vie 2020-02-07 12:07:47 CST; 2 days ago

Comprobamos que el servicio quedó habilitado:

    $ systemctl list-unit-files --state=enabled | grep elastic
    elasticsearch.service                      enabled

Para comprobar que el cluster inició correctamente, hacemos una petición a la API de Elasticsearch:

    $ curl http://[MASTER_IP]:9200

Salida esperada:

    curl http://159.89.89.122:9200
    {
      "name" : "master01",
      "cluster_name" : "elasticsearchcluster",
      "cluster_uuid" : "twZSFiVsSzSYkfT8ZW2pVQ",
      "version" : {
        "number" : "7.6.0",
        "build_flavor" : "default",
        "build_type" : "rpm",
        "build_hash" : "7f634e9f44834fbc12724506cc1da681b0c3b1e3",
        "build_date" : "2020-02-06T00:09:00.449973Z",
        "build_snapshot" : false,
        "lucene_version" : "8.4.0",
        "minimum_wire_compatibility_version" : "6.8.0",
        "minimum_index_compatibility_version" : "6.0.0-beta1"
      },
      "tagline" : "You Know, for Search"
    }

## Instalación Logstash

Para la instalación mediante YUM utilizando el RPM:

1\. Importar la clave PGP de Elasticsearch:

    $ rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

2\. Crear un archivo llamado logstash.repo en el directorio /etc/yum.repos.d/:

    [logstash-7.x]
    name=Elastic repository for 7.x packages
    baseurl=https://artifacts.elastic.co/packages/7.x/yum
    gpgcheck=1
    gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
    enabled=1
    autorefresh=1
    type=rpm-md                                                                                                                                                                                           

3\. Instalar con yum

    $ sudo yum install --enablerepo=logstash logstash

_Nota: Recuerda que uno de los prerequisitos es instalar Java. Revisa la sección anterior._

### Configuración Logstash

La configuración se realiza mediante el archivo: /etc/logstash/logstash.yml, modificamos los siguientes parametros:

* http.host: IP del servidor
* http.port: Puerto del endpoint de metricas

Por ejemplo en mi caso:

    http.host: "159.89.94.70"
    http.port: 9600-9700

Una ves configurados los parametros, levantamos el servicio. Primero habilitamos el servicio para encienda automáticamente cuando el SO inicie:

    $ systemctl daemon-reload
    $ systemctl enable logstash.service

Ahora, iniciamos logstash:

    $ sudo systemctl start logstash.service
    # sudo systemctl status logstash.service
    ● logstash.service - logstash
       Loaded: loaded (/etc/systemd/system/logstash.service; enabled; vendor preset: disabled)
       Active: active (running) since Wed 2020-02-19 19:45:16 UTC; 7s ago

Comprobamos que el servicio quedó habilitado:

    $ systemctl list-unit-files --state=enabled | grep logstash
    logstash.service                      enabled

En este punto ya está ejecutandose el proceso de logstash, pero aún no definimos ningun pipeline para recibir los datos que enviaran los agentes de beats ni tampoco hemos configurado almacenar los datos en elasticsearch.

En una sección posterior ( Configuración de Pipelines en Logstash) se detallará esta configuración. Por ahora nos basta con haber iniciado el proceso.

## Instalación Kibana

Para la instalación mediante YUM utilizando el RPM:

1\. Importar la clave PGP de Elasticsearch:

    $ rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

2\. Crear un archivo llamado logstash.repo en el directorio /etc/yum.repos.d/:

    [kibana-7.x]
    name=Kibana repository for 7.x packages
    baseurl=https://artifacts.elastic.co/packages/7.x/yum
    gpgcheck=1
    gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
    enabled=1
    autorefresh=1
    type=rpm-md                                                                                                                                                                                                

3\. Instalar con yum

    $ sudo yum install --enablerepo=kibana kibana

_Nota: Recuerda que uno de los prerequisitos es instalar Java. Revisa la sección anterior._

### Configuración Kibana

La configuración se realiza mediante el archivo: /etc/kibana/kibana.yml, modificamos los siguientes parámetros:

* server.port: Puerto donde se habilitará el servicio
* server.host:  IP del servidor donde se expondrá el dashboard
* elasticsearch.hosts: los endpoints de elasticsearch. Colocamos aquí los nodos master.

Por ejemplo en mi caso:

    server.port: 5601
    server.host: 165.227.83.121
    elasticsearch.hosts:["http://159.89.89.122:9200", "http://159.89.88.78:9200", "http://159.89.89.207:9200"]
    

Una ves configurados los parámetros, levantamos el servicio. Primero habilitamos el servicio para encienda automáticamente cuando el SO inicie:

    $ systemctl daemon-reload
    $ systemctl enable kibana.service

Ahora, iniciamos kibana:

    $ sudo systemctl start kibana.service
    $ sudo systemctl status kibana.service
    [root@kibana-s-1vcpu-2gb-nyc1-01 ~]# sudo systemctl status kibana.service
    ● kibana.service - Kibana
       Loaded: loaded (/etc/systemd/system/kibana.service; enabled; vendor preset: disabled)
       Active: active (running) since Wed 2020-02-19 20:09:53 UTC; 1s ago
    

Comprobamos que el servicio quedó habilitado:

    $ systemctl list-unit-files --state=enabled | grep kibana
    kibana.service                      enabled

En este punto ya podemos entrar al dashboard, la página de bienvenida es esta:
<center>

![](/uploads/kibanahome.png)
</center>

En secciones posteriores veremos como visualizar los datos que estarán almacenados en elasticsearch. Por ahora nos basta con saber que kibana está instalado y funcionando.

## Instalación Beats

## Configuración de Pipelines en Logstash

## Visualización de logs en Kibana