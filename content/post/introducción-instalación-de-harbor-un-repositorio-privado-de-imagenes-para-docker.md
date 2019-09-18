+++
comments = "true"
date = "2019-09-17T05:00:00+00:00"
image = "/uploads/Harbor1.png"
tags = ["architecture", "cloud", "containers", "GCP"]
title = "Introducción + Instalación de Harbor, un repositorio privado de imagenes para Docker "

+++
Si tu o tu empresa están buscando un registro de imágenes Docker local, te va a encantar Harbor. Pues con  Harbor no solo obtienes una solución sólida para almacenar las imágenes, sino que también obtienes la capacidad (instalando en conjunto  Clair) de escanear tus imágenes en busca de vulnerabilidades. 

### ¿Qué es Harbor?

Dado que cada vez se encuentran más imágenes de Docker con problemas, tener la capacidad de escanearlas, antes de que se usen para la implementación de contenedores, puede ser una gran ayuda para cualquier empresa que busque mejorar la seguridad de sus contenedores.

Una ventaja significativa del uso de contenedores es la portabilidad, que ha facilitado la creación y el intercambio de microservicios.  Sin embargo, los repositorios públicos como DockerHub y GitHub ofrecen acceso sin restricciones a microservicios y otro contenido de software. Si bien esto permite que los desarrolladores descarguen y accedan rápidamente, el acceso sin restricciones a los repositorios de software públicos puede generar serios problemas de seguridad.

Según Gartner en su  [Top 10 Security Projects for 2019](https://www.gartner.com/smarterwithgartner/gartner-top-10-security-projects-for-2019/)  la seguridad de los contenedores es, una de las diez principales prioridades para los profesionales de TI, ya que los desarrolladores dependen cada vez más de los contenedores. "Cada uno de estos contenedores debe ser examinado en busca de vulnerabilidades y problemas antes de ser puesto en producción ".

La solución consiste en registros de contenedores confiables  como Harbor. 

Harbor es un registro nativo de nube confiable que almacena, firma y escanea contenido. La misión es proporcionar a los entornos nativos de la nube la capacidad de administrar y servir imágenes con confianza.

Agrega las funcionalidades generalmente requeridas por una empresa, como seguridad, identidad y administración.  Harbor admite la configuración de múltiples registros y replicación de  imágenes  entre ellos. Igual ofrece características de seguridad avanzadas, como la gestión de usuarios, el control de acceso y la auditoria de actividades.

### Ficha técnica

* Creado por VMware en 2014, adoptado por usuarios de todo el mundo
* Liberado como código abierto (Licencia Apache 2.0)
* Registro de contenedores y  Helm charts.
* Enfoque: almacena, firma y escanea contenido
* Proyecto en incubación por la CNCF:  [https://www.cncf.io/project/harbor/](https://www.cncf.io/project/harbor/ "https://www.cncf.io/project/harbor/")
* Sitio web:  [https://goharbor.io/](https://goharbor.io/ "https://goharbor.io/")
* Repositorio: [https://github.com/goharbor/harbor](https://github.com/goharbor/harbor "https://github.com/goharbor/harbor")

### Características de Harbor

* Integración de identidad y control de acceso basado en roles.
* Análisis de seguridad y vulnerabilidad.
* Firma y validación de contenido multiempresa
* Replicación de imagen entre instancias
* Helm Chart management

Además, se integra con Clair, que escanea las imágenes de  contenedores en busca de vulnerabilidades de seguridad. Juntas, estas herramientas brindan una seguridad  incomparable.

### Clair

[Clair es un proyecto de código abierto ](https://github.com/coreos/clair)para el análisis estático de vulnerabilidades en contenedores de aplicaciones.

Los datos de vulnerabilidades se importan continuamente desde un conjunto conocido de bases de datos y se correlacionan con el contenido indexado de las imágenes del contenedor para producir listas de vulnerabilidades .

Cuando Harbor se instala en un entorno sin conexión a Internet, Clair no puede obtener datos de las bases de datos de vulnerabilidades públicas. En estos escenarios, el administrador  debe actualizar manualmente la base de datos de Clair.

### Arquitectura de Harbor

![](/uploads/Captura realizada el 2019-09-18 17.31.10-1.png)

### Instalación 