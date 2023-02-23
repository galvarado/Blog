---
_template: como_disenar_una_api_introduccion_a_openapi_specification
---


+++
comments = "true"
date = 2022-03-15T06:00:00Z
image = "/uploads/cloudinit-1.png"
tags = ["cloud", "best practices", "terraform", "aws", "vagrant"]
title = "Personalización en la nube con cloud-init: Ejemplos con Terraform en AWS y Vagrant"

+++
Este post comienza con una lección que obtuve reciente mente y lo puedo resumir con la siguiente frase:

> En igualdad de condiciones, la explicación más sencilla suele ser la más probable.

Este es un principio metodológico que nos enseña cómo lo simple es lo mejor, al menos la mayoría de las veces, aunque esto no sea nada simple de entender.

Este principio es conocido como la navaja de Ockham y puedes leer más al respecto [ en Wikipedia.](https://es.wikipedia.org/wiki/Navaja_de_Ockham)

Otra forma de verlo es esta explicación del escritor William J. Hall: “La navaja de Ockham se resume para nuestros propósitos de esta manera:"
>  Las afirmaciones extraordinarias exigen pruebas extraordinarias.

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


Manos a la obra, pasemos al código y te muestro como personalizar una VM de manera local en Vagrant y después como usar el mismo script de cloud-init en AWS con Terraform.

Todo el código está disponible en: [https://github.com/galvarado/custom-cloud-instances-cloud-init](https://github.com/galvarado/custom-cloud-instances-cloud-init)

## Cloud-init en entorno local con Vagrant 

Ya hemos hablado de Vagrant anteriormente, por ahora vale la pena notar que cualquier escenario que involucre una instancia en la nube, puede ser fácilmente validado en Vagrant primero.

Para trabajar con cloud-init, vamos a necesitar habilitar este módulo, en el archivo Vagrantfile luce así:

    config.env.enable # enable .env support plugin (needed to enable cloud_init support)

Adicionalmente vamos a crear un archivo .env con la siguiente variable de entorno:

    VAGRANT_EXPERIMENTAL="cloud_init,disks"

Más información en: [https://www.vagrantup.com/docs/cloud-init/usage](https://www.vagrantup.com/docs/cloud-init/usage)

Para indicarle a Vagrant que use un archivo de cloud-init usamos:


    config.vm.cloud_init do |cloud_init|
      cloud_init.content_type = "text/cloud-config"
      cloud_init.path = "../scripts/cloud-config.yml"
    end


Creamos el archivo en scripts/cloud-config.yml, este es el que contiene nuestra personalización:

    #cloud-config
    package_update: true
    packages:
    - nginx
    write_files:
    - path: /run/myserver/index.html
    owner: root:root
    permissions: "0644"
    content: "<h1>Hello, i was customized by Cloud-init.</h1>"
    runcmd:
    - cp /run/myserver/index.html /var/www/html/index.nginx-debian.html
    - systemctl enable --no-block nginx
    - systemctl start --no-block nginx
    final_message: "The system is finally up, after $UPTIME seconds"
    
El script anterior instala nginx y cambia el archivo html default creando uno nuevo con un mensaje personalizado. Finalmente imprimimos un mensaje.

El archivo Vagrantfile completo queda:
  
    Vagrant.configure("2") do |config|   
      config.env.enable # enable .env support plugin (needed to enable cloud_init support)
      config.vm.box = "ubuntu/bionic64"
      config.vm.hostname = "test"
      config.vm.network "private_network", ip: "192.168.56.10"
      config.vm.cloud_init do |cloud_init|
          cloud_init.content_type = "text/cloud-config"
          cloud_init.path = "../scripts/cloud-config.yml"
       end
     end

Creamos nuestra VM de prueba de manera local, dentro del directorio de vagrant y al nivel donde tenemos el archivo Vagrantfile ejecutamos:

    $ vagrant up

Cuando la Vm esté lista, podemos validar nuestros cambios abriendo en el navegador: [http://192.168.56.10/](http://192.168.56.10/)

Debemos ver:

![](/uploads/print.png) ​

Y para confirmar el mensaje que definimos, entramos a la VM:

    $ vagrant ssh
 
Podemos ver los logs de cloud-init en: /var/log/cloud-init-output.log: 

    $ cat /var/log/cloud-init-output.log

Ahora que sabemos que nuestra personalización funciona y está lista, vamos a la nube.

## Ejemplo de Cloud-init con Terraform en AWS

  

De la misma forma que hemos ya hablado de Terraform antes, por ahora nos centraremos en cómo pasar el archivo cloud-init a una instancia. La configuración relevante es:

 
    data "cloudinit_config" "server_config" {
      gzip = true  
      base64_encode = true
      part {
        content_type = "text/cloud-config"
        content = templatefile("../../scripts/cloud-config.yml")
      }
    }
       
    resource "aws_instance" "webserver1" {
      ami = data.aws_ami.ubuntu.id
      instance_type = var.instance_type
      tags = {
        Name = "testserver"
      }
      user_data = data.cloudinit_config.server_config.rendered
      subnet_id = data.aws_subnet.idex_subnet_public_1.id
      vpc_security_group_ids = [data.aws_security_group.idex_secgroup.id]
      key_name = var.key_name
      root_block_device {
        volume_type = "gp2"
        volume_size = "50"
      }
    }

Aqui estámos creando un recurso "cloudinit_config" que contiene la referencia al script de cloud-init:

     data "cloudinit_config" "server_config" {
          gzip = true  
          base64_encode = true
          part {
            content_type = "text/cloud-config"
            content = templatefile("../../scripts/cloud-config.yml")
          }
        }

Después pasamos ese recurso en la creación de la insancia EC2:

    user_data = data.cloudinit_config.server_config.rendered

Evidentemente este fragmento hace referencia a otros recursos, pero tienes todo el código disponible en el repositorio que compartí antes.

Configuramos nuestras credenciales de AWS para que terraform las use.
Puedes seguir [esta documentación](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) para más detalle. Y para obtener las credenciales puedes [visitar este enlance.](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)

FInalmente para crear la VM en AWS, dentro del directorio de network, crearemos los recursos de red como la VPC, subnet, grupo de seguridad, etc:
 

    $ terraform plan
    $ terraform apply

La salida se ve algo así:

    aws_key_pair.aws_key: Creating...
    aws_vpc.dex_vpc: Creating...
    aws_key_pair.aws_key: Creation complete after 0s [id=my_key]
    aws_vpc.dex_vpc: Still creating... [10s elapsed]
    aws_vpc.dex_vpc: Creation complete after 12s [id=vpc-0d1fb46f69fa9fdc8]
    aws_internet_gateway.prod_igw: Creating...
    aws_subnet.dex_subnet_public_1: Creating...
    aws_security_group.dex_secgroup: Creating...
    aws_internet_gateway.prod_igw: Creation complete after 0s [id=igw-0bf30fa9a5a880034]
    aws_route_table.prod_public_crt: Creating...
    aws_route_table.prod_public_crt: Creation complete after 1s [id=rtb-04f1c3e3a40d1cdfd]
    aws_security_group.dex_secgroup: Creation complete after 2s [id=sg-096e1d743c9473f38]
    aws_subnet.dex_subnet_public_1: Still creating... [10s elapsed]
    aws_subnet.dex_subnet_public_1: Creation complete after 11s [id=subnet-062a96927a5d9feff]
    aws_route_table_association.prod_crta_public_subnet_1: Creating...
    aws_route_table_association.prod_crta_public_subnet_1: Creation complete after 0s [id=rtbassoc-083de874a727e9b93]


Ahora dentro del grupo de compute, crearemos la instancia en la nube con los mismos comandos, primero el plan y luego aplicar:

    $ terraform plan
    $ terraform apply


La salida se ve algo así:

    aws_instance.webserver1: Creating...
    aws_instance.webserver1: Still creating... [10s elapsed]
    aws_instance.webserver1: Still creating... [20s elapsed]
    aws_instance.webserver1: Still creating... [30s elapsed]
    aws_instance.webserver1: Creation complete after 32s [id=i-09fe8eb1ff807e5c6]
    Apply complete! Resources: 1 added, 0 changed, 0 destroyed.


Validamos en la IP que se asignó:

  ![](/uploads/print2.png) ​


Vemos el mismo resultado que en Vagrant pero esta vez en la nube.

Así que de esta forma puedes personalizar tus instancias iterando de forma local y así llevar los resultados a tu ambiente de producción después.
  


Finalmente entramos de nuevo a cada directorio y destruimos los recursos:

    $ terraform destroy


Si te resulta útil, comparte =)
  

Referencias:
  
- [https://www.vagrantup.com/docs/cloud-init/usage](https://www.vagrantup.com/docs/cloud-init/usage)
- [https://www.vagrantup.com/docs/experimental](https://www.vagrantup.com/docs/experimental)
- [https://learn.hashicorp.com/tutorials/terraform/cloud-init](https://learn.hashicorp.com/tutorials/terraform/cloud-init)
- [https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/cloudinit_config](https://registry.terraform.io/providers/hashicorp/template/latest/docs/data-sources/cloudinit_config)
- [https://cloudinit.readthedocs.io/en/latest/index.html](https://cloudinit.readthedocs.io/en/latest/index.html)















