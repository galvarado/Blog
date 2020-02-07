+++
comments = "true"
date = 2020-02-06T19:00:00Z
image = "/uploads/ElasticStack.png"
tags = ["devops", "architecture", "elasticsearch"]
title = "Cómo Instalar ElasticStack: Elasticsearch, Logstash, Kibana, Beats"

+++
El objetivo de este tutorial es instalar todo el Elastic Stack para centralizar los logs de nuestras aplicaciones. Esto puede ser muy útil al para identificar problemas en los servidores o aplicaciones, ya que nose permite realizar búsquedas en todos los logs desde un solo sitio, con esto podemos identificar problemas que abarcan varios servidores vinculando los logs durante un período de tiempo específico.

Los componentes que instalaremos son:

* [Elasticsearch](https://www.elastic.co/products/elasticsearch): Motor de búsqueda  distribuido que almacena todos los datos recopilados.
* [Logstash](https://www.elastic.co/products/logstash): Procesamiento de datos, para  ingestar logs de múltiples fuentes simultáneamente y  transformarlos antes de que se indexen en Elasticsearch.
* [Kibana](https://www.elastic.co/products/kibana): Interfaz web para buscar en los logs y crear gráficas  y  dashboards.
* [Beats](https://www.elastic.co/products/beats): Agentes que transportan los datos, en este caso los archivos de logs hacia logstash para su procesamiento y posterior almacenamiento.

Para una introducción a todos los componentes y casos de uso de Elasicsearch,[ puedes ver este post](https://galvarado.com.mx/post/introducci%C3%B3n-a-elastic-stack/).

Este es el flujo de los datos que buscamos: