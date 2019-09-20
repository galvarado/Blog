+++
comments = "true"
date = "2019-09-20T15:00:00+00:00"
image = "/uploads/portus.png"
tags = ["cloud", "containers"]
title = "Introducción + Instalación de SuSE Portus, un repositorio privado de imágenes para Docker "

+++
Si tu o tu empresa están buscando un Docker Registry privado con características de seguridad avanzadas y tener la capacidad de instalarlo de manera  local, te va a encantar Portus. Pues  no solo obtienes una solución sólida para almacenar las imágenes, sino que también obtienes la capacidad (instalando en conjunto  Clair) de escanear tus imágenes en busca de vulnerabilidades.

### ¿Qué es Docker Registry?

Cuando trabajamos con Docker,  debemos decidir dónde almacenaremos las imágenes  de los contenedores. Docker Registry es una aplicación que gestiona el almacenamiento y la entrega de imágenes de contenedores Docker.

Docker  tiene un registro público gratuito, Docker Hub, que puede alojar nuestras imágenes  personalizadas, pero hay situaciones en las que no deseamos que nuestras imagen estén disponibles públicamente. Las imágenes generalmente contienen todo el código necesario para ejecutar una aplicación, por lo que es preferible utilizar un registro privado cuando se utiliza software propietario.

Si necesitamos restringir el acceso a nuestras imágenes de Docker, hay 3 opciones:

1\.Obtener una suscripción en Docker Hub que desbloquea la función para crear repositorios privados.

2\.Ejecutar una instancia local del registro de Docker, con es posible evitar por completo el uso de Docker Hub.  Esta opción  tiene dos limitaciones principales:

* Carece de cualquier forma de autenticación. Eso significa que todos los que tengan acceso al Registro de Docker pueden insertar y extraer imágenes. Eso también incluye la posibilidad de sobrescribir imágenes ya existentes.
* No hay forma de ver qué imágenes se han enviado al Registro de Docker. Debemos tomar notas manualmente de lo que se almacena dentro de él. Tampoco hay funcionalidad de búsqueda, lo que dificulta la colaboración. Estas limitaciones se resuelven instalando un registro de terceros.

3\.Ejecutar un registro de Docker de terceros, que contenga características de seguridad avanzadas. Esto último es Portus

### ¿Qué es Portus?

Portus es un servicio de código abierto que proporciona autenticación/ autorización  y una interfaz de usuario para el Registro de Docker. Es una aplicación local que permite a los usuarios administrar y proteger los registros de Docker.

#### Ficha técnica

* Creado por SuSE, adoptado por usuarios de todo el mundo
* Liberado como código abierto (Licencia Apache 2.0)
* Registro de contenedores y  Helm charts.
* Enfoque: almacena, firma y escanea contenido
* Proyecto en incubación por la CNCF:  [https://www.cncf.io/project/harbor/](https://www.cncf.io/project/harbor/ "https://www.cncf.io/project/harbor/")
* Sitio web:  [https://goharbor.io/](https://goharbor.io/ "https://goharbor.io/")
* Repositorio: [https://github.com/goharbor/harbor](https://github.com/goharbor/harbor "https://github.com/goharbor/harbor")

#### Características de Portus

* Sincronización con nuestro  registro privado para obtener qué imágenes y etiquetas que estén disponibles.
* Autenticación de usuarios con LDAP.
* Autenticación OAuth y OpenID-Connect
* Monitoreo de todas las actividades realizadas en su registro privado y en el propio Portus.
* Busqueda de repositorios y etiquetas dentro del registro privado.
* Destaca  repositorios favoritos.
* Deshabilitar usuarios temporalmente.
* Opcionalmente, usar tokens de aplicaciones para una mejor seguridad.

Además, se integra con Clair, que escanea las imágenes de  contenedores en busca de vulnerabilidades de seguridad. Juntas, estas herramientas brindan una seguridad  incomparable.

#### Clair

[Clair es un proyecto de código abierto ](https://github.com/coreos/clair)para el análisis estático de vulnerabilidades en contenedores de aplicaciones.

Los datos de vulnerabilidades se importan continuamente desde un conjunto conocido de bases de datos y se correlacionan con el contenido indexado de las imágenes del contenedor para producir listas de vulnerabilidades .

Cuando Portus se instala en un entorno sin conexión a Internet, Clair no puede obtener datos de las bases de datos de vulnerabilidades públicas. En estos escenarios, el administrador  debe actualizar manualmente la base de datos de Clair.

### Instalación de Portus

El siguiente procediemiento despliega Portus en un ambiente basado en contenedores, usaré un host CentOS 7.6 pero no hay dependencia del sistema operativo, el requisito es ejecutar Docker.

En mi caso desplegué un droplet en DigitalOcean con 2 vCPUs y 2 GB RAM. 

Agregué en mi DNS un record A a la IP pública que me asignó DO para que resolviera hacia registry.galvarado.com.mx ya que usaremos un certificado SSL generado por Certbot y es necesario definir un FQDN para el host pues el certificado está ligado a el

**Instalar Docker**

Configurar  el repositorio de docker-ce:

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

Editar el archivo  `.env`  en `/Portus/examples/compose/.env`

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

Después de generar el certificado, lo agregamos a Portus. Copiar el archivo  `.pem` del certificado y de la llave y renombrarlo como  `**portus:**`

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

    