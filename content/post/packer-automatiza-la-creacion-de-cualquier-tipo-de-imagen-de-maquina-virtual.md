+++
comments = "true"
date = 2020-08-07T05:00:00Z
draft = true
image = ""
tags = ["devops", "cloud", "GCP", "packer"]
title = "Packer: Automatiza la creación de cualquier tipo de imagen de máquina virtual"

+++
Packer es una herramienta de creación de imágenes de código abierto, escrita en Go. Nos permite crear imágenes de máquina idénticas,  para múltiples plataformas de destino, desde una única fuente de configuración. Packer es compatible con Linux,  Windows y Mac OS X. También etible con una amplia variedad de formatos de imagen,y cuenta con  integraciones para otras herramientas.

Una imagen de máquina es una unidad estática que contiene un sistema operativo preconfigurado y un software instalado. Podemos usar imágenes para clonar o crear nuevos hosts. Las imágenes ayudan a acelerar el proceso de construcción y despliegue de nueva infraestructura. Las imágenes vienen en muchos formatos, específicos para diversas plataformas y entornos de implementación.

Packer es rápido, relativamente rápido de aprender y fácil de automatizar. Cuando se usa en combinación con herramientas de administración de configuración, puede crear imágenes complejas y totalmente funcionales con software preinstalado y preconfigurado

## ¿Por qué usar Packer?

Construir imágenes es tedioso. Es normalmente un proceso manual por lo tanto es propenso a errores. Packer puede automatizar la creación de imágenes e integrarse bien con  herramientas de gestión de condiguraciones como Ansible. Packer  permite crear pipelines para construir e implementar imágenes, lo que a su vez nos permite producir imágenes consistentes y repetibles.

#### Casos de uso: Entrega continua

Packer se integra bien con las herramientas de infraestructura existentes. Se puede agregar en un pipeline de implementación.  Es decir, parte del pipeline será crear la imagen. Un ejemplo de esto es la fase [Bake de Spinnaker](https://galvarado.com.mx/post/despliegue-continuo-con-spinnaker/).

Packer puede crear imagenes de  Amazon Machine Images (AMI) , después Terraform puede usar esas AMI cuando se crean hosts y servicios y podemos ejecutar Ansible ( periódicamente) para proporcionar la configuración final y mantener nuestros hosts configurados correctamente.

Esto significa que si necesitamos un nuevo host o tenemos que reemplazar un host que no funciona correctamente, el proceso es rápido y consistente. Nuestra infraestructura se vuelve desechable, reemplazable y repetible. Es decir, manejamos un enfoque de infraestructura inmutable.

#### Casos de uso: Consistencia ambiental

¿Tienes una infraestructura compleja, con numerosos entornos que abarcan desarrollo, pruebas, staging y producción? Packer es ideal para estandarizar   esos entornos. Como admite numerosas plataformas de destino, puede crear imágenes estándar para todo tipo de plataformas. 

Por ejemplo,  un equipo de seguridad puede usar Packer para crear imágenes que luego se comparten con otros grupos para proporcionar el "hardening" de base que para imponer estándares entre equipos.

## Infraetructura Mutable vs Infraestructura Inutable

## Golden Config

## Configuration management

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