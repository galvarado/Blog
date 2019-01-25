---
title: Virtualización a fondo ¿Cuales son las diferencias entre KVM y QEMU? ¿Son sinónimos?
date: 2018-05-30 23:00:00 -0600
categories:
- virtualizacion
- cloud
autoThumbnailImage: false
thumbnailImagePosition: top
image: images/virtualization.jpg
metaAlignment: center
comments: true

---
Cuando comenzamos en el mundo de la virtualización, la opción más recurrente para comenzar es KVM. Después nos damos cuenta de que se comienza a usar tamién otro componente muy amenudo, QEMU y siempre hay muchas preguntas en torno a cómo funciona KVM y QEMU o cual es la diferencia entre ellos, es por esto que escribí al respecto



<!--more-->

## Sobre KVM


KVM es un software de código abierto y significa Kernel Virtual Machine (Máquina Virtual basada en el Kernel) es una solución de virtualización para Linux en hardware x86 que contiene extensiones de virtualización (Intel VT o AMD-V).  KVM forma parte del Kernel de Linux desde la versión 2.6.20.  Específicamente, con KVM podemos convertir a Linux en un hipervisor para que nuestro host ejecute entornos virtuales, es decir, máquinas virtuales. Cada máquina virtual se implementa como un proceso regular de Linux

KVM ha jugado un papel clave en el entorno de virtualización de código abierto basado en Linux. De hecho, KVM es el único hipervisor para todos los productos de virtualización de Red Hat, tanto para RHOSP - Red Hat Openstack Platform, como para Red Hat Virtualization  o  abreviado, RHV. 

KVM en general es 2 cosas, un modulo del kernel pero también KVM es es un fork del ejecutable de QEMU(más adelante hablo de eso). Entonces como mencionábamos, KVM es un módulo kernel que permite el uso de tecnologías de extensiones de virtualización Intel o AMD. En pocas palabras, estas extensiones permiten que múltiples sistemas operativos compartan una CPU física sin interferir entre ellos. Por otro lado, no resuelven compartir todos los dispositivos de hardware, para esto KVM requiere una lógica extra y aquí es dónde comenzamos a hablar de QEMU.



## Sobre QEMU
QEMU es un emulador de procesadores basado en la traducción dinámica de binarios, es decir, realiza la conversión del código binario de la arquitectura fuente o host, en código entendible por la arquitectura huésped o la VM. 

El resultado de usar QEMU es poder ejecutar el código original como si se estuviera ejecutando en la máquina emulada. Por ejemplo, se podría ejecutar código escrito para el procesador ARM en su máquina basada en Intel.

QEMU es capaz de emular varias plataformas de hardware diferentes, incluida la x86, plataformas PowerPC, sistemas basados en ARM y también sistemas SUN SPARC. Además del hardware básico de estos sistemas, QEMU también proporciona emulación de varios módulos adicionales, como tarjetas gráficas, tarjetas de sonido, dispositivos de red, dispositivos de almacenamiento y controladores, dispositivos serie/paralelo/USB y dispositivos de memoria. Esto significa que en muchos casos las computadoras pueden ser  completa y totalmente emuladas y utilizadas para ejecutar su software original.


## ¿Cómo trabajan juntos?

En el hardware real, el sistema operativo traduce las instrucciones de los programas para que sean ejecutadas por el CPU físico. En una máquina virtual es lo mismo, pero la diferencia es que el CPU está virtualizado por el hipervisor y el hipervisor tiene que traducir las instrucciones del CPU virtual y convertirlo en instrucciones para el CPU físico. Esta traducción tiene una gran sobrecarga de rendimiento.

Para minimizar esta sobrecarga, los procesadores admiten extensiones de virtualización. Intel soporta una tecnología llamada VT-X y el equivalente AMD es AMD-V. Con el uso de estos, una rebanada de CPU físico se puede asignar directamente al CPU virtual. Así que las instrucciones de la CPU virtual se pueden ejecutar directamente en la rebanada del CPU físico. Evitando así la traducción que tendría que hacer el hipervisor.

KVM es el módulo del kernel de Linux que permite esta asignación de CPU físico para CPU virtual. Esta asignación proporciona la aceleración de hardware para la máquina virtual y aumenta su rendimiento. De hecho QEMU utiliza esta aceleración cuando el tipo de virtualización es elegido como KVM.

Los desarrolladores de KVM aprovecharon la arquitectura QEMU y básicamente crearon un nuevo modelo de CPU en QEMU. Este nuevo tipo de modelo tiene una lógica específica de KVM. Así las llamadas al sistema que se harían de forma nativa pasan por del módulo KVM para que la ejecución se ejecute de forma nativa en la CPU --- mientras que QEMU se utiliza para proporcionar el resto funcionalidad (emular los dispositivos) 

Al trabajar juntos,  KVM accede directamente al CPU físico y a la memoria, a su vez QEMU emula los recursos de hardware, como el disco duro, video, USB, etc,


## Conclusión

Hoy, cuando las personas se refieren al hipervisor KVM, en realidad se refieren a la combinación QEMU-KVM.

KVM necesita QEMU (emulador) para la funcionalidad completa como hipervisor. QEMU es autosuficiente y KVM es realmente un módulo del kernel de Linux para la explotación de extensiones VT que actúa como controlador de las capacidades de CPU físicas.

Así puedes notar entonces que QEMU necesita a KVM para para aumentar su rendimiento... Por otro lado KVM por sí solo no puede proporcionar la solución de virtualización completa. Necesita de QEMU.

¿Conocías la diferencia?

Referencias:

https://www.stratoscale.com/blog/compute/difference-kvm-and-qemu-virtualization/

http://serverfault.com/questions/208693/difference-between-kvm-and-qemu

http://www.innervoice.in/blogs/2014/03/10/kvm-and-qemu/

http://www.quora.com/Virtualization/What-is-the-difference-between-KVM-and-QEMU