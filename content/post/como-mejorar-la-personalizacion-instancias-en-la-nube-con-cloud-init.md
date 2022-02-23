+++
comments = "true"
date = 2022-02-22T06:00:00Z
image = "/uploads/cloudinit-1.png"
tags = ["cloud", "best practices"]
title = "Como mejorar la personalización instancias en la nube con cloud-init"

+++
Este post comienza con una lección que obtuve reciente mente y lo puedo resumir con la siguiente frase:

> En igualdad de condiciones, la explicación más sencilla suele ser la más probable.

Este es un principio metodológico que nos enseña cómo lo simple es lo mejor, al menos la mayoría de las veces, aunque esto no sea nada simple de entender.

Este principio es conocido como la navaja de Ockham y puedes leer más al respecto [ en Wikipedia.](https://es.wikipedia.org/wiki/Navaja_de_Ockham)

Otra forma de verlo es esta explicación del escritor William J. Hall: “La navaja de Ockham se resume para nuestros propósitos de esta manera: las afirmaciones extraordinarias exigen pruebas extraordinarias”.

## ¿Qué es Cloud-init?

[Cloud-init ](https://cloud-init.io/)es un servicio utilizado para personalizar instancias en la nube basadas en Linux Nos permite personalizar las máquinas virtuales que nos proporcionan las distintas plataformas de nube modificando la configuración genérica del sistema  en el arranque.

Canonical inicialmente desarrolló cloud-init para Ubuntu, pero se expandió a la mayoría de los principales sistemas operativos Linux y FreeBSD. 

Hoy, es oficialmente compatible con 8 sistemas operativos Unix: Ubuntu, Arch Linux, CentOS, Red Hat, FreeBSD, Fedora, Gentoo Linux y openSUSE.   ![](/uploads/distros.png) ​

Para entornos basados en Microsoft Windows, el equivalente es CloudBase-init.  Ya que cloud-init se ha convertido en un estándar, podemos encontrarlo en las siguientes plataformas:

![](/uploads/providers.png)

## ¿Cuando usar Cloud-init?

Cuando estamos configurando una instancia EC2, utilizando Terraform o la consola de AWS, o cualquier otro método, es posible que deseemos realizar alguna configuración automatizada cuando se inicie por primera vez. Sin iniciar sesión en la instancia manualmente, es posible que deseemos crear usuarios, instalar software, definir algunas variables de entorno o muchas otras cosas. Estas son cosas que solo se ejecutarán una vez cuando se cree la instancia.

## Cloud-init vs Packer vs Ansible

Entonces podemos usar cloud-init para configurar completamente una instancia EC2 básica y reemplazar una herramienta como Packer, pero eso no es necesariamente para lo que la usaría. Crear una AMI que esté completamente configurada para ejecutar una aplicación es una buena manera de implementar la infraestructura; sin embargo, es posible que falten algunas cosas al crear la AMI. Es posible que las variables de entorno de una aplicación web o las direcciones IP de un balanceador de carga no se conozcan cuando crea la AMI, por lo que puede configurar una AMI sin estos detalles y usar cloud-init para configurar esos detalles cuando se crea la AMI.

## Ejemplo de Cloud-init con Terraform en AWS

## Cloud-init en entorno local con Vagrant 