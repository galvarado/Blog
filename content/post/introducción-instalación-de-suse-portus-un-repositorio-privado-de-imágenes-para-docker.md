+++
comments = "true"
date = "2019-09-20T16:00:00+00:00"
image = "/uploads/portus.png"
tags = ["cloud", "containers"]
title = "Introducción + Instalación de SUSE Portus, un repositorio privado de imágenes para Docker "

+++

Si tu o tu empresa están buscando un Docker Registry privado con características de seguridad avanzadas y tener la capacidad de instalarlo de manera local, te va a encantar Portus. Pues no solo obtienes una solución sólida para almacenar las imágenes, sino que también obtienes la capacidad (instalando en conjunto Clair) de escanear tus imágenes en busca de vulnerabilidades.

### ¿Qué es Docker Registry?

Cuando trabajamos con Docker, debemos decidir dónde almacenaremos las imágenes de los contenedores. Docker Registry es una aplicación que gestiona el almacenamiento y la entrega de imágenes de contenedores Docker.

Docker tiene un registro público gratuito, Docker Hub, que puede alojar nuestras imágenes personalizadas, pero hay situaciones en las que no deseamos que nuestras imagen estén disponibles públicamente. Las imágenes generalmente contienen todo el código necesario para ejecutar una aplicación, por lo que es preferible utilizar un registro privado cuando se utiliza software propietario.

Si necesitamos restringir el acceso a nuestras imágenes de Docker, hay 3 opciones:

1\.Obtener una suscripción en Docker Hub que desbloquea la función para crear repositorios privados.

2\.Ejecutar una instancia local del registro de Docker, con es posible evitar por completo el uso de Docker Hub. Esta opción tiene dos limitaciones principales:

- Carece de cualquier forma de autenticación. Eso significa que todos los que tengan acceso al Registro de Docker pueden insertar y extraer imágenes. Eso también incluye la posibilidad de sobrescribir imágenes ya existentes.
- No hay forma de ver qué imágenes se han enviado al Registro de Docker. Debemos tomar notas manualmente de lo que se almacena dentro de él. Tampoco hay funcionalidad de búsqueda, lo que dificulta la colaboración. Estas limitaciones se resuelven instalando un registro de terceros.

3\.Ejecutar un registro de Docker de terceros, que contenga características de seguridad avanzadas. Esto último es Portus

### ¿Qué es Portus?

Portus es un servicio de código abierto que proporciona autenticación/ autorización y una interfaz de usuario para el Registro de Docker. Es una aplicación local que permite a los usuarios administrar y proteger los registros de Docker.

#### Ficha técnica

- Creado por SuSE, adoptado por usuarios de todo el mundo
- Liberado como código abierto (Licencia Apache 2.0)
- Registro de contenedores
- Enfoque: almacena, firma y escanea contenido
- Sitio web: [http://port.us.org/](http://port.us.org/ "http://port.us.org/")
- Repositorio:[https://github.com/SUSE/Portus](https://github.com/SUSE/Portus "https://github.com/SUSE/Portus")

#### Características de Portus

- Sincronización con nuestro registro privado para obtener qué imágenes y etiquetas que estén disponibles.
- Autenticación de usuarios con LDAP.
- Autenticación OAuth y OpenID-Connect
- Monitoreo de todas las actividades realizadas en su registro privado y en el propio Portus.
- Busqueda de repositorios y etiquetas dentro del registro privado.
- Destaca repositorios favoritos.
- Deshabilitar usuarios temporalmente.
- Opcionalmente, usar tokens de aplicaciones para una mejor seguridad.

Además, se integra con Clair, que escanea las imágenes de contenedores en busca de vulnerabilidades de seguridad. Juntas, estas herramientas brindan una seguridad incomparable.

#### Clair

[Clair es un proyecto de código abierto ](https://github.com/coreos/clair)para el análisis estático de vulnerabilidades en contenedores de aplicaciones.

Los datos de vulnerabilidades se importan continuamente desde un conjunto conocido de bases de datos y se correlacionan con el contenido indexado de las imágenes del contenedor para producir listas de vulnerabilidades .

Cuando Portus se instala en un entorno sin conexión a Internet, Clair no puede obtener datos de las bases de datos de vulnerabilidades públicas. En estos escenarios, el administrador debe actualizar manualmente la base de datos de Clair.

### Instalación de Portus

El siguiente procediemiento despliega Portus en un ambiente basado en contenedores, usaré un host CentOS 7.6 pero no hay dependencia del sistema operativo, el requisito es ejecutar Docker.

En mi caso desplegué un droplet en DigitalOcean con 2 vCPUs y 2 GB RAM.

Agregué en mi DNS un record A a la IP pública que me asignó DO para que resolviera hacia registry.galvarado.com.mx ya que usaremos un certificado SSL generado por Certbot y es necesario definir un FQDN para el host pues el certificado está ligado a el

**Instalar Docker**

Configurar el repositorio de docker-ce:

    $ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

Instalar docker-ce:

    $ sudo yum install docker-ce

Agregar nuestro usuarioal grupo de docker:

    $ sudo usermod -aG docker $(whoami)

Habilitar docker para que inicie automaticamente en el arranque del sistema:

    $ sudo systemctl enable docker.service

Finalmente iniciar el servicio de Docker:

    $ sudo systemctl start docker.service

Para verificar:

    $ docker version
    Client: Docker Engine - Community
     Version:           19.03.2
     API version:       1.40
     Go version:        go1.12.8
     Git commit:        6a30dfc
     Built:             Thu Aug 29 05:28:55 2019
     OS/Arch:           linux/amd64
     Experimental:      false

**Instalar docker-compose**

Descargamos el binario par ala ultima versión estable

    sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose

Aplicamos permisos

    $ sudo chmod +x /usr/local/bin/docker-compose

Para verificar la instalación

    $ docker-compose version
    docker-compose version 1.24.1, build 4667896
    docker-py version: 3.7.3
    CPython version: 2.7.5
    OpenSSL version: OpenSSL 1.0.2k-fips  26 Jan 2017

**Clonar el repositorio de Portus**

Instalar git:

    $ sudo yum install git

Clonar el repo:

    git clone https://github.com/SUSE/Portus.git

Usaremos el template que incluye la configuración de SSL y Clair

    /Portus/examples/compose/docker-compose.clair-ssl.yml

Editar el archivo `.env` en `/Portus/examples/compose/.env`

    MACHINE_FQDN=zxc.zxc.net
    SECRET_KEY_BASE=b494a25faa8d22e430e843e220e424e10ac84d2ce0e64231f5b636d21251eb6d267adb042ad5884cbff0f3891bcf911bdf8abb3ce719849ccda9a4889249e5c2
    PORTUS_PASSWORD=12341234
    DATABASE_PASSWORD=portus

**Certificado SSL**

Usaremos Certbot para generar el certificado y el webserver será nginx

Instalamos los paquetes requeridos

    $ sudo yum install httpd mod_ssl python-certbot-nginx

Para verificar

    $ certbot --version
    certbot 0.37.2

Ahora para generar el certificado SSL:

    sudo certbot

Respondemos a todas las perguntas. Aqui es donde es necesario contar con el FQDN definido. Si no lo has definido, edita /etc/hostname y colocalo. En mi caso es registry.galvarado.com.mx:

    $ sudo certbot certonly --nginx
    Saving debug log to /var/log/letsencrypt/letsencrypt.log
    Plugins selected: Authenticator nginx, Installer nginx
    No names were found in your configuration files. Please enter in your domain
    name(s) (comma and/or space separated)  (Enter 'c' to cancel): registry.galvarado.com.mx
    Obtaining a new certificate
    Performing the following challenges:
    http-01 challenge for registry.galvarado.com.mx
    nginx: [error] invalid PID number "" in "/run/nginx.pid"
    Waiting for verification...
    Cleaning up challenges
    IMPORTANT NOTES:
     - Congratulations! Your certificate and chain have been saved at:
       /etc/letsencrypt/live/registry.galvarado.com.mx/fullchain.pem
       Your key file has been saved at:
       /etc/letsencrypt/live/registry.galvarado.com.mx/privkey.pem
       Your cert will expire on 2019-12-19. To obtain a new or tweaked
       version of this certificate in the future, simply run certbot
       again. To non-interactively renew *all* of your certificates, run
       "certbot renew"
     - If you like Certbot, please consider supporting our work by:
       Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
       Donating to EFF:                    https://eff.org/donate-le

Los archivos se deben genetar el la siguiente ruta:

    cd /etc/letsencrypt/live/registry.galvarado.com.mx/
    $  ls
    cert.pem  chain.pem  fullchain.pem  privkey.pem  README

Después de generar el certificado, lo agregamos a Portus. Copiar el archivo `.pem` del certificado y de la llave y renombrarlo como `**portus:**`

    $ cp /etc/letsencrypt/live/registry.galvarado.com.mx/fullchain.pem ~/Portus/examples/compose/secrets/portus.crt
    $ cp /etc/letsencrypt/live/registry.galvarado.com.mx/privkey.pem ~/Portus/examples/compose/secrets/portus.ke

**Iniciar Portus**

Levantamos los contendedores con docker-compose

    $ docker-compose -f docker-compose.clair-ssl.yml up -d
    compose_db_1 is up-to-date
    Starting compose_postgres_1 ...
    compose_portus_1 is up-to-date
    compose_registry_1 is up-to-date
    Starting compose_postgres_1 ... done
    Starting compose_nginx_1    ... done
    compose_clair_1 is up-to-date
    [root@registry compose]# docker-compose ps
            Name                      Command               State                       Ports
    --------------------------------------------------------------------------------------------------------------

    compose_background_1   /init                            Up      3000/tcp
    compose_db_1           /docker-entrypoint.sh mysq ...   Up      3306/tcp
    compose_nginx_1        nginx -g daemon off;             Up      0.0.0.0:443->443/tcp, 0.0.0.0:80->80/tcp
    compose_portus_1       /init                            Up      0.0.0.0:3000->3000/tcp
    compose_registry_1     /entrypoint.sh /bin/sh /et ...   Up      0.0.0.0:5000->5000/tcp, 0.0.0.0:5001->5001/tcp

Podemos ver los 7 contenedores que se inician con la plantilla de compose:

    docker ps
    CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS              PORTS                                      NAMES
    b6d9001bdd95        nginx:alpine                  "nginx -g 'daemon of…"   20 minutes ago      Up 7 minutes        0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp   compose_nginx_1
    5acb65949a91        opensuse/portus:head          "/init"                  20 minutes ago      Up 12 minutes       3000/tcp                                   compose_background_1
    5b0b81bf509b        registry:2.6                  "/entrypoint.sh /bin…"   20 minutes ago      Up 12 minutes       0.0.0.0:5000-5001->5000-5001/tcp           compose_registry_1
    cb7ae5bf37a4        quay.io/coreos/clair:v2.0.1   "/clair -config /cla…"   20 minutes ago      Up 7 minutes        0.0.0.0:6060-6061->6060-6061/tcp           compose_clair_1
    13c97afc2290        opensuse/portus:head          "/init"                  20 minutes ago      Up 12 minutes       0.0.0.0:3000->3000/tcp                     compose_portus_1
    36de8d5fdc72        mariadb:10.0.23               "/docker-entrypoint.…"   20 minutes ago      Up 12 minutes       3306/tcp                                   compose_db_1
    b4c55545626a        postgres:10-alpine            "docker-entrypoint.s…"   20 minutes ago      Up 7 minutes        5432/tcp                                   compose_postgres_1

- 1 contenedor de nginx,
- 1 contenedor Portus
- 1 contenedor Portus background
- 1 contenedor para el docker-registry,
- 1 contenedor para BD en postgreSQL
- 1 contenedor para BD en MariaDB,
- 1 contenedor para el servicio de vulnerabilidades de Clair

**Acceder a Portus**

Vamos ala dirección del servidor donde iniciamos los servicios, en mi caso cree un record DNS como mencionaba para utilizar el FQDN. Si no creas un record en el DNS puedes modificar el archivo /etc/hosts de tu computadra para que la resolución sea local, pero el navegador solo podrá acceder por el FDQN debido al certificado SSL.

En mi caso:

[https://registry.galvarado.com.mx/](https://registry.galvarado.com.mx/ "https://registry.galvarado.com.mx/")

![](/uploads/Captura_realizada_el_2019-09-20_13.27.35.png)

Después de crear un usuario admin, configuramos el registro, en este caso es el mismo servicio inicado por docker-compose en el puerto 5000 del mismo host.

![](/uploads/Captura_realizada_el_2019-09-20_13.36.31.png)

**Subir una imagen a portus**

Para fines prácticos voy a descargar una imagen existente, pero podríamos contrsuir una imagen desde un Dockerfile también.

Nos logueamos al nuevo registro desde nuestra consola:

    $ docker login registry.galvarado.com.mx

Descargamos la imagen oficial de MySQL de DockerHub

    $ docker pull mysql
    Using default tag: latest
    latest: Pulling from library/mysql
    8f91359f1fff: Pull complete
    6bbb1c853362: Pull complete
    e6e554c0af6f: Pull complete
    f391c1a77330: Pull complete
    414a8a88eabc: Pull complete
    fee78658f4dd: Pull complete
    9568f6bff01b: Pull complete
    5a026d8bbe50: Pull complete
    07f193b54ae1: Pull complete
    1e404375a275: Pull complete
    b81b2ef0e430: Pull complete
    2f499f36bd40: Pull complete
    Digest: sha256:6d95fa56e008425121e24d2c01b76ebbf51ca1df0bafb1edbe1a46937f4a149d
    Status: Downloaded newer image for mysql:latest
    docker.io/library/mysql:latest

Tageamos la imagen que descargamos y la subimos a nuestro flamante repositorio privado y seguro. Para Taggear la imagen usamos el comando docker tag como se muestra a continuación:

    $ docker tag [IMAGE] [REGISTRY]/[NAMESPACE]/[IMAGE:TAG]

En mi caso:

    $ docker tag mysql:latest  registry.galvarado.com.mx/galvarado/mysql:latest
    $ docker push registry.galvarado.com.mx/galvarado/mysql:latest
    1cfb4d403fde: Pushed
    e47b5971b1f1: Pushed
    9ac6573d19b0: Pushed
    3cd5c95dfa08: Pushed
    05f26d9a462a: Pushed
    9e88946b01ba: Pushed
    7acae26d323c: Pushed
    9a341d74c9b2: Pushed
    5547ac6d39e8: Pushed
    683d7a4130fe: Pushed
    7288a4c980c6: Pushed
    e9dc98463cd6: Pushed
    latest: digest: sha256:2e4114bdc9dd797549f6df0cffb5f6cb6354bef9d96223a5935b6b17aea03840 size: 2828

Así se ve en portus:

![](/uploads/Captura_realizada_el_2019-09-20_14.42.07.png)

Podemos observar la parte del análisis de vulnerabilidades de Clair claramente, detecta varias vulnerabilidades, al ver el detalle observamos:

![](/uploads/Captura_realizada_el_2019-09-20_14.42.24.png)

Lo que resta es subir más imagenes y crear más usuarios para ser usado por el resto de la organización.

¿Que te parece? Tu propio Registro de imagenes, sencillo de instalar, protegido con SSL y autenticación e integrado Clair para escanear las imagenes en búsqueda de vulnerabilidaddes.

Si te es útil por favor comparte :)
