+++
comments = "true"
date = "2019-09-20T05:00:00+00:00"
draft = true
image = "/uploads/Harbor.png"
tags = ["architecture", "cloud", "containers", "GCP"]
title = "Introducción + Instalación de Harbor, un repositorio privado de imagenes para Docker "

+++
Si tu o tu empresa están buscando un registro de imágenes Docker local, te va a encantar Harbor. Con Harbor no solo obtienes una solución sólida para almacenar las imágenes, sino que también obtienes la capacidad (instalando en conjunto  Clair) de escanear tus imágenes en busca de vulnerabilidades. Dado que cada vez se encuentran más imágenes de Docker con problemas, tener la capacidad de escanearlas, antes de que se usen para la implementación de contenedores, puede ser una gran ayuda para cualquier empresa que busque mejorar la seguridad de sus contenedores.

Harbor es un registro nativo de nube confiable que almacena, firma y escanea contenido. La misión es proporcionar a los entornos nativos de la nube la capacidad de administrar y servir imágenes con confianza.

Agrega las funcionalidades generalmente requeridas por una empresa, como seguridad, identidad y administración.  Harbor admite la configuración de múltiples registros y replicación de  imágenes  entre ellos. Además, Harbor ofrece características de seguridad avanzadas, como la gestión de usuarios, el control de acceso y la auditoria de actividades.

Ficha técnica:

* Creado por VMware en 2014, adoptado por usuarios de todo el mundo
* Liberado como código abierto (Licencia Apache 2.0)
*  Registro de contenedores y  Helm charts.
* Enfoque: almacena, firma y escanea contenido
* Proyecto en incubación por la CNCF:  [https://www.cncf.io/project/harbor/](https://www.cncf.io/project/harbor/ "https://www.cncf.io/project/harbor/")
* Sitio web:  [https://goharbor.io/](https://goharbor.io/ "https://goharbor.io/")
* Repositorio: [https://github.com/goharbor/harbor](https://github.com/goharbor/harbor "https://github.com/goharbor/harbor")