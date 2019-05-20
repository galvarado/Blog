+++
comments = "true"
date = "2019-05-16T05:00:00+00:00"
image = "/uploads/terraformansibledigitalocean.png"
tags = ["devops", "cloud", "best practices", "terraform"]
title = " Terraform + Ansible: Automatizar el despliegue de WordPress en DigitalOcean"

+++
Este tutorial es la segunda parte de la entrada anterior: [Tutorial: Infraestructura como código con Terraform](https://galvarado.com.mx/post/tutorial-infraestructura-como-c%C3%B3digo-con-terraform/).  En esta ocasión,  veremos un ejemplo que tiene como objetivo  automatizar todo el despliegue de una aplicación con terraform y veremos cómo podemos usar en conjunto RedHat Ansible para automatizar la configuración de la aplicación. Por tanto, se creará la infraestructura en Digital Ocean con Terraform y luego usaremos Ansible para instalar WordPress, PHP, Apache2 y MySQL como base de datos en los recursos de infraestructura creados en Terraform.

## Orquestacíón +  Gestión de configuración

Ansible y Terraform son soluciones complementarias, cada una tiene un rol en la gestión de aplicaciones y entornos. Terraform proporciona la gestión del ciclo de vida de la infraestructura, mientras que Ansible  ayuda a aprovisionar y configurar aplicaciones.

Mientras  que usando Terraform iniciaremos desde cero la infraestructura, con Ansible resolveremos la instalación de aplicaciones y las configuraciones como copiar archivos, cambiar rutas y permisos, iniciar servicios y habilitarlos etc.

## Paso a paso

El código que estaremos revisando [está disponible en este repositorio de Github](https://github.com/galvarado/terraform-ansible-DO-deploy-wordpress)

Podemos notar la siguiente estructura de los directorios:

    playbooks/

    digitalocean.tf  

    LICENSE 

    README.md 

    .gitignore

Ansible playbooks : [https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/](https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/ "https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/")

Ejecutar ansible desde terraform: [https://jite.eu/2018/7/16/terraform-and-ansible/](https://jite.eu/2018/7/16/terraform-and-ansible/ "https://jite.eu/2018/7/16/terraform-and-ansible/")

MySQL: [http://www.wiivil.com/installing-mysql-on-centos-7-server-using-ansible/](http://www.wiivil.com/installing-mysql-on-centos-7-server-using-ansible/ "http://www.wiivil.com/installing-mysql-on-centos-7-server-using-ansible/")

PHP: [https://www.cyberciti.biz/faq/how-to-install-php-7-2-on-centos-7-rhel-7/](https://www.cyberciti.biz/faq/how-to-install-php-7-2-on-centos-7-rhel-7/ "https://www.cyberciti.biz/faq/how-to-install-php-7-2-on-centos-7-rhel-7/")

WOrdpress CLI: [https://github.com/tlezotte/ansible-wp-cli](https://github.com/tlezotte/ansible-wp-cli "https://github.com/tlezotte/ansible-wp-cli")

[https://wp-cli.org/es/](https://wp-cli.org/es/ "https://wp-cli.org/es/")

[https://medium.com/@beBrllnt/from-30-minutes-to-10-seconds-automating-wordpress-setup-5ff7526942c0](https://medium.com/@beBrllnt/from-30-minutes-to-10-seconds-automating-wordpress-setup-5ff7526942c0 "https://medium.com/@beBrllnt/from-30-minutes-to-10-seconds-automating-wordpress-setup-5ff7526942c0")