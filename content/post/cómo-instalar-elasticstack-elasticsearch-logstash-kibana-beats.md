+++
comments = "true"
date = 2020-02-06T19:00:00Z
draft = true
image = "/uploads/ElasticStack.png"
tags = ["devops", "architecture", "elasticsearch"]
title = "Cómo Instalar ElasticStack: Elasticsearch, Logstash, Kibana, Beats"

+++
El objetivo de este tutorial es instalar todo el Elastic Stack para centralizar los logs de nuestras aplicaciones. Esto puede ser muy útil  para identificar problemas en los servidores o aplicaciones, ya que  permite realizar búsquedas en todos los logs desde un solo sitio, con esto podemos identificar problemas que abarcan varios servidores vinculando los logs durante un período de tiempo específico.

Los componentes que instalaremos son:

* [Elasticsearch](https://www.elastic.co/products/elasticsearch): Motor de búsqueda  distribuido que almacena todos los datos recopilados.
* [Logstash](https://www.elastic.co/products/logstash): Procesamiento de datos, para  ingestar logs de múltiples fuentes simultáneamente y  transformarlos antes de que se indexen en Elasticsearch.
* [Kibana](https://www.elastic.co/products/kibana): Interfaz web para buscar en los logs y crear gráficas  y  dashboards.
* [Beats](https://www.elastic.co/products/beats): Agentes que transportan los datos, en este caso los archivos de logs hacia logstash para su procesamiento y posterior almacenamiento.

Para una introducción a todos los componentes y casos de uso de Elasicsearch [puedes ver este post](https://galvarado.com.mx/post/introducci%C3%B3n-a-elastic-stack/).

## Flujo de datos

Este diagrama nos ayuda a entender el flujo que seguiran los logs de nuestras aplicaciones para ser centralizados usando el Elastic Stack:

![](/uploads/ELKFLow.png)

1. **Beats** obtiene los logs de las aplicaciones y los envía a Logstash.
2. **Logstash** recibe los datos, los transforma y los almacena en Elasticsearch.
3. **Elasticsearch** indexa los datos, este es el repositorio donde se almacenarán los logs.
4. **Kibana** accede a Elasticsearch para realizan consultas y analisis.

## Prerequisitos

La versión que instalaremos será la 7.5 para todos los componentes del stack. Instalaremos Elasticsearch en una arquitectutra de alta disponibilidad. Kibana y Logstash no se instalarán en alta disponibilidad. La instalación se realizará en máquinas virtuales, a continuación el inventario que usaré:

* 3 Máquinas virtuales como Elasticsearch Master Nodes
* 3 Máquinas virtuales como Elasticsearch Data Nodes
* 1 Máquina virtual para Logstash
* 1 Máquina virtual para Kibana

Todas las Máquinas virtuales que usaré tienen 2GB RAM y 2 CPUs. Los requerimientos de CPU, Memoria y Disco dependen de cada caso de uso. Una referencia [se puede encontrar aquí](https://www.elastic.co/guide/en/elasticsearch/guide/current/hardware.html).

La instalación se realizará usando el Sistema Operativo CentOS versión 8.

_Nota: Esta instalación está pensada en un entorno de producción. Para laboratorios todos los componentes se pueden instalar en la misma máquina virtual o incluso en un entorno local (laptop)._

## Instalación Elasticsearch