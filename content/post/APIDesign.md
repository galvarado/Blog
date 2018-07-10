---
title: "¿Cómo diseñar una API? Introducción a OpenAPI Specification"
date: 2018-07-10
categories:
- development
- cloud
autoThumbnailImage: false
thumbnailImagePosition: "top"
thumbnailImage: images/api.jpg
metaAlignment: center
---
¿Cómo debo diseñar mi API? ¿Cómo voy a exponerla a distintos desarrolladores? Hoy en día las APIs son la parte modular de cualquier plataforma. Como sabemos, una API es un conjunto de funciones y procedimientos que cumplen una o muchas funciones con el fin de ser utilizadas por otro software. Todos los productos necesitan un manual de uso  y las APIs no son la excepción. Es por eso que hoy escribí sobre OpenAPI, que es un estandar para crear este manual de uso para nuestra API.

<!--more-->

Hoy en día las APIs son la parte modular de cualquier plataforma. Como sabemos, una API es un conjunto de funciones y procedimientos que cumplen una o muchas funciones con el fin de ser utilizadas por otro software, debido a esto, es importante planear muy bien más antes de salir y comenzar a implementar una API. Aquí es donde entran en juego el diseño, los estándares y las especificaciones, como OpenAPI.

## OpenAPI Specification

Todos los productos necesitan un manual de uso, y las APIs no son la excepción. OpenAPI es un estandar para crear este manual de uso para nuestra API. La Especificación[OpenAPI] (https://github.com/OAI/OpenAPI-Specification) es una especificación abierta impulsada por la comunidad y es ahora un proyecto colaborativo de la Fundación Linux. En los últimos años, Swagger se ha convertido en el estándar de facto para definir o documentar una API y ahora se ha movido como un proyecto Opensource y se ha renombrado como OpenAPI Spec. La versión 3 ha estado en proceso por un tiempo y ahora ha sido liberada, de esta estarémos hablando.

Las características más importantes de OpenAPI son las siguientes:

- Ayuda a establecer un buen diseño de las APIs
- Documentación completa
- Testing más rápido gracias a la generación de un sandbox
- Mejora el Time to market 
- Generación de un portal de documentación que describe la API, en formaato human-readable

Pero si hay que resumirlo en pocas palabras, *OpenAPI permite descubrir y comprender las capacidades de un servicio o una API, sin necesidad de acceder al código fuente*, sin documentación adicional o inspección de las peticiones. Cuando se diseña correctamente una API através de esta especificación, un desarrollador puede comprender e interactuar con el servicio mucho más fácil ya que se eliminan las suposiciones al llamar a un servicio.

Todo esto, no quiere decir que se tiene que volver a escribir el código de una API existente que no fue diseñada con estas especifícaciones ni tampoco exige un proceso de desarrollo específico. Lo que si requiere es que las capacidades del servicio se describan en la estructura de la especificación OpenAPI para *establecer interacciones claras con una API REST.*


## Manos a la obra

Básicamente, un archivo de OpenAPI nos permite describir los aspectos de una API como:

- Información general sobre la API
- Rutas disponibles (/ recursos)
- Operaciones disponibles en cada ruta 
- Entrada / Salida para cada operación

Un archivo de especificación de API abierta se puede escribir en JSON o YAML. 

Para ejemplo definiré en documento en YAML que describe una API que nos permite obtener el nombre de un aeropuerto consultando su código IATA.

```bash

openapi: "3.0"
    info:
      title: "Códigos de aeropuertos"
      description: "Obtener el nombre de un aeropuerto desde su código IATA de 3 letras."
      version: "1.0.0"
    host: "getairport.com
    schemes:
      - "https"
    paths:
      "/airportName":
        get:
          description: "Obtener el nombre del aeropuerto para un código IATA dado."
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
              description: "El código IATA es inválido"
```


Como se puede observar, el documento simplementa ha definido como se puede interactuar con esta API. El desarrollador al leer esto, sabrá que tiene un path "/airportName" que podrá consultar, también podrá saber los parametros que se permiten y los códigos de respuesta que podrá obtener. 

El lenguaje con el que esta supuesta API está construida no importa, simplemente al ser una interfaz, el desarrollador puede comenzar a escribir código consumiendo este servicio y esa es la finalidad del diseño de la API. Servir de manual de usuario. 

Ahora bien, hay varias herramientas compatibles con este formato una de ellas es Swagger UI, que generan a partir de documentos como este, un sitio completo de documentación listo para servirse en HTML. Incluso Swagger puede generar los formularios de los parametros para comenzar a consumir esta API. También existen extensiones por ejemplo para Flask, para generar la docuementación de una API escrita en Python usando este framework. Aquí se puede ver un ejemplo de [Flasgger] (https://github.com/rochacbruno/flasgger)

Para profundizar en el tema, se puede leer todala especificación de OpenAPI [aquí](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#oasDocument/) y sonbe  Swagger UI [aquí](https://swagger.io/tools/swagger-ui/)

