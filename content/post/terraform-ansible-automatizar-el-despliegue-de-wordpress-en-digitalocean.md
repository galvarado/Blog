+++
comments = "true"
date = "2019-05-16T05:00:00+00:00"
draft = true
image = ""
tags = ["devops", "cloud", "best practices", "terraform"]
title = " Terraform + Ansible: Automatizar el despliegue de WordPress en DigitalOcean"

+++
Ansible y Terraform son soluciones complementarias, cada una de las cuales es clave en la gestión de aplicaciones y entornos. Terraform proporciona la gestión del ciclo de vida de la infraestructura, mientras que Ansible  ayuda a aprovisionar y configurar aplicaciones.

Este tutorial muestra cómo aprovisionar la infraestructura en Digital Ocean con Terraform y luego usar Ansible para implementar WordPress con PHP y MariaDB como base de datos en los recursos de infraestructura creados en Terraform.

Ansible playbooks : [https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/](https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/ "https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/")

Ejecutar ansible desde terraform: [https://jite.eu/2018/7/16/terraform-and-ansible/](https://jite.eu/2018/7/16/terraform-and-ansible/ "https://jite.eu/2018/7/16/terraform-and-ansible/")