+++
comments = "true"
date = 2021-02-05T05:00:00Z
image = ""
tags = ["devops", "cloud", "best practices"]
title = "Beneficios, retos y como lograr Infraestructura Inmutable con Packer, Ansible y Terraform"

+++
En los últimos años, la automatización se ha vuelto clave para la entrega de un producto de alta calidad, no solo en el desarrollo de software sino también para muchas otras industrias. La clave aquí es: hazlo una vez, hazlo bien, hazlo replicable.

La automatización consiste en el uso de sistemas de software para crear instrucciones y procesos repetibles a fin de reemplazar o reducir la interacción humana con los sistemas de TI.

En teoría, se puede aplicar cierto nivel de automatización a cualquier tarea de TI. Por lo tanto, la automatización puede incorporarse y aplicarse a cualquier elemento, desde la la red hasta la infraestructura, la implementación en la nube, los sistemas operativos, la gestión de la configuración y el despliegue de aplicaciones.

Dentro de la Automatización podemos encontrar la IaC o Infraestructura como código. Lo que nos lleva a hablar de Ia infraestructura Inmutable.

## Infraestructura Inmutable vs Mutable

En una infraestructura tradicional, los servidores se actualizan y modifican continuamente. Los administradores acceden a los servidores, actualizan paquetes , modifican los archivos de configuración e implementarn nuevo código. En otras palabras, estos servidores son mutables; se pueden cambiar después de su creación.

Una infraestructura inmutable es otro paradigma de infraestructura en el que los servidores nunca se modifican después de su implementación. Si algo necesita ser actualizado, reparado o modificado de alguna manera, se aprovisionan nuevos servidores construidos a partir de una imagen común con los cambios apropiados para reemplazar los antiguos. Una vez validados, se ponen en uso y los antiguos se retiran.

La diferencia más fundamental entre la infraestructura mutable e inmutable está en su política central: los componentes de la primera están diseñados para cambiarse después de la implementación; los componentes de la última están diseñados para permanecer sin cambios y finalmente ser reemplazados.

¿Tomamos la infraestructura existente y tratamos de actualizarla en su lugar, o tomamos la infraestructura existente, creamos una nueva infraestructura y destruimos lo existente en su lugar? **Esa es la distinción fundamental entre infraestructura mutable e inmutable.**

## ¿Cuáles son los beneficios de la infraestructura inmutable?

Respuesta ráida: La confiabilidad. Ya sea que esté se esté desplegando contenido en sistemas bare metal o en la nube en servicios como AWS, GCP oAzure, siempre existe el riesgo de que algo falle y las plataformas deban restaurarse rápidamente. En estas situaciones, tener copias de seguridad está bien, pero normalmente el proceso para recuperarlas no está tan bien probado como debería y, puede llevar muchísimo tiempo.

Una máxima es:

> Los respaldos funcionan, hasta que nos necesitas restaurar.

Sin embargo, si tenemos sistemas inmutables respaldados por procesos de automatización de uso frecuente, ya tenemos integrada la recuperación ante desastres. La infraestructura se vuelve desechable y podemos recrear entornos de forma rápida y sencilla.

La infraestructura inmutable juega un papel muy importante en el desarrollo de software , ya que en lugar de cambiar parte de La infraestructura, ahora podemos crear una nueva con las nuevas características necesarias y desechar la antigua. La nube nos ha brindado las herramientas para hacerlo más barato y eficiente, de modo que todo tipo de sistemas, desde sitios web d pequeños hasta plataformas de medios internacionales a gran escala, puedan beneficiarse.

## ¿Dónde se puede aplicar la infraestructura inmutable? ¿Cuáles son los inconvenientes ?

La automatización inspira confianza tanto en el software como en la arquitectura en la que se ejecuta. Se puede aplicar en todas partes, desde el arranque del entorno de desarrollo y los sistemas de integración continua hasta los sistemas de aplicaciones web de producción y los planes de recuperación ante desastres. Con una planificación cuidadosa, podemos recrear sistemas completos o aplicar actualizaciones a entornos con un solo clic y reproducir de forma fiable los mismos resultados una y otra vez.

Para usar este enfoque de manera eficiente debemos automatizarlos despliegues de aplicaciones, también debemos automatizar el aprovisionamiento rápido de servidores en un entorno de nube y  generalmente, las aplicaciones usan soluciones externas (datastore) para manejar los estados (stateless).

Todas las actualizaciones (deploy) deberán pasar por un proceso de automatizado. Sin una automatización bien probada, los despliegues suelen ser experiencias dolorosas, que provocan miedo y que consumen mucho tiempo. Sin embargo, cuando uno tiene confianza en la automatización y se puede estar seguro del estado de los sistemas en todo momento, los despliegues se vuelven simples y pueden realizarse muchas veces al día.

**Algunas inversiones iniciales en la automatización de la infraestructura siembran las semillas que le permitirán cosechar grandes beneficios .**

Esta es una herramienta de enorme importancia en el arsenal del desarrollo de software moderno.

## Estoy convencido ¿Cómo lo aplico?

![](/uploads/infraestructurainmutableansiblepackerterraform.png)