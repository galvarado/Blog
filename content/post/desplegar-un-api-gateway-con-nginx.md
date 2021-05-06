+++
comments = "true"
date = 2021-05-05T05:00:00Z
draft = true
image = "/uploads/nginx_api_gateway.png"
tags = ["devops", "architecture", "cloud", "containers"]
title = "Desplegar un API Gateway con Nginx"

+++
Hoy en día no podemos hablar de  arquitecturas de aplicaciones modernas sin mencionar a las APIs. Estas proporciona una interfaz común, independientemente de la escala de la aplicación, desde un microservicio de propósito único hasta una aplición monolitica integral.

Básicamente, un API Gateway es un proxy inverso a los servicios y actúa como un punto de entrada único a todo el sistema. Todas las solicitudes de los clientes pasan primero por el API Gateway, luego este enruta las solicitudes alservicio o endpoint apropiado.

Una de las principales ventajas de utilizar un API Gateway es que este encapsula la estructura interna de las servicios. En lugar de tener que invocar servicios específicos, los clientes simplemente hablan con el  API Gateway y este  proporciona a cada tipo de cliente una API específica. Esto reduce el número de viajes de ida y vuelta entre el cliente y la aplicación.

Un API Gateway nos ayuda a resolver fácilmente cuestiones como:

* Habilitar autenticación para un endpoint
* Publicar un endpoint con HTTPS
* Enrutamiento avanzado
* Limitar el consumo de un endpoint (rate limit)
* Balanceo de carga

¿Desventajas? Un API Gateway es otro componente de alta disponibilidad que debe desarrollarse, implementarse y administrarse. También existe el riesgo de que  se convierta en un cuello de botella de desarrollo. Es importante que el proceso de actualización o publicación de nuevos servicios sea  lo más ligero posible. De lo contrario, los desarrolladores se verán obligados a esperar.  Sin embargo, a pesar de estos inconvenientes, para la mayoría de las aplicaciones del mundo real tiene sentido utilizar un API Gateway.

## Nginx como API Gateway

A continuación veremos como lograr obtener estos beneficios desplegando nginx como API Gateway.   Nuestro API Gateway brindará de HTTPS y Autenticación a APIs de distinto proposito y desarrolladas con diferentes stacks de tecnología.

En el siguiente diagrama ilustramos el proposito de lo que vamos a construir: