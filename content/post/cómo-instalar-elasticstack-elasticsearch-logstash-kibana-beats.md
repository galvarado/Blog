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

![](/uploads/ELKdataflow.png)

1. **Beats** obtiene los logs de las aplicaciones y los envía a Logstash.
2. **Logstash** recibe los datos, los transforma y los almacena en Elasticsearch.
3. **Elasticsearch** indexa los datos, este es el repositorio donde se almacenarán los logs.
4. **Kibana** accede a Elasticsearch para realizan consultas y analisis.

## Prerequisitos

La versión que instalaremos será la 7.5 para todos los componentes del stack. Instalaremos Elasticsearch en una arquitectutra de alta disponibilidad, 3 nodos master y 3 nodos de datos (datanodes). Kibana y Logstash no se instalarán en alta disponibilidad. La instalación se realizará en máquinas virtuales, a continuación el inventario que usaré:

* 3 Máquinas virtuales como Elasticsearch Master Nodes
* 3 Máquinas virtuales como Elasticsearch Data Nodes
* 1 Máquina virtual para Logstash
* 1 Máquina virtual para Kibana

Todas las Máquinas virtuales que usaré tienen 2GB RAM y 2 CPUs. Los requerimientos de CPU, Memoria y Disco dependen de cada caso de uso, el dimensionamiento de RAM y CPU que elegí es para un laboratorio. Una referencia para producción  [se puede encontrar aquí](https://www.elastic.co/guide/en/elasticsearch/guide/current/hardware.html).

La instalación se realizará usando el Sistema Operativo CentOS versión 8.

_Nota: Para laboratorios todos los componentes se pueden instalar en la misma máquina virtual o incluso en un entorno local (laptop)._

## Instalar Java 8

En todos las máquinas virtuales instalamos Java 8 pues es un requisito:

    $ yum update
    $ yum install java-1.8.0-openjdk
    $ java -version
    openjdk version "1.8.0_232"
    OpenJDK Runtime Environment (build 1.8.0_232-b09)
    OpenJDK 64-Bit Server VM (build 25.232-b09, mixed mode)

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

La configuración del cluster se realiza mediante el archivo /etc/elasticsearch/elasticsearch.yml, modificamos los siguientes parametros:

* cluster.name: Nombre del cluster
* node.name: Nombre del nodo
* node.master: True o False, para determinar si un nodo es master node o es data node
* node.data: True o False, para determinar si un nodo es master node o es data node
* network.host: IP del nodo
* http.port: Puerto donde se habilita Elasticsearch, default 9200
* discover.seed_hosts: Lista de IPs de todos los nodos que forman el cluster
* cluster.initial_master_nodes: Lista de hostnames de los nodos master  del cluster

Por ejemplo en mi caso:

    cluster.name: elasticsearchcluster
    node.name: master01
    node.master: true
    node.data: false
    network.host: 
    http.port: 9200
    discovery.seed_hosts: [""]
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

    $ curl http://localhost:9200

Salida esperada:

## Instalación Logstash

## Instalación Kibana

## Instalación Beats

## Configuración de Pipeline en Logstash

## Visualización de logs en Kibana