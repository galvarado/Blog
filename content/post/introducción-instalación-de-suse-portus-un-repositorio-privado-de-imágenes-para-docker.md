+++
comments = "true"
date = "2019-09-20T15:00:00+00:00"
image = "/uploads/portus.png"
tags = ["devops", "architecture", "cloud", "development", "best practices", "containers", "GCP", "azure", "aws", "CloudOps"]
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