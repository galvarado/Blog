+++
comments = "true"
date = 2021-02-05T05:00:00Z
image = "/uploads/terraformansibleinmutable.png"
tags = ["devops", "cloud", "best practices"]
title = "Beneficios y retos de la Infraestructura Inmutable + Tutorial: Packer, Ansible y Terraform"

+++
En los últimos años, la automatización se ha vuelto clave para la entrega de un producto de alta calidad.La clave aquí es: hazlo una vez, hazlo bien, hazlo replicable

En teoría, se puede aplicar cierto nivel de automatización a cualquier tarea de TI. Por lo tanto, la automatización puede incorporarse y aplicarse a cualquier elemento, desde la la red hasta la infraestructura, la implementación en la nube, los sistemas operativos, la gestión de la configuración y el despliegue de aplicaciones.

Dentro de la Automatización podemos encontrar la IaC o Infraestructura como código. Lo que nos lleva a hablar de Ia infraestructura Inmutable.

## Infraestructura Inmutable vs Mutable

En una infraestructura tradicional, los servidores se actualizan y modifican continuamente. Los administradores acceden a los servidores, actualizan paquetes , modifican los archivos de configuración e implementar nuevo código. En otras palabras, estos servidores son mutables; se pueden cambiar después de su creación.

Una infraestructura inmutable es otro paradigma de infraestructura en el que los servidores nunca se modifican después de su implementación. Si algo necesita ser actualizado, reparado o modificado de alguna manera, se aprovisionan nuevos servidores construidos a partir de una imagen común con los nuevos cambios para reemplazar los antiguos. Una vez validados, se ponen en uso y los antiguos se retiran.

Ejemplo: Liberamos una aplicación en Python con servidor web apache y base de datos MySQL. Para la segunda versión, mejoramos el rendimiento con nginx, así que instalamos en el servidor el nuevo software y deshabilitamos apache. El servidor es el mismo y ha sido manipulado.

![](/uploads/mutable.png)

Con infraestructura inmutabe, en lugar de instalar nginx en el servidor, crearemos un nuevo servidor con este nuevo paquete y lo desplegaremos con la aplicación.

![](/uploads/inmutable.png)

Cuando las pruebas sean satisfactorias, removeremos el servidor original.

![](/uploads/infrainmutable.png)

¿Tomamos la infraestructura existente y tratamos de actualizarla en su lugar, o tomamos la infraestructura existente, creamos una nueva infraestructura y destruimos lo existente en su lugar? Esa es la distinción fundamental entre infraestructura mutable e inmutable.

**¿Vamos a reemplazar los servidores?** Sí y la razón es sencilla: Es más fácil volver a partir de cero que lidiar con versiones y parches. Obviamente hay algunas condiciones que debemos cumplir, que explico más adelante.

## ¿Cuáles son los beneficios de la infraestructura inmutable?

Sencillo: la confiabilidad. Ya sea que esté se esté desplegando contenido en sistemas bare metal o en la nube en servicios como AWS, GCP o Azure, siempre existe el riesgo de que algo falle y las plataformas deban restaurarse rápidamente. En estas situaciones, tener copias de seguridad está bien, pero normalmente el proceso para recuperarlas no está tan bien probado como debería y, puede llevar muchísimo tiempo.

Una máxima es:

> Los respaldos funcionan, hasta que los necesitas restaurar.

Sin embargo, si tenemos sistemas inmutables respaldados por procesos de automatización de uso frecuente, ya tenemos integrada la recuperación ante desastres. La infraestructura se vuelve desechable y podemos recrear entornos de forma rápida y sencilla.

La infraestructura inmutable juega un papel muy importante en el desarrollo de software, ya que en lugar de cambiar parte de la infraestructura, ahora podemos crear una nueva con las nuevas características necesarias y desechar la antigua. La nube nos ha brindado las herramientas para hacerlo más barato y eficiente, de modo que todo tipo de sistemas, desde sitios web d pequeños hasta plataformas de medios internacionales a gran escala, puedan beneficiarse.

## ¿Dónde se puede aplicar la infraestructura inmutable? ¿Cuáles son los inconvenientes ?

La automatización inspira confianza tanto en el software como en la arquitectura en la que se ejecuta. Se puede aplicar en todas partes, desde el arranque del entorno de desarrollo y los sistemas de integración continua hasta los sistemas eb producción. Con una planificación cuidadosa, podemos recrear sistemas completos o aplicar actualizaciones a entornos con un solo clic y reproducir de forma fiable los mismos resultados una y otra vez.

Para usar este enfoque de manera eficiente debemos:

1. Automatizar los despliegues de aplicaciones.
2. Automatizar el aprovisionamiento rápido de servidores en un entorno de nube.
3. Usar arquitectuas y aplicaciones que usan soluciones externas (datastoreo bases de datos) para manejar los estados, es decir, son stateless.

Todas las actualizaciones (deploy) deberán pasar por un procesoautomatizado. Sin una automatización bien probada, los despliegues suelen ser experiencias dolorosas, que provocan miedo y que consumen mucho tiempo. Sin embargo, cuando uno tiene confianza en la automatización y se puede estar seguro del estado de los sistemas en todo momento, los despliegues se vuelven simples y pueden realizarse muchas veces al día.

> Algunas inversiones iniciales en la automatización de la infraestructura siembran las semillas que le permitirán cosechar grandes beneficios .

Esta es una herramienta de enorme importancia en el arsenal del desarrollo de software moderno.

## Estoy convencido ¿Cómo lo aplico?

Las herramientas para esto son:

1. Packer para construir una imagen de VM.
2. Ansible para el aprovisionamiento de software e instalación de dependencias
3. Terraform para orquestar y crear la infraestructura en la nube.

![](/uploads/infraestructurainmutableansiblepackerterraform.png)

Por lo tanto, en nuestro proyecto, deberemos integrar estas 3 herramientas. En el repositorio de código del proyecto deberiamos entonces encontrar un directorio con el template de Packer para construir la imagen del servidor, playbooks de ansible que instalarán la aplicación y cualquier dependencia y los templetes de terraform que nos permiten crear la infraestructura en la nube, a partir de la imagen recién construida.

Para poner en práctica los conceptos, desplegaremos un sitio sencillo en DigitalOcean, pero puedes usarlo para cualquier aplicación escrita en Python, Java, PHP, Go, NodeJS, etc. Lo que cambia es el proceso de despliegue de cada aplicación y sus dependencias, pero en todos los caso: Construimos la imagen, la aprovisionaos y la desplegamos en la nube.

Puedes ver un ejemplo completo en el siguiente repositorio. Lo explico paso a paso a continuación:

### Packer

### 

### Ansible

### 

### Terraform

Todo el código disponible en:

El siguiente paso es realizar un pipeline con una herramienta de CI/CD como Jenkins que maneje todo el flujo. Esto lo revisaremos en el próximo post.

Si quieres saber más de Infraestructura como código y conceptos de Terraform te recomiendo este post: [Tutorial: Infraestructura como código con Terraform](https://galvarado.com.mx/post/tutorial-infraestructura-como-c%C3%B3digo-con-terraform/). 

Sobre Ansible, este post explica como [automatizar toda la instalación de Wordpress con Ansible.](https://galvarado.com.mx/post/terraform-ansible-automatizar-el-despliegue-de-wordpress-en-digitalocean/)

Sobre conceptos de Packer y como se puede automatizar la construcción de imágenes [puedes leer este post.](https://galvarado.com.mx/post/packer-automatiza-la-creacion-de-cualquier-tipo-de-imagen-de-maquina-virtual/) 

Si te pareció útil, por favor comparte. Si tienes dudas no dejes de escribir en los comentarios.

Referencias: 

[https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure](https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure "https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure")

[https://medium.com/@archanabalasundaram/packer-with-terraform-8c45f895cddb](https://medium.com/@archanabalasundaram/packer-with-terraform-8c45f895cddb "https://medium.com/@archanabalasundaram/packer-with-terraform-8c45f895cddb")

[https://itnext.io/immutable-infrastructure-using-packer-ansible-and-terraform-7ca6f79582b8](https://itnext.io/immutable-infrastructure-using-packer-ansible-and-terraform-7ca6f79582b8 "https://itnext.io/immutable-infrastructure-using-packer-ansible-and-terraform-7ca6f79582b8")