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

Canonical inicialmente desarrolló cloud-init para Ubuntu, pero se expandió a la mayoría de los principales sistemas operativos Linux y FreeBSD. Hoy, es oficialmente compatible con 8 sistemas operativos Unix: Ubuntu, Arch Linux, CentOS, Red Hat, FreeBSD, Fedora, Gentoo Linux y openSUSE. ParaMicrosoft Windows, el equivalente es CloudBase-init.
<center>
![](/uploads/distros.png)
</center>
​