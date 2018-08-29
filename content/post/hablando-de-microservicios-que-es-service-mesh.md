+++
categories = ["microservices"]
date = "2018-08-29T08:55:45-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = "/uploads/mesh.png"
thumbnailImagePosition = "top"
title = "Hablando de microservicios...¿Qué es Service Mesh?"
undefined = ""

+++
Cómo toda arquitectura, los microservicios tienen muchas ventajas, pero tambien se introducen nuevos retos. Cuando se atomiza una aplicación en base a microservicios, una parte clave nuestra solución depende de la comunicación vía red entre diversos componentes. 

Un service mesh,  es una capa dentro de la  infraestructura  de una aplicación de microservicios que hace que la comunicación entre servicios sea flexible, confiable y rápida. Proporciona descubrimiento de servicios, equilibrio de carga, cifrado, autenticación y autorización, soporte para el patrón de interruptor de circuito (circuit-breaker) entre otras capacidades.

## ¿Porqué es necesario un Service Mesh?

En las arquitecturas monolíticas, tratamos casi exclusivamente con tráfico norte-sur, pero con microservicios, debemos  tratar con el tráfico este-oeste, ya que con los monolitos, los diferentes componentes se comunican  entre sí  mediante llamadas dentro de la aplicación. Con microservicios,  reemplazamos las llamadas dentro de la aplicación con comunicación entre APIs a través de la red.  Esto significa que los diferentes servicios dentro de nuestra arquitectura no tienen por que saber el uno del otro, mientras cada  API sea consumible.

El tráfico este-oeste (entre APIs de nuestros microservicios) representa una mayor desafío, este tráfico demandan  más en términos de estandarización de llamadas entre cada microservicio, su  monitorización, el despliegue  y aprovisionamiento de recursos.

Normalmente los programadores de cada microservicio usaran algún protocolo de alto nivel, como  HTTP, sin tener en cuenta cómo viajan los paquetes dentro de  la red ni cómo se gestionan la misma. Esto representa una ventaja  cuando se desarrolla ya que cada equipo se centra en la lógica de negocio y no en las comunicaciones.

Además, como cada microservicio puede ser programado en un lenguje diferente, se busca solo homegenizar la comunicación exponiendo cada uno su propia API bajo un protocolo comú. Pero en cada lenguaje la libreria usada para tales fines será seguramente diferente. De nuevo, esto es una ventaja que da independencia, pero sigue sin resolver la estandarización necesaria en todo el entorno. 

## Service mesh como unificador de comunicaciones

La estandarización  es precisamente el problema que vienen a resolver los **_Service Mesh._** Con estos componentes se implementan patrones directamente sobre la infraestructura, no sobre el código. Por lo tanto, cuando realiza una comunicación de servicio a servicio, no se necesita implementar patrones de comunicación como circuit-breakers, ni se necesita manejar tiempos de espera en el código. Incluso el service mesh va más allá y proporciona otras funcionalidades  como descubrimiento de servicio, observabilidad, métricas, trazabilidad distribuida de las peticiones, seguridad, etc.

Estas son algunas de las características que un service mesh provee: