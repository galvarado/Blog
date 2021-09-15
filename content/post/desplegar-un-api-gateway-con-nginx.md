+++
comments = "true"
date = 2021-05-05T05:00:00Z
image = "/uploads/nginx_api_gateway.png"
tags = ["devops", "architecture", "cloud", "containers"]
title = "Desplegar un API Gateway con Nginx"

+++
Hoy en día no podemos hablar de  arquitecturas de aplicaciones modernas sin mencionar a las APIs. Estas proporciona una interfaz común, independientemente de la escala de la aplicación, desde un microservicio de propósito único hasta una aplicaión monolítica integral.

Básicamente, un API Gateway es un proxy inverso a los servicios y actúa como un punto de entrada único a todo el sistema. Todas las solicitudes de los clientes pasan primero por el API Gateway, luego este enruta las solicitudes al servicio o endpoint apropiado.

Una de las principales ventajas de utilizar un API Gateway es que este encapsula la estructura interna de las servicios. En lugar de tener que invocar servicios específicos, los clientes simplemente hablan con el  API Gateway y este  proporciona a cada tipo de cliente una API específica. Esto reduce el número de viajes de ida y vuelta entre el cliente y la aplicación.

Un API Gateway nos ayuda a resolver fácilmente cuestiones como:

* Habilitar autenticación para un endpoint
* Publicar un endpoint con HTTPS
* Enrutamiento avanzado
* Limitar el consumo de un endpoint (rate limit)
* Balanceo de carga

¿Desventajas? Un API Gateway es otro componente de alta disponibilidad que debe desarrollarse, implementarse y administrarse. También existe el riesgo de que  se convierta en un cuello de botella de desarrollo. Es importante que el proceso de actualización o publicación de nuevos servicios sea  lo más ligero posible. De lo contrario, los desarrolladores se verán obligados a esperar.  Sin embargo, a pesar de estos inconvenientes, para la mayoría de las aplicaciones del mundo real tiene sentido utilizar un API Gateway.

## Proyecto Demo

Nuestro proyecto demo es la API para una tienda online de Libros.  La API de la tienda se implementa como una colección de servicios.  Para nuestros fines ilustrativos, tenemos  2 servicios diferentes para atender la tienda online: Catálogo y Tiendas. Estos se implementan como servicios separados construidos con diferentes stacks de tecnología y nuestro API Gateway los publica como una única API.

En el siguiente diagrama ilustramos el propósito:

![](/uploads/bookstoreapigateway.png)

Todo el código para seguir el tutorial está disponible en: [https://github.com/galvarado/nginx-api-gateway](https://github.com/galvarado/nginx-api-gateway "https://github.com/galvarado/nginx-api-gateway")

## FastAPI - API de Catalogo

Usamos Python para construir nuestra API de catalogo con el framework, FastAPI. Esta API se encarga de los libros existentes en almacén, con sus existencias y precios.

Dado que la parte que nos interesa es el API Gateway, el catalogo no usará base de datos, sino que es una estructura sencilla estática. Sin embargo, puedes implementar el proyecto con una BD y modificar el cógido.

Para iniciar nuestra API de catalogo, entramos al directorio catalog y construimos la imagen:

    $ docker build -t fastapi-catalog .

Ahora, iniciamos el contenedor de la API con:

    $ docker run -d --name fastapi-catalog -p 8888:80 fastapi-catalog

Probamos la API, para obtener todos los libros:

    $ curl -i --request GET  http://localhost/books
    
    HTTP/1.1 200 OK
    date: Thu, 09 Sep 2021 20:55:59 GMT
    server: uvicorn
    content-length: 221
    content-type: application/json
    
    [{"id":1,"name":"Pedro Páramo","author":"Juan Rulfo","price":320},{"id":2,"name":"El Laberinto de la Soledad","author":"Octavio Paz"},{"id":3,"name":"La casa junto al rio","author":"Elena Garro"}]

Para obtener el detalle de un libro en particular, consultamos por su ID:

    $ curl -i --request GET  http://localhost/books/3
    
    HTTP/1.1 200 OK
    date: Thu, 09 Sep 2021 20:57:00 GMT
    server: uvicorn
    content-length: 73
    content-type: application/json
    
    {"id":3,"name":"La casa junto al rio","author":"Elena Garro","price":410, "existence":10}

## Gin - API de Tiendas

Usamos Go para construir nuestra API de tiendas, esta vez con el framework [Gin](https://gin-gonic.com/docs/).  Esta API nos da las sucursales físicas (tiendas)  que forman parte de la cadena de libros.

Para iniciar nuestra API de tiendas, entramos al directorio stores y construimos la imagen:

    $ docker build -t gin-stores .

Ahora, iniciamos el contenedor de la API con:

    $ docker run -d --name gin-stores-catalog -p 8889:80 gin-stores

Probamos la API, para obtener todas las tiendas:

    $ curl -i http://localhost:8889/stores
    
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    Date: Wed, 15 Sep 2021 02:53:13 GMT
    Content-Length: 414
    
    [
        {
            "id": "1",
            "name": "Sucursa Cielo",
            "location": "Av Cielo #567. Deelgación Benito Juárez. Ciudad de México."
        },
        {
            "id": "2",
            "name": "Sucursal Alfa",
            "location": "Calle Alfa #22. Guadalajara, Jalisco."
        },
        {
            "id": "3",
            "name": "Sucursal Guerrero",
            "location": "Boulevard de la paz #3456. Acapulco. Guerrero."
        }
      ]

## Nginx como API Gateway

A continuación veremos como lograr obtener estos beneficios desplegando nginx como API Gateway.  Este brindará de HTTPS y Autenticación a APIs de distinto propósito y desarrolladas con diferentes stacks de tecnología.