+++
comments = "true"
date = "2019-02-28T16:00:00+00:00"
image = "/uploads/cmp.jpg"
tags = ["devops", "cloud", "arquitectura"]
title = "Instalación de Mist.io, una plataforma de gestión de nube híbrida "

+++
Con la oferta tan amplia que hoy existe  de proveedores de nube, la mayoria de las empresas han construido un ambiente multinube o  multicloud. Esto lo demuestran datos de informes recientes como el [_State of the cloud report_ de Rightscale.](https://www.rightscale.com/lp/state-of-the-cloud) En este estudio se afirma que “el porcentaje de compañías con una estrategia _multicloud_  ha crecido  hasta alcanzar el 85%”. Además, el estudio señala que de todas ellas un 58% apuesta por una estrategia híbrida.

Este promete ventajas económicas, velocidad, agilidad, flexibilidad, elasticidad infinita e innovación. ¿Cómo adaptarse para gestionar todo este abanico de infraestructura y servicios? Esto  presenta una gran complejidad en torno a la gestión y el cumplimiento, la gestión de recursos, los controles financieros y la planificación de capacidades.

La mayoría de los equipos de TI hoy en día administran múltiples servidores en múltiples proveedores de servicios en de Nube, esto implica contraseñas múltiples, flujos de datos múltiples y múltiples proveedores para verificar.  ¿Cómo consolidar todo esto en un solo esfuerzo que simplifique esta gestión? Usando una plataforma de gestión multicloud o Cloud Management Platform (CMP)

## ¿Porqué usar un Cloud Management Platform?

Básicamente, el objetivo de estas herramientas es facilitar a las empresas la gestión centralizada de cada uno de sus servidores _en la nube,_ independientemente de la plataforma donde estén desplegados estos servidores. La gestión multi-cloud es la evolución natural de las organizaciones de TI para afrontar el reto de la transformación digital.

Las plataformas y herramientas de gestión multicloud deben tener la capacidad de proporcionar una funcionalidad mínima en las siguientes categorías:

* **Aprovisionamiento y orquestación**
* **Automatización**
* **Seguridad y cumplimiento**
* **Monitoreo y registro**
* **Inventario**
* **Manejo de costos**

Otras características deseadas serían también  tener la capacidad de manejar las fallas de sistema automáticamente con capacidades tales como un mecanismo de notificación y  capacidades de recuperación y recuperación automática.

## Mist.io

Mist.io es una plataforma Opensource que simplifica la gestión de múltiples  nubes.  Proporciona una única interfaz de usuario y una API para la administración de infraestructura y aplicaciones en multiples nubes, genera un inventario, da  informes de costos y uso, creación de servidores hasta el monitoreo con  métricas de rendimiento y alertas además de disponer de opciones para realizar tareas de automatización.

Sin importar dónde se alojen los servidores: localmente, en una nube pública o privada, un hipervisor KVM o un motor Docker, Mist.io ofrece un panel de control unificado que reduce la fragmentación  y facilita la administración.

Las características a detalle se pueden consultar en [el sitio web oficial de mist.io](https://mist.io/) pero a grandez rasgos cumple con los puntos antes descritos. Aunque hay muchas opciones en en mercado, elegí mist.io por que es opensource, la interfaz de usuario y la API se publican bajo una licencia de código abierto. Además cuenta versiones empresariales para instalación onsite o puede ser usado en la nube como un SaaS.

Para probar mist.io existe 3 planes que se pueden elegir:

![](/uploads/mist.io_pricing-1.png)

## Instalación de Mist.io Community Edition

Mist.io es  aplicación dividida en microservicios que son desplegados en contenedores docker. La forma más fácil de ejecutarlo es mediante el uso de docker-compose. Entonces, para ejecutarlo uno necesita instalar una versión reciente de docker y docker-compose.

Para instalar siemplemente:

    wget https://github.com/mistio/mist-ce/releases/download/v4.0.0/docker-compose.yml
    docker-compose up -d

Después de unos minutos (según la conexión) todos los contenedores se descargarán y se iniciarán en segundo plano.

Para crear un usuario por primera vez:

    docker-componer exec api sh

Una vez dentro del container, ejecutar:

    ./bin/adduser --admin admin@example.com

La interfaz estará disponible en el puerto 80 en localhost.  DEspués del inicio se crea un archivo de configuración en _./settings/settings.py_. Se puede editar este archivo para modificar la configuración. Cualquier cambio en ._/settings/settings.py_ requiere un reinicio:

    docker-compose restart

La documentación de la instalación se encuentra [en el repositorio de Github](https://github.com/mistio/mist-ce).

## Gestión multicloud

Una vez instalado, podemos agregar nuestras credenciales para conectar con los distintos proveedores.Las opciones para conectar con proveedores al día de hoy son las siguientes:

![](/uploads/Screenshot-20190228195723-887x513.png)

Yo agregué 2 cuentas de [Digital Ocean](https://www.digitalocean.com/) y 1 cuenta de [Google Cloud Platform](https://cloud.google.com/getting-started/?hl=es). Los procesos para añadir estos proveedores [se encuentran en la documentación oficial](https://docs.mist.io/article/19-adding-digital-ocean).

Una vez agregadas las credenciales, Mist.io ofrece vistas centralizadas y simplificadas de la infraestructura, pero más allá de mostrar información puedes realizara acciones de creación de maquinas virtuales, realizar una conexión por SSH,ejecutar scripts o tareas de manera recurrente como crons e incluso activar  reglas proactivas cuando se alcanzan umbrales.

Una vez agregadas las credenciales, el resumen de proveedores de nube se visualiza de la siguiente forma:

![](/uploads/Screenshot-20190228200644-1912x694.png)

La siguiente es la vista general de toda mi infraestructura de cómputo en todos los proveedores que agregué, donde se detalla el proveedor de nube, el tamaño de las VMS, sus direcciones IPs, el estado de ejecución y su tiempo de creación:

![](/uploads/Captura de pantalla de 2019-02-28 16-57-11.png)

Podemos acceder a la misma información en cuanto a volúmenes de almacenamiento:

![](/uploads/Screenshot-20190228200701-1900x679.png)

Esta es la vista del resumen general de la infraestructura con un vistazo de los componentes que están agregados además  se puede apreciar el costo total de la infraestructura:

![](/uploads/Screenshot-20190228195442-1886x890.png)

Lo más valioso será la operación y el día a día en la gestión de los recursos de nube con los que se cuenta pero desde un punto centralizado, accediento rápidamente a la infraestructura:

![](/uploads/Screenshot-20190228201058-1553x776.png)

Como conclusión, con mist.io se pueden organizar los recursos y habilitar el aprovisionamiento de autoservicio para distintos equipos de desarrolllo, automatizar procesos y llevar la gobernabilidad de la infraestructura, se puede realizar la configuración de aplicaciones simples y complejas, ver costos y utilización en una sola vista además de recibir alertas proactivas sobre máquinas subutilizadas.

Si tienen alguna duda, no duden en dejarme un comentario aquí mismo o por mis redes sociales.