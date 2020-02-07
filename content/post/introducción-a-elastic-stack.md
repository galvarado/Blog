+++
comments = "true"
date = 2020-02-05T06:00:00Z
image = "/uploads/elasticsearch-1.png"
tags = ["devops", "cloud", "elastcisearch", "kibana", "logstash"]
title = "Introducción a Elastic Stack"

+++
Estoy trabajando con Elastic Stack de nuevo, hace unos años que no implementaba o trabajaba con estas tecnologías y han cambiado notoriamente, así que aproveché de crear una entrada en el blog para cubrir las cuestiones básicas y aprender algunos casos de uso.

## Breve Historia de Elastic

Todo comenzó con el ELK Stack, acrónimo de tres proyectos de código abierto: Elasticsearch, Logstash y Kibana. El Elastic Stack es la  evolución del ELK Stack.

Shay Banon creó el precursor de Elasticsearch, llamado Compass, en 2004. Después lanzó la primera versión de Elasticsearch en febrero de 2010.

Elastic NV se fundó en 2012 para proporcionar servicios y productos comerciales en torno a Elasticsearch y software relacionado. En marzo de 2015, la compañía Elasticsearch cambió su nombre a Elastic.

En junio de 2018, Elastic solicitó una oferta pública inicial con una valoración estimada de entre 1,5 y 3 mil millones de dólares.  El 5 de octubre de 2018, Elastic cotizaba en la Bolsa de Nueva York.

Entonces, el Elastic Stack es la  evolución del ELK Stack original, los mismos proyectos de código abierto, solo que mejor integrados con 2 nuevos proyectos: Beats y X-pack.

![Elastic stack](/uploads/Elastic.png "Elastic stack")

## Componentes de Elastic Stack

### Beats

Beats es la plataforma para transportar datos dentro del stack. Los Beats son un conjunto de Data Shippers que entregan datos directamente a ElasticSearch y/o Logstash y que por tanto actúan como agentes. Al momento de escribir este artículo existían los siguientes agentes en la página  oficial:

**Filebeat:**  Ingestar archivos de registro (logs)

**Metricbeat:**  Métricas de sistema, como CPU, RAM, Disco y muchos modulo disponibles cómo Docker, NGINX, etc.

**Heartbeat:**  Un protocolo de latido (heart) generalmente se usa para  monitorear la disponibilidad de un recurso. Puede realizar "pings" por ICMP, TCP y HTTP.

**Packetbeat:**  Decodifica protocolos de red, correlaciona peticiones con respuetas,  los protocolos incluidos son ICMP, DNS HTTP, AMQP y de otras aplicaciones como MySQL, Memcached, MongoDB, RPC.

**Winlogbeat:** Registros de eventos (logs) de Windows.

**Auditbeat:** Datos de auditoria, se integra con  el modulo del kernel de _Linux audit_ . También monitorea en tiempo real l  la integridad de archivos, usando hashes.

**Functionbeat:**  Para implementarse como función en una plataforma FaaS, con el objetivo de recopilar, monitorear y enviar datos de servicios en la nube.

### Logstash

Logstash es una pipeline de procesamiento de datos open source y que te permite ingestar datos de múltiples fuentes simultáneamente y enriquecerlos y transformarlos antes de que se indexen en Elasticsearch. Se usa para agregar y procesar datos y enviarlos a su repositorio final, la mayoría de las veces Elasticsearch.

A medida que los datos van de la fuente al repositorio, los  filtros de Logstash analizan cada evento,  identifican los campos por nombre para construir una estructura y los transforman para tener en un formato común para poder realizar un análisis más poderoso.

### Elastic Search

Es el corazón del Elastic Stack, es  un servidor de búsqueda basado en [Lucene](https://es.wikipedia.org/wiki/Lucene "Lucene"). Provee un [motor de búsqueda](https://es.wikipedia.org/wiki/Motor_de_b%C3%BAsqueda "Motor de búsqueda") de texto  y es altamente distribuible y fácilmente escalable. Es accesible a través de una extensa  API. El objetivo es realizar  búsquedas extremadamente rápidas que respalden nuestras aplicaciones. Elastic Search se puede considerar una Base de Datos NoSQL.

Para comprender mejor Elasticsearch y su uso defino los los principales términos que se deben comprender:

**Índice :** El índice es una colección de documentos que tienen características similares. Por ejemplo, podemos tener un índice para un cliente específico, otro para la información de un producto y otro para una estructura de datos diferente.  En un solo clúster, podemos definir tantos índices como queramos. El índice es similar a una  base de datos en un RDBMS.

**Documento:** Un documento es una unidad básica de información que puede indexarse. Por ejemplo, podemos tener un índice sobre un producto y luego un documento para un  cliente. Este documento se expresa en JSON (JavaScript Object Notation Dentro de un índice, podemos almacenar tantos documentos como deseemos.

Un documento se ve así:

    {
        "account_number": 198,
        "balance": 10623,
        "firstname": "Guillermo",
        "lastname": "Alvarado",
        "age": 30,
        "gender": "M",
        "address": "Avenida de los insurgentes 2440",
        "employer": "Sentinel.la",
        "email": "guillermo@example.com",
        "city": "Mexico City",
        "country": "Mexico",
    }

**Query DSL:** Elasticsearch proporciona un  lenguaje DSL completo basado en JSON para definir consultas.

Una consulta sobre el documento anterior se vería así:

    {
      "query": { "match": { "firstname": "Guillermo" } }
    }

**Nodo:** Un nodo es un servidor  que forma parte de un clúster, este almacena nuestros datos y participa en las capacidades de indexación y búsqueda del clúster. Al igual que un clúster, un nodo se identifica con un nombre.

**Cluster:** Es una colección de uno o más nodos que en conjunto contiene todos los datos donde buscamos  Puede haber N nodos en el mismo clúster. Elasticsearch funciona como un entorno distribuido con la replicación entre nodos.

**Fragmentos (Shards) y réplicas:** Elasticsearch proporciona la capacidad de subdividir el índice en varias piezas llamadas fragmentos o shards. Cuando se crea un índice, se puede definir la cantidad de fragmentos que se desea. Cada fragmento es en sí mismo un "índice" totalmente funcional e independiente que se puede almacenar en cualquier nodo del clúster.

Los fragmentos son importantes porque permiten dividir horizontalmente el volumen de datos, potencialmente para realizar operaciones de paralelización aumentando así el rendimiento.Ños índices se puedan dividir en fragmentos y cada uno tener cero o más réplicas.

### Kibana

Es una aplicación web construida con Node.js para buscar, visualizar e interactuar con información almacenada en Elastic Search. El obetivo es filtrar y ver documentos en específico pero también ofrece análisis automáticos en tiempo real, un algoritmo de búsqueda muy flexible y diferentes tipos de vistas como histogramas, gráficos, diagramas circulares, para los datos. En el panel de control  las diversas visualizaciones interactivas pueden combinarse para formar una imagen general dinámica que permita su filtrado y analisis.

Las distintas secciones que forman Kibana:

* **Discover**: Nos permite interactuar con la información almacenada. Podemos filtrar y buscar registros en un intervalo de tiempo determinado para visualizar documentos. Podemos  almacenar las consultas para volver a usarlas en otras ocasiones.
* **Visualize**: Aquí se pueden crear, modificar y ver propias visualizaciones  personalizadas para usarse en un dashboard.
* **Dashboard**: Pantalla donde se pueden crear, modificar y ver  propios cuadros de mando personalizados basados en visualizaciones y búsquedas. Para tener una vista rápida de distintas maneras de organizar la información.
* **Dev Tools:**  UI para interactuar con la API Rest de Elastic Search.

### X-Pack

Es un módulo premium, recientemente liberaron  el código bajo su propia licencia y este contiene modulos de:

**Seguridad**: Posibilidad de manejar usuarios y roles, integración con LDAP y SAML. Cifrado de la comunicación con SSL/TSL.

**Alertas:** alertas sobre cambios en los datos. Básicamente si lo puedes buscar, lo puedes alertar. Vía Email, Slack, Pagerduty, Hipchat y cualquier webhook.

**Monitoreo**: Monitorear el rendimiento así como el uso de los componentes  de Elastic Search,KIbana y Logstash.

**Reportes:** Generar, programar, compartir documentos, visualizaciones o dashboards enteros.  Posibilidad de disparar el envío de  reportes basados en reglas.

**Graph - Análisis de gráficos:** Existen posibles relaciones entre los documentos de  Elastic Stack: enlaces entre personas, lugares, preferencias, productos, lo que sea. Graph ofrece un enfoque orientado a las relaciones que  permite explorar las conexiones en los datos

**Machine learning:** Ejecutar tareas de machine learning en los datos para visualizar y prevenir ar anomalías.

## Casos de uso

### 1. Logs

Para cualquiera que esté familiarizado con Elasticsearch, este no debería ser una sorpresa. El ecosistema creado alrededor de Elasticsearch lo ha convertido en una de las soluciones de centralización de logs más fáciles de implementar y escalar. Desde Beats, hasta Logstash, Elasticsearch  ofrece muchas opciones para capturar datos donde sea que estén e indexarlos. A partir de ahí, herramientas como Kibana  brindan la capacidad de crear paneles y análisis completos.

### 2. Búsqueda de texto completo

La búsqueda de texto completo es una forma más avanzada de buscar en una base de datos. La búsqueda de texto completo encuentra rápidamente todas las instancias de un término (palabra) en una tabla sin tener que escanear filas y sin tener que saber en qué columna se almacena un término.  ElasticSearch funciona como un índice de texto y  almacena información posicional para todos los términos encontrados en las columnas en las que crea el índice de texto. Usar un índice de texto es más rápido que usar un índice regular para encontrar filas que contengan un valor dado. Esto lo podemos encontrar en sitios donde podemos buscar una palabra concreta en todo el sitio.

### 3. Datos y métricas del eventos

ElasticSearch  funciona  en datos de series de  tiempo como métricas y eventos de aplicaciones. Esta es otra área donde el  ecosistema de Beats permite capturar fácilmente datos de aplicaciones comunes. Independientemente de las tecnologías que se utilicen para construir las aplicaciones, existe una gran posibilidad de que Elasticsearch tenga los componentes para tomar métricas y eventos de forma inmediata .

## ¿Es Elasticsearch gratis?

Sí, las características open source de Elasticsearch son gratis para usar con la licencia Apache 2. Las características adicionales están disponibles con una licencia Elastic, y las suscripciones de  paga brindan acceso a soporte y a características avanzadas como las que brinda X-Pack incluidas alertas y machine learning.

La [**distribución oficial de Elasticsearch**](https://www.elastic.co/es/downloads/elasticsearch) está disponible en la página web de Elastic.

En próximas entradas veremos como instalar y configurar un ElasticStack completo.

Si te fue útil, por favor comparte =)