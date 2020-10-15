+++
comments = "true"
date = 2020-10-12T05:00:00Z
draft = true
image = ""
tags = ["devops", "cloud", "GCP", "packer"]
title = "Packer: Automatiza la creación de cualquier tipo de imagen de máquina virtual"

+++
Packer es una herramienta de creación de imágenes de código abierto, escrita en Go. Nos permite crear imágenes de máquina idénticas,  para múltiples plataformas de destino, desde una única fuente de configuración. [Packer](https://www.packer.io/) es compatible con Linux,  Windows y Mac OS X. También es  compatible con una amplia variedad de formatos de imagen,y cuenta con  integraciones para otras herramientas.

Una imagen de máquina es una unidad estática que contiene un sistema operativo preconfigurado y un software instalado. Podemos usar imágenes para clonar o crear nuevos hosts. Las imágenes ayudan a acelerar el proceso de construcción y despliegue de nueva infraestructura. Las imágenes vienen en muchos formatos, específicos para diversas plataformas y entornos de implementación.

Packer es rápido, relativamente rápido de aprender y fácil de automatizar. Cuando se usa en combinación con herramientas de administración de configuración, puede crear imágenes complejas y totalmente funcionales con software preinstalado y preconfigurado

El Packer tiene soporte para crear imágenes de Amazon EC2, CloudStack, DigitalOcean, Docker, Google Compute Engine, Microsoft Azure, QEMU, VirtualBox, VMware y más.

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

## Instalación en Linux

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

## Construir una imagen de VM para Digital Ocean