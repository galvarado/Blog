+++
comments = "true"
date = 2021-05-05T05:00:00Z
image = "/uploads/nginx_api_gateway.png"
tags = ["devops", "architecture", "cloud", "containers"]
title = "Desplegar un API Gateway con Nginx"

+++
En el corazón de las arquitecturas de aplicaciones modernas se encuentran  las APIs. Estas proporciona una interfaz común, independientemente de la escala de la aplicación, desde un microservicio de propósito único hasta una aplición monolitica integral. 

Básicamente, API Gateway es un proxy inverso a los microservicios y actúa como un punto de entrada único al sistema. Todas las solicitudes de los clientes pasan primero por API Gateway. Luego, este enruta las solicitudes al microservicio o endpoint apropiado. 

Un API Gateway nos ayuda a resolver facilmente cuestiones como:

* Habilitar autenticación para un endpoint
* Publicar un endpoint con HTTPS
* Enrutamiento avanzado 
* Limitar el consumo de un endpoint (rate limit)
* Balanceo de carga

Una de las principales ventajas de utilizar un API Gateway es que encteway es que este encapsula la estructura interna de las servicios. En lugar de tener que invocar servicios específicos, los clientes simplemente hablan con el  API Gateway y este  proporciona a cada tipo de cliente una API específica. Esto reduce el número de viajes de ida y vuelta entre el cliente y la aplicación. 

¿Desventajas? Un API Gateway es otro componente de alta disponibilidad que debe desarrollarse, implementarse y administrarse. También existe el riesgo de que  se convierta en un cuello de botella de desarrollo. Los desarrolladores deben actualizar el API Gateway para exponer los puntos finales de cada microservicio. Es importante que el proceso de actualización de sea lo más ligero posible. De lo contrario, los desarrolladores se verán obligados a esperar.  Sin embargo, a pesar de estos inconvenientes, para la mayoría de las aplicaciones del mundo real tiene sentido utilizar un API Gateway.

## Nginx como API Gateway

A continuación veremos como lograr obtener estos beneficios desplegando nginx como API Gateway usando Docker, sin embargo, las configuraciones aplican para un despliegue en un servidor tradicional. Nuestro API Gateway brindará de HTTPS y Autenticación a un endpoint simple escrito en python que no tiene SSL ni forma de solicitar autenticación.