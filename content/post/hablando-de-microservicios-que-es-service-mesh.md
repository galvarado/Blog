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
Cómo toda arquitectura, los microservicios tienen muchas ventajas, pero tambien se introducen nuevos retos. Cuando se atomiza una aplicación en base a microservicios, una parte clave de nuestra solución depende de la comunicación vía red entre diversos componentes.

Un service mesh,  es una capa dentro de la  infraestructura  de una aplicación de microservicios que hace que la comunicación entre servicios sea flexible, confiable y rápida. Proporciona descubrimiento de servicios, equilibrio de carga, cifrado, autenticación y autorización, soporte para el patrón de interruptor de circuito (circuit-breaker) entre otras capacidades.

## ¿Porqué es necesario un Service Mesh?

En las arquitecturas monolíticas, tratamos casi exclusivamente con tráfico norte-sur, pero con microservicios, debemos  tratar con el tráfico este-oeste, ya que con los monolitos, los diferentes componentes se comunican  entre sí  mediante llamadas dentro de la aplicación. Con microservicios,  reemplazamos las llamadas dentro de la aplicación con comunicación entre APIs a través de la red.  Esto significa que los diferentes servicios dentro de nuestra arquitectura no tienen por que saber el uno del otro, mientras cada  API sea consumible.

El tráfico este-oeste (entre APIs de nuestros microservicios) representa una mayor desafío, este tráfico demandan  más en términos de estandarización de llamadas entre cada microservicio, su  monitorización, el despliegue  y aprovisionamiento de recursos.

Normalmente los programadores de cada microservicio usaran algún protocolo de alto nivel, como  HTTP, sin tener en cuenta cómo viajan los paquetes dentro de  la red ni cómo se gestiona la misma. Esto representa una ventaja  cuando se desarrolla ya que cada equipo se centra en la lógica de negocio y no en las comunicaciones.Además, como cada microservicio puede ser programado en un lenguaje diferente, se busca solo homegenizar la comunicación exponiendo cada uno su propia API bajo un protocolo común. Pero en cada lenguaje la librería usada para tales fines será seguramente diferente. De nuevo, esto es una ventaja que da independencia, pero sigue sin resolver la estandarización necesaria en todo el entorno.

## Service mesh para unificar la comunicación

La estandarización  es precisamente el problema que vienen a resolver los **_Service Mesh._** Con estos componentes se implementan patrones directamente sobre la infraestructura, no sobre el código. Por lo tanto, cuando se realiza una comunicación de servicio a servicio, no se necesita implementar patrones de comunicación como circuit-breakers, ni se necesita manejar tiempos de espera (timeouts) en el código. Incluso el service mesh va más allá y proporciona otras funcionalidades  como descubrimiento de servicio, observabilidad, métricas, trazabilidad distribuida de las peticiones, seguridad, etc.

Estas son algunas de las características que un service mesh provee:

* **Disponibilidad en la comunicación entre servicios**: patrones de Circuit-breaking, reintentos y timeouts, gestión de errores, balanceo de carga y failover…
* **Descubrimiento de servicios**: descubrimiento de los endpoints del servicio a través de un registro de servicio dedicado.
* **Enrutamiento**: enrutamiento de peticiones a versiones diferentes de servicios…
* **Observabilidad**: métricas, monitorización, logging y trazabilidad distribuidas.
* **Seguridad**: seguridad a nivel de transporte (TLS) y gestión de claves.
* **Autenticación/Autorización**.
* **Despliegue**: soporte nativo para contenedores (Docker, Kubernetes).
* **Protocolos de comunicación entre servicios**: HTTP/1.1, HTTP/2, gRPC…

Referencia: [https://medium.com/microservices-in-practice/service-mesh-for-microservices-2953109a3c9a](https://medium.com/microservices-in-practice/service-mesh-for-microservices-2953109a3c9a "https://medium.com/microservices-in-practice/service-mesh-for-microservices-2953109a3c9a")

## ¿Cómo funciona un Service Mesh?

Usando un service mesh como [Envoy](https://www.envoyproxy.io/) , [Linkerd](https://linkerd.io/) o [Istio](https://istio.io/) los microservicios  no se comunicarán directamente con los otros microservicios sino que todas las comunicaciones de servicio a servicio se realizarán en  el service mesh. 

Y esto sucede regularmente con la implementación de una instancia de proxy, implementada como side-car (para comprender más el concepto de side-car, [este articulo lo explica bastante bien](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns/)), para cada instancia de servicio. Lo que significa que este proxy se implementa junto la aplicación en una relación de uno a uno. Así la aplicación interactúa con el mundo exterior a través de su Proxy.

Además, todos los proxies(side-cars) del service mesh  son administrados centralmente por un una capa de control. 

![](/uploads/Untitled.png)

En el diagrama anterior se observa: 

1. Las aplicaciones solo se comunican con su proxy. 
2. Los proxy se comunican entre sí unicamente.
3. La capa de control gestiona a cada uno de los proxy de manera centralizada.

Al traducir a español **Service Mesh, significa Malla de servicio.** Esta malla de comunicación es precisamente la que se forma entre la comunicación de cada proxy y la capa de control.

Si te resulta útil, comparte =)