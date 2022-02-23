+++
comments = "true"
date = 2022-02-22T06:00:00Z
draft = true
image = "/uploads/cloudinit-1.png"
tags = ["cloud", "best practices"]
title = "Personalización en la nube con cloud-init: Ejemplos con Terraform en AWS y Vagrant"

+++
Este post comienza con una lección que obtuve reciente mente y lo puedo resumir con la siguiente frase:

> En igualdad de condiciones, la explicación más sencilla suele ser la más probable.

Este es un principio metodológico que nos enseña cómo lo simple es lo mejor, al menos la mayoría de las veces, aunque esto no sea nada simple de entender.

Este principio es conocido como la navaja de Ockham y puedes leer más al respecto [ en Wikipedia.](https://es.wikipedia.org/wiki/Navaja_de_Ockham)

Otra forma de verlo es esta explicación del escritor William J. Hall: “La navaja de Ockham se resume para nuestros propósitos de esta manera: las afirmaciones extraordinarias exigen pruebas extraordinarias”.

Recientemente tenia que crear unas instancias en AWS solo con nginx instalado. Mi primer enfoque fue usar Packer para crear la imagen con el paquete instalado e iniciado, después con Terraform tomaría la imagen para crear las instancias. Pero entonces fue cuando un amigo me dijo, ¿Porque toda una imagen con Packer para solo instalar nginx? Fue entonces cuando recordé que tenia una opción mucho más simple... ¡Cloud-init!

## ¿Qué es Cloud-init?

[Cloud-init ](https://cloud-init.io/)es un servicio utilizado para personalizar instancias en la nube basadas en Linux. Nos permite personalizar las máquinas virtuales que nos proporcionan las distintas plataformas de nube modificando la configuración genérica del sistema  en el arranque.

Canonical inicialmente desarrolló cloud-init para Ubuntu, pero se expandió a la mayoría de los principales sistemas operativos Linux y FreeBSD. 

Hoy, es oficialmente compatible con 8 sistemas operativos Unix: Ubuntu, Arch Linux, CentOS, Red Hat, FreeBSD, Fedora, Gentoo Linux y openSUSE.

![](/uploads/distros.png) ​

Para entornos basados[ en Microsoft Windows el equivalente es CloudBase-init.](https://cloudbase.it/cloudbase-init/)  Ya que cloud-init se ha convertido en un estándar, podemos encontrarlo en las siguientes plataformas: Rackspace, OVH, VMWare, Azure, AWS, GCP, Joyent, Fujitsu, Oracle Cloud.

![](/uploads/providers.png)

El servicio de cloud-init se encuentra instalado en las VMs de estas plataformas y se inicia en el arranque (boot) de la VM, utiliza los metadatos proporcionados por el proveedor de la nube o los que nosotros mismos le damos.

Lo hace mediante la ejecución de scripts, comúnmente desde el archivo [cloud-config ](https://cloudinit.readthedocs.io/en/latest/topics/examples.html)Por lo tanto, para cambiar cualquier configuración predeterminada,  editamos o creamos este archivo, lo pasamos en la creación de la VM y cloud-init se pone en marcha.

El archivo cloud-config es un archivo YAML que sigue  reglas básicas, como:

    #cloud-config
    
    # boot commands
    # default: none
    # this is very similar to runcmd, but commands run very early
    # in the boot process, only slightly after a 'boothook' would run.
    # bootcmd should really only be used for things that could not be
    # done later in the boot process.  bootcmd is very much like
    # boothook, but possibly with more friendly.
    # - bootcmd will run on every boot
    # - the INSTANCE_ID variable will be set to the current instance id.
    # - you can use 'cloud-init-per' command to help only run once
    bootcmd:
      - echo 192.168.1.130 us.archive.ubuntu.com >> /etc/hosts

El ejemplo anterior agrega una linea al archivo _/etc/hosts._

El servicio cloud-init se usa para una variedad de cosas, que incluyen:

* Adición de usuarios y grupos.
* Escribir archivos arbitrarios.
* Agregar repositorios YUM.
* Ejecutar comandos en el primer arranque.

## ¿Cuando usar Cloud-init?

Cuando estamos configurando una instancia EC2, utilizando Terraform o la consola de AWS, o cualquier otro método, es posible que deseemos realizar alguna configuración automatizada cuando se inicie por primera vez. Sin iniciar sesión en la instancia manualmente, es posible que deseemos crear usuarios, instalar software, definir algunas variables de entorno o muchas otras cosas. Estas son cosas que solo se ejecutarán una vez cuando se cree la instancia.

Dos excelentes noticias: Terraform y Vagrant tienen soporte integrado para pasar scripts de cloud-init al momento de crear VMs en la nube o en entornos locales. Así que más adelante te muestro como personalizar instancias en AWS con Terraform y para no tener que estar creando instancias en la nube al realizar los scripts, primero trabajamos con ellos en un entorno local con Vagrant. Cuando finalmente nuestro script hace lo que necesitamos, lo pasamos a Terraform y se comportará exactamente igual.

## Cloud-init vs Packer vs Ansible

Entonces podemos usar cloud-init para configurar completamente una instancia EC2 básica y reemplazar una herramienta como [Packer](https://galvarado.com.mx/post/packer-automatiza-la-creacion-de-cualquier-tipo-de-imagen-de-maquina-virtual/), pero eso no es necesariamente lo ideal. Crear una AMI con Packer que esté completamente configurada para ejecutar una aplicación es una buena manera de implementar  infraestructura; sin embargo, es posible que falten algunas cosas al crear la AMI. 

Es posible que las variables de entorno de una aplicación web o las direcciones IP de un balanceador de carga no se conozcan cuando creamos la imagen, por lo que podemos configurar una imagen con Packer sin estos detalles y usar cloud-init para configurar esos detalles cuando se crea la instancia.

Respecto a Ansible, este flujo debería venir después o integrado en la construcción de la imagen con Packer.  Si necesitamos una conexión SSH en un servidor para instalar dependencias, entonces tenemos un sistema que  tiene un único punto de falla.

Entonces, dependiendo de la frecuencia de despliegue,es conveniente agrupar todo el software en una imagen AMI con Packer. No hay silverbullets ni mucho menos, pero mi conclusión y consejo es: Seguir el enfoque de [infraestructura inmutable ](https://galvarado.com.mx/post/beneficios-retos-y-como-lograr-infraestructura-inmutable-con-packer-ansible-y-terraform/)con Packer, creando imagenes con todo el stack e incluir cloud-init para personalizaciones posteriores. 

_Ahora bien, cuando la personalización es muy sencilla, no es necesario empaquetar toda una imagen y podemos ir directo a Cloud-init._

En cuanto a Ansible: Uso cloud-init para instalar lo mínimo que necesito y luego ejecuto la administración de configuración según sea necesario. Ansible es mucho más fácil de administrar, más flexible, más potente y además, puede ejecutarse continuamente. Cloud-init se ejecuta una vez nada más, en el arranque.

**Mantengamos el inicio simple  y usemos ansible para lo demás.** 

## Ejemplo de Cloud-init con Terraform en AWS

## Cloud-init en entorno local con Vagrant 