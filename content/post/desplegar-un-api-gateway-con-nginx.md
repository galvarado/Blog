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

## Proyecto Demo | Book Store API

Nuestro proyecto demo basado en docker es es la API para una tienda online de Libros.  La API de la tienda se implementa como una colección de servicios.  Para nuestros fines ilustrativos, tenemos  2 servicios diferentes para atender la tienda online: Catálogo y Tiendas. Estos se implementan como servicios separados construidos con diferentes stacks de tecnología y nuestro API Gateway los publica como una única API.

En el siguiente diagrama ilustramos el propósito:

![](/uploads/bookstoreapigateway.png)

Todo el código para seguir el tutorial está disponible en: [https://github.com/galvarado/nginx-api-gateway](https://github.com/galvarado/nginx-api-gateway "https://github.com/galvarado/nginx-api-gateway")

## FastAPI - API de Catalogo

Usamos Python para construir nuestra API de catalogo con el framework [FastAPI](). Esta API se encarga de los libros existentes en almacén, con sus existencias y precios.

Dado que la parte que nos interesa es el API Gateway, el catalogo no usará base de datos, sino que es una estructura sencilla estática. Sin embargo, puedes implementar el proyecto con una BD y modificar el código.

Para iniciar nuestra API de catalogo, entramos al directorio catalog y construimos la imagen:

    $ docker build -t fastapi-catalog .

Ahora, iniciamos el contenedor de la API  exponiendola en el host en el puerto 8888 con:

    $ docker run -d --name fastapi-catalog -p 8888:80 fastapi-catalog

Probamos la API, para obtener todos los libros:

    $ curl -i --request GET  http://localhost:8888/books
    
    HTTP/1.1 200 OK
    date: Thu, 09 Sep 2021 20:55:59 GMT
    server: uvicorn
    content-length: 221
    content-type: application/json
    
    [{"id":1,"name":"Pedro Páramo","author":"Juan Rulfo","price":320},{"id":2,"name":"El Laberinto de la Soledad","author":"Octavio Paz"},{"id":3,"name":"La casa junto al rio","author":"Elena Garro"}]

Para obtener el detalle de un libro en particular, consultamos por su ID:

    $ curl -i --request GET  http://localhost:8888/books/3
    
    HTTP/1.1 200 OK
    date: Thu, 09 Sep 2021 20:57:00 GMT
    server: uvicorn
    content-length: 73
    content-type: application/json
    
    {"id":3,"name":"La casa junto al rio","author":"Elena Garro","price":410, "existence":10}

## Gin - API de Tiendas

Usamos Go para construir nuestra API de tiendas, esta vez con el framework [Gin](https://gin-gonic.com/docs/).  Esta API nos da las sucursales físicas (tiendas)  que forman parte de nuestra tienda de libros.

Para iniciar nuestra API de tiendas, entramos al directorio stores y construimos la imagen:

    $ docker build -t gin-stores .

Ahora, iniciamos el contenedor de la API exponiendola en el host en el puerto 88889 con:

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

Listo, en este momento nuestros dos servicios responden peticiones dado que con Docker estamos publicandolos en un puerto del host.  Ahora, implementaremos el api gateway y dejaremos de publicar estos servicios en el host, siendo accesibles solo dentro de la red de docker, dado que lo único que nos interesa publicar es el gateway de nginx.

## Nginx como API Gateway

Vamos a configurar Nginx para que actue como nuestro Gateway, a continuación la estructura de archivos que crearemos:

    etc/
    └── nginx/
        ├── api_conf.d/ ………………………………… Subdirectorio de configuración para cada API
        │   └── bookstore_api.conf …… Definición y politicas de la API (Bookstore)
        ├── api_json_errors.conf ………………… Definición de respuestas a errores
        ├── api_keys.conf ………………… Definición de llaves de autenticación
        ├── api_gateway.conf …………………… Configuración raiz del API Gateway
        ├── nginx.conf …………………… Configuración raiz de nginx

Los directorios y nombres de archivo para toda la configuración del API Gateway tienen el prefijo api_. Cada uno de estos archivos y directorios habilita una función o capacidad diferente del gateway  y se explica en detalle a continuación.

### Archivo nginx.conf

Toda la configuración de NGINX comienza con el archivo de configuración principal: _nginx.conf_. Para leer la configuración del Gateway, agregamos una directiva include en el bloque http en nginx.conf que hace referencia al archivo que contiene la configuración del gateway:  _api_gateway_._conf_.

Entonces agregamos la linea include (linea 21 a continuación) al archivo nginx.conf:

    user  nginx;
    worker_processes  auto;
    error_log  /var/log/nginx/error.log notice;
    pid        /var/run/nginx.pid;
    load_module /etc/nginx/modules/ngx_http_js_module.so;
    
    events {
        worker_connections  1024;
    }
    
    http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;
        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';
        access_log  /var/log/nginx/access.log  main;
        sendfile        on;
        #tcp_nopush     on;
        keepalive_timeout  65;
        include /etc/nginx/api_gateway.conf; # All API gateway configuration
    }