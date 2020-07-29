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

¿Por qué usar Packer?

Construir imágenes es tedioso. Es normalmente un proceso manual por lo tanto es propenso a errores. Packer puede automatizar la creación de imágenes e integrarse bien con  herramientas de gestión de condiguraciones como Ansible. Packer  permite crear pipelines para construir e implementar imágenes, lo que a su vez nos permite producir imágenes consistentes y repetibles.

Infraetructura Mutable vs Infraestructura Inutable

Golden Config

Configuration management