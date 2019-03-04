---
title: "¿Cómo diseñar una API? Introducción a OpenAPI Specification"
date: 2018-07-10 00:00:00 +0000
tags:
- development
- cloud
- api
autoThumbnailImage: false
thumbnailImagePosition: top
image: images/api.jpg
metaAlignment: center
comments: true

---
¿Cómo debo diseñar mi API? ¿Cómo voy a exponerla a distintos desarrolladores? Hoy en día las APIs son la parte modular de cualquier plataforma. Como sabemos, una API es un conjunto de funciones y procedimientos que cumplen una o muchas funciones con el fin de ser utilizadas por otro software. Todos los productos necesitan un manual de uso  y las APIs no son la excepción. Es por eso que hoy escribí sobre OpenAPI, que es un estandar para crear este manual de uso para nuestra API.

<!--more-->

Todos los productos necesitan un manual de uso  y las APIs no son la excepción. Las APIs hoy en día son el "pegamento" de conexión entre las aplicaciones modernas. Casi todas las aplicaciones usan APIs para conectarse con fuentes de datos corporativas, servicios de datos de terceros u otras aplicaciones. OpenAPI se creó para "Crear un formato de descripción abierto para los servicios API que sea neutral, portátil y abierto, para acelerar la visión de un mundo verdaderamente conectado."

## OpenAPI Specification

Todos los productos necesitan un manual de uso, y las APIs no son la excepción. OpenAPI es un estándar para crear este manual de uso para nuestra API. La especificación [OpenAPI](https://github.com/OAI/OpenAPI-Specification)) estándar es una especificación abierta impulsada por la comunidad y es ahora un proyecto colaborativo de la Fundación Linux. En los últimos años, Swagger se ha convertido en el estándar de facto para definir o documentar una API y ahora se ha movido como un proyecto Opensource y se ha renombrado como OpenAPI Spec. La versión 3 ha estado en proceso por un tiempo y ahora ha sido liberada, de esta estaremos hablando.

Las características más importantes de OpenAPI son las siguientes:

* Ayuda a establecer un buen diseño de las APIs
* Documentación completa
* Testing más rápido gracias a la generación de un sandbox
* Mejora el Time to market
* Generación de un portal de documentación que describe la API, en formaato human-readable

Pero si hay que resumirlo en pocas palabras, _OpenAPI permite descubrir y comprender las capacidades de un servicio o una API, sin necesidad de acceder al código fuente_, sin documentación adicional o inspección de las peticiones. Cuando se diseña correctamente una API através de esta especificación, un desarrollador puede comprender e interactuar con el servicio mucho más fácil ya que se eliminan las suposiciones al llamar a un servicio.

Todo esto, no quiere decir que se tiene que volver a escribir el código de una API existente que no fue diseñada con estas especifícaciones ni tampoco exige un proceso de desarrollo específico. Lo que si requiere es que las capacidades del servicio se describan en la estructura de la especificación OpenAPI para _establecer interacciones claras con una API REST._

## Manos a la obra

Básicamente, un archivo de OpenAPI nos permite describir los aspectos de una API como:

* Información general sobre la API
* Rutas disponibles (/ recursos)
* Operaciones disponibles en cada ruta
* Entrada / Salida para cada operación

Un archivo de especificación de API abierta se puede escribir en JSON o YAML.

Para ejemplo definiré en documento en YAML que describe una API que nos permite obtener el nombre de un aeropuerto consultando su código IATA.

```bash

    swagger: "2.0"
    info:
      title: "Airport Codes"
      description: "Get the name of an airport from its three-letter IATA code."
      version: "1.0.0"
    # This field will be replaced by the deploy_api.sh script.
    host: "YOUR-PROJECT-ID.appspot.com"
    schemes:
      - "https"
    paths:
      "/airportName":
        get:
          description: "Get the airport name for a given IATA code."
          operationId: "airportName"
          parameters:
            -
              name: iataCode
              in: query
              required: true
              type: string
          responses:
            200:
              description: "Success."
              schema:
                type: string
            400:
              description: "The IATA code is invalid or missing."
```

Como se puede observar, el documento simplementa ha definido como se puede interactuar con esta API. El desarrollador al leer esto, sabrá que tiene un path "/airportName" que podrá consultar, también podrá saber los parametros que se permiten y los códigos de respuesta que podrá obtener.

El lenguaje con el que esta supuesta API está construida no importa, simplemente al ser una interfaz, el desarrollador puede comenzar a escribir código consumiendo este servicio y esa es la finalidad del diseño de la API. Servir de manual de usuario.

Ahora bien, hay varias herramientas compatibles con este formato una de ellas es Swagger UI, que generan a partir de documentos como este, un sitio completo de documentación listo para servirse en HTML. Incluso Swagger puede generar los formularios de los parametros para comenzar a consumir esta API.

## Swagger UI

Swgger UI permite a cualquier persona, visualizar e interactuar con los recursos de la API sin tener implementada la lógica de implementación. Se genera automáticamente a partir de escribir archivos que cumplan con la especificación OpenAPI, con esto, la documentación visual se crea y  facilita la implementación de back-end y el consumo del lado del cliente.

Tomando como ejemplo el archivo anterior respecto a la API del aeropuerto, generé el sitio de documentación de esta API con Swagger. Aquí hay varias opciones, se puede descargar Swagger UI o usar SwaggerHub, que es la versión en la nube de todas las herramientas.

A manera de ejemplificar el poder de todo este tema de OpenAPI y entender por que es una buena idea usarlo, usé el SwaggerHub para generar el sitio de documentación del ejemplo de archivo YAML que estamos usando y se ve así:

![](/uploads/Screenshot-20180711115151-1032x783.png)

EL sitio generado, también sirve para comenzar a hacer peticiones a la API ya que integra un formunlario para enviar los argumentos que se necesitan y realizar las peticiones HTTP desde ahí sin necesidad de hacer una petición con CURL o usar Postman.

Es una API con un solo endpoint, y es un GET, lo sé, pero imaginas una API con 120 endpoints y diferentes operaciones y métodos para cada uno, con 3, 4 o 5 argumentos por cada uno? Con Swagger siguiendo la especificacióon de OpenAPI todo estaría hecho y los desarrolladores comenzarían a trabajar en el FrontEnd de inmediato.  =)

Checa todo lo que puedes hacer con  Swagger UI [aquí](https://swagger.io/tools/swagger-ui/).

## Flasgger

También existen extensiones por ejemplo para Flask, para generar la documentación de una API escrita en Python usando este framework. Aquí se puede ver un ejemplo de [Flasgger](https://github.com/rochacbruno/flasgger)

Para profundizar en el tema, se puede leer toda la especificación de OpenAPI [aquí](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#oasDocument/)