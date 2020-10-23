+++
comments = "true"
date = 2020-10-23T12:00:00Z
image = "/uploads/packercloud.png"
tags = ["devops", "cloud", "GCP", "packer"]
title = "Packer: Automatiza la creación de cualquier tipo de imagen de máquina virtual"

+++
Packer es una herramienta de creación de imágenes de código abierto, escrita en Go. Nos permite crear imágenes de máquina idénticas,  para múltiples plataformas de destino, desde una única fuente de configuración. [Packer](https://www.packer.io/) es compatible con Linux,  Windows y Mac OS X. También es  compatible con una amplia variedad de formatos de imagen y cuenta con  integraciones para otras herramientas.

Una imagen de máquina es una unidad estática que contiene un sistema operativo preconfigurado y un software instalado. Podemos usar imágenes para clonar o crear nuevos hosts. Las imágenes ayudan a acelerar el proceso de construcción y despliegue de nueva infraestructura. Las imágenes vienen en muchos formatos, específicos para diversas plataformas y entornos de implementación.

Packer es rápido, relativamente rápido de aprender y fácil de automatizar. Cuando se usa en combinación con herramientas de administración de configuración, puede crear imágenes complejas y totalmente funcionales con software preinstalado y preconfigurado

Packer tiene soporte para crear imágenes de Amazon EC2, CloudStack, DigitalOcean, Docker, Google Compute Engine, Microsoft Azure, QEMU, VirtualBox, VMware y más.

![](/uploads/packer-workflow.png)

## ¿Por qué usar Packer?

Construir imágenes es tedioso. Es normalmente un proceso manual por lo tanto es propenso a errores. Packer puede automatizar la creación de imágenes e integrarse bien con  herramientas de gestión de condiguraciones como Ansible. Packer  permite crear pipelines para construir e implementar imágenes, lo que a su vez nos permite producir imágenes consistentes y repetibles.

#### Casos de uso: Consistencia ambiental

¿Tienes una infraestructura compleja, con numerosos entornos que abarcan desarrollo, pruebas, staging y producción? Packer es ideal para estandarizar esos entornos. Como admite numerosas plataformas de destino, puede crear imágenes estándar para todo tipo de plataformas.

Por ejemplo,  un equipo de seguridad puede usar Packer para crear imágenes que luego se comparten con otros grupos para proporcionar el "hardening" de base que para imponer estándares entre equipos.

#### Casos de uso: Entrega continua

Packer se integra bien con las herramientas de infraestructura existentes. Se puede agregar en un pipeline de implementación.  Es decir, parte del pipeline será crear la imagen. Un ejemplo de esto es la fase [Bake de Spinnaker](https://galvarado.com.mx/post/despliegue-continuo-con-spinnaker/).

Packer puede crear imagenes de  Amazon Machine Images (AMI) , después Terraform puede usar esas AMI cuando se crean hosts y servicios y podemos ejecutar Ansible ( periódicamente) para proporcionar la configuración final y mantener nuestros hosts configurados correctamente.

Esto significa que si necesitamos un nuevo host o tenemos que reemplazar un host que no funciona correctamente, el proceso es rápido y consistente. Nuestra infraestructura se vuelve desechable, reemplazable y repetible. Es decir, manejamos un enfoque de infraestructura inmutable.

**![](/uploads/flow.png)**

Los beneficios de una infraestructura inmutable incluyen más consistencia y confiabilidad en la infraestructura y un proceso de implementación más simple y predecible. Mitiga o previene por completo los problemas que son comunes en las infraestructuras mutables, como las diferencias de configuración.

## Infraestructura Mutable vs Infraestructura Inmutable

En una infraestructura tradicional, los servidores se actualizan y modifican continuamente. Los  administradores que trabajan con este tipo de infraestructura pueden acceder a los servidores, actualizar paquetes manualmente, modificar los archivos de configuración servidor por servidor e implementar código nuevo directamente en los servidores. En otras palabras, estos servidores son mutables; se pueden cambiar después de su creación. La infraestructura compuesta por servidores mutables puede denominarse tradicional o (despectivamente) artesanal.

Una infraestructura inmutable es otro paradigma de infraestructura en el que los servidores nunca se modifican después de su implementación. Si algo necesita ser actualizado, reparado o modificado de alguna manera, se aprovisionan nuevos servidores construidos a partir de una imagen común con los cambios apropiados para reemplazar los antiguos. Una vez validados, se ponen en uso y los antiguos se retiran.

Los beneficios de una infraestructura inmutable incluyen más consistencia y confiabilidad en la infraestructura y un proceso de implementación más simple y predecible. Mitiga o previene por completo los problemas que son comunes en las infraestructuras mutables. Sin embargo, usarlo de manera eficiente a menudo incluye la automatización integral de la implementación, el aprovisionamiento rápido de servidores en un entorno flexible y soluciones externas para manejar los estados.

La diferencia más fundamental entre la infraestructura mutable e inmutable está en su política central: los componentes de la primera están diseñados para cambiarse después de la implementación; los componentes de la última están diseñados para permanecer sin cambios y finalmente ser reemplazados.

¿Tomamos la infraestructura existente y tratamos de actualizarla en su lugar, o tomamos la infraestructura existente, creamos una nueva infraestructura y destruimos lo existente en su lugar? Esa es la distinción fundamental entre infraestructura mutable e inmutable.

# Manos a la Obra

**1.Descargar desde** [https://www.packer.io/downloads.html](https://www.packer.io/downloads.html "https://www.packer.io/downloads.html")

    wget https://releases.hashicorp.com/packer/1.6.0/packer_1.6.0_linux_amd64.zip

**2. Desempacar**

    $ unzip packer_1.6.0_linux_amd64.zip

**3. Colocar en el OS Path**

    $ cp packer /usr/local/bin/

**3. Agregar a $PATH**

    $ export PATH=/usr/local/packer:$PATH

Para agregarlo al shell startup:

    $ echo 'export PATH=/usr/local/packer:$PATH' | tee -a ~/.zshrc

**4. Comprobar**

    $ packer version
    Packer v1.6.0

Documentación oficial: [https://www.packer.io/docs/install](https://www.packer.io/docs/install "https://www.packer.io/docs/install")

## Construir una imagen de VM para Vagrant

En el primer ejemplo, crearemos una imagen con Packer para ejecutar con Vagrant y Virtualbox en un entorno local. Esta imagen estará basada en Ubuntu 20.04. Para este caso es necesario descargar el ISO de Ubuntu. Packer nos ayudará a realizar una instalación desatentida mediante el[ autoinstall de Ubuntu.](https://ubuntu.com/server/docs/install/autoinstall)

El código del ejemplo  listo para ejecutar lo puedes descargar desde [este repositorio den Github](https://github.com/Instituto-i2ds/packer-template-ubuntu20.04)

Packer usa una plantilla en formato JSON para definir una imagen. Hay tres secciones principales en el archivo: builders, provisioners y postprocesamiento y una opcional, variables.

A continuación el template explicado por cada sección:

**Builders**

Los constructores es lo que determina qué tipo de imagen vamos crear. Aquí es donde le decimos a Packer que queremos una imagen para Vagrant (Virtualbox) en formato OVA.

    "builders": [
      {
      "type": "virtualbox-iso",
      "vboxmanage": [
        [ "modifyvm", "{{.Name}}", "--memory", "{{ user `ram` }}" ],
        [ "modifyvm", "{{.Name}}", "--vram", "36" ],
        [ "modifyvm", "{{.Name}}", "--cpus", "{{ user `cpus` }}" ]
      ],
      "guest_os_type": "Ubuntu_64",
      "disk_size": "{{ user `virtualbox_disk_size` }}",
      "headless": "{{ user `headless` }}",
      "iso_url": "{{ user `iso_url` }}",
      "iso_checksum": "{{ user `iso_checksum` }}",
      "vm_name": "ubuntu2004",
      "boot_command": [
      "<enter><enter><f6><esc><wait> ",
      "autoinstall ds=nocloud-net;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/",
      "<enter>"
      ],
      "boot_wait": "5s",
      "http_directory": "http",
      "shutdown_command": "echo 'vagrant'|sudo -S shutdown -P now",
      "ssh_password": "vagrant",
      "ssh_port": 22,
      "ssh_username": "vagrant",
      "ssh_timeout": "10000s",
      "ssh_handshake_attempts": "50",
      "guest_additions_mode": "upload",
      "guest_additions_path": "VBoxGuestAdditions_{{.Version}}.iso",
      "format": "ova"
    }
    ],

La sección builders define las características de la VM que se instala para construir la imagen. Esto está definido en la sección variables. Estamos usando el builder virtualbox-iso. [Puedes consultar todas las opciones aquí.](https://www.packer.io/docs/builders/virtualbox/iso)

**Provisioners**

    "provisioners": [{
            "environment_vars": [
                "HOME_DIR=/home/vagrant"
            ],
            "execute_command": "echo 'vagrant' | {{.Vars}} sudo -S -E sh -eux '{{.Path}}'",
            "expect_disconnect": true,
            "scripts": [
                "scripts/update.sh",
                "scripts/sudoers.sh",
                "scripts/virtualbox.sh",
                "scripts/vagrant.sh",
                "scripts/cleanup.sh"
            ],
            "type": "shell"
        }],

Los aprovisionadores son la siguiente sección de un archivo JSON de Packer. Una vez instalado el sistema operativo, se invoca a los aprovisionadores para configurar el sistema.

Los scripts utilizados:

* update.sh: Actualiza los repositorios y paquetes del sistema
* sudoers.sh: configura que el usuario vagrant este en e sudoers, lo que evita que se pregunte por la contraseña con el comando sudo.
* virtualbox.sh: Instala los guest additions de vitualbox en la VM. Necesarios para funciones como shared folders.
* vagrant.sh: Descarga y coloca la llave pública para el usuario vagrant.
* cleanup: Borra archivos, el historial y reduce el tamaño final del disco.

**Variables**

    variables": {
            "headless": "false",
            "iso_checksum": "443511f6bf12402c12503733059269a2e10dec602916c0a75263e5d990f6bb93",
            "iso_url": "iso/ubuntu-20.04.1-live-server-amd64.iso",
            "version": "0",
            "ram": "1024",
            "cpus": "2",
            "virtualbox_disk_size": "12288"
        },

Esta sección define variables que se usan en algunos parametros antes descritos del template. Aquí indicamos la ruta donde colocamos el ISO descargado desde l[a página oficial de Ubuntu. ](https://releases.ubuntu.com/)

**Post-processors**

    "post-processors": [{
            "type": "vagrant",
            "compression_level": "8",
            "output": "output/ubuntu-20.04-{{.Provider}}.box"
        }]

Por último, están los postprocesadores. Este es opcional, pero es necesario para crear boxes de Vagrant. Estas se generan tomando una imagen genérica en OVF para Virtualbox y empaquetándola como una imagen de Vagrant. Otras opciones comúnmente usadas en los postprocesadores son la compresión de la imagen.

Solo nos resta construir la imagen con el siguiente comando:

    $ packer build  ubuntu2004.json

La imagen resultante se exportará en :

    output/ubuntu-20.04-virtualbox.box

## Como usar la imagen con Vagrant

Después de realizar el Build, podemos iniciar el entorno con Vagrant. 

1. **Primero añadimos el Box:**

       $ vagrant box add --name ubuntu-20.04 output/ubuntu-20.04-virtualbox.box
2. **Creamos un archivo Vagrantfile:**

       $ cat > Vagrantfile << 'EOF'
         # -*- mode: ruby -*-
         # vi: set ft=ruby :
       
         Vagrant.configure("2") do |config|
           config.vm.box = "ubuntu-20.04"
           config.vm.provider "virtualbox" do |vb|
             # Display the VirtualBox GUI when booting the machine
             vb.gui = false
           end
         end
       
       EOF
3. **Iniciamos el vagrant box y accedemos a él**

       $ vagrant up && vagrant ssh

Para el próximo tutorial veremos como construir imágenes para entornos de nube.

Si te parece útil, comparte =)

Referencias:

[https://github.com/chef/bento](https://github.com/chef/bento "https://github.com/chef/bento")

[https://nickcharlton.net/posts/automating-ubuntu-2004-installs-with-packer.html](https://nickcharlton.net/posts/automating-ubuntu-2004-installs-with-packer.html "https://nickcharlton.net/posts/automating-ubuntu-2004-installs-with-packer.html")

[https://nickhowell.uk/2020/05/01/Automating-Ubuntu2004-Images/](https://nickhowell.uk/2020/05/01/Automating-Ubuntu2004-Images/ "https://nickhowell.uk/2020/05/01/Automating-Ubuntu2004-Images/")