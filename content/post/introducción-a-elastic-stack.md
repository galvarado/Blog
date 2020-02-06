+++
comments = "true"
date = 2020-02-05T06:00:00Z
image = "/uploads/INTRODUCCIÓN (1).png"
tags = ["devops", "cloud", "elastcisearch", "kibana", "logstash"]
title = "Introducción a Elastic Stack"

+++
Estoy trabajando con Elastic Stack de nuevo, hace unos años que no implementaba o trabajaba con estas tecnologías y han cambiado notoriamente, así que aproveché de crear una entrada en el blog para cubrir las cuestiones básicas y aprender algunos casos de uso.

## Breve Historia de Elastic

Todo comenzćo con el ELK Stack, acrónimo de tres proyectos de código abierto: Elasticsearch, Logstash y Kibana. El Elastic Stack es la  evolución del ELK Stack.

Shay Banon creó el precursor de Elasticsearch, llamado Compass, en 2004 Después lanzó la primera versión de Elasticsearch en febrero de 2010.

Elastic NV se fundó en 2012 para proporcionar servicios y productos comerciales en torno a Elasticsearch y software relacionado.

En marzo de 2015, la compañía Elasticsearch cambió su nombre a Elastic.

En junio de 2018, Elastic solicitó una oferta pública inicial con una valoración estimada de entre 1,5 y 3 mil millones de dólares.  El 5 de octubre de 2018, Elastic cotizaba en la Bolsa de Nueva York.

Entonces, el Elastic Stack es la  evolución del ELK Stack original, los mismos proyectos de código abierto, solo que mejor integrados con 2 nuevos proyectos: Beats y X-pack.

![Elastic stack](/uploads/Elastic.png "Elastic stack")

## Componentes de Elastic Stack

### Beats

Beats es la plataforma para transportar datos dentro del stack. Los Beats son un conjunto de Data Shippers que entregan datos directamente a ElasticSearch y/o Logstash y que por tanto actúan como agentes. Al momento de escribir este artículo existían los siguientes agentes en la página  oficial:

**Filebeat:**  Ingestar archivos de registro (logs)

**Metricbeat:**  Métricas de sistema, como CPU, RAM, Disco y muchos modulo disponibles cómo Docker, NGINX,

**Heartbeat:**  Un protocolo de latido (heart) generalmente se usa para  monitorear la disponibilidad de un recurso. Puede realizar "pings por ICMP, TCP y HTTP.

**Packetbeat:**  Decodifica protocolos de red, correlaciona peticiones con respuetas, incluidos: ICMP, DNS HTTP, AMQP y de otras aplicaciones como MySQL, Memcached, MongoDB, RPC.

\**Winlogbeat:**Registros de eventos de Windows

**Auditbeat:** Datos de auditoria, se integra con  el modulo del kernel de Linux audit framework. También para monitorear en tiempo real la  la integridad de archivos, usando hashes.

**Functionbeat:**  Para implementarse como dunción en una plataforma  FaaS, para recopilar, enviar y monitorear datos de  servicios en la nube.

### Logstash

Logstash  es un motor de procesamiento y recopilación de datos basado en plugins.  El objetivo principal de  Logstash es crear  pipelines de procesamiento de datos. Este ingiere datos de una multitud de fuentes simultáneamente, los transforma y envía de forma dinámica  sin importar  su formato o complejidad hacia un repositorio determinado, la mayoría de las veces ese repositorio es Elastic Search.

A medida que los datos van de la fuente al repositorio, los  filtros de Logstash analizan cada evento,  identifican los campos por nombre para construir una estructura y los transforman para converger en un formato común para poder realizar un análisis más poderoso.

### Elastic Search

Es el corazón del Elastic Stack, es un motor de búsqueda y análisis. Es altamente distribuible y fácilmente escalable. Es accesible a través de una extensa  API. El objetivo es realizar  búsquedas extremadamente rápidas que respalden nuestras aplicaciones. Elastic Search se puede considerar una Base de Datos NOSQL.

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

**Nodo:** Un nodo es un servidor único que forma parte de un clúster, almacena nuestros datos y participa en las capacidades de indexación y búsqueda del clúster. Al igual que un clúster, un nodo se identifica con un nombre que, de manera predetermin

**Cluster:** Es una colección de uno o más nodos que en conjunto contiene todos los datos y proporciona capacidades de indexación y búsqueda . Puede haber N nodos en el mismo clúster. lasticsearch funciona como un entorno distribuido: con la replicación entre clústers, un clúster secundario puede entrar en acción como una copia de seguridad.

**Fragmentos (Shards) y réplicas:** Elasticsearch proporciona la capacidad de subdividir el índice en varias piezas llamadas fragmentos. Cuando se crea un índice, se puede definir la cantidad de fragmentos que se desea. Cada fragmento es en sí mismo un "índice" totalmente funcional e independiente que se puede alojar en cualquier nodo del clúster.

Los fragmentos son importantes porque permiten dividir horizontalmente el volumen de datos, potencialmente para realizar operaciones de paralelización en entonos de múltiples nodos, aumentando así el rendimiento. Los fragmentos también se pueden usar al hacer múltiples copias del índice en fragmentos de réplicas.

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

**Alertas:** alertas sobre cambios en los datos. Básicamente si lo puedes buscar, lo puedes alertar. Vía email, slack, pagerdumy Hipchat y cualquier webhook.

**Monitoreo**: Monitorear el rendimiento así como el uso de los componentes  de Elastic Search,KIbana y Logstash.

**Reportes:** Generar, programar, compartir documentos, visualizaciones o dashboards enteros.  Posibilidad de disparar el envío de  reportes basados en reglas.

**Graph - Análisis de gráficos:** Existen posibles relaciones entre los documentos de  Elastic Stack: enlaces entre personas, lugares, preferencias, productos, lo que sea. Graph ofrece un enfoque orientado a las relaciones que  permite explorar las conexiones en los datos

**Machine learning:** Ejecutar tareas de machine learning en los datos para visualizar y prevenir ar anomalías.

En próximas entradas veremos como instalar y configurar un Elastic stack completo.

Si te fue útil, por favor comparte =)