+++
comments = "true"
date = "2019-05-16T05:00:00+00:00"
image = "/uploads/terraformansibledigitalocean.png"
tags = ["devops", "cloud", "best practices", "terraform"]
title = " Terraform + Ansible: Automatizar el despliegue de WordPress en DigitalOcean"

+++
Este tutorial es la segunda parte de la entrada anterior: [Tutorial: Infraestructura como código con Terraform](https://galvarado.com.mx/post/tutorial-infraestructura-como-c%C3%B3digo-con-terraform/).  En esta ocasión,  veremos un ejemplo que tiene como objetivo  automatizar todo el despliegue de una aplicación con terraform y veremos cómo podemos usar en conjunto RedHat Ansible para automatizar la configuración de la aplicación. Por tanto, se creará la infraestructura en Digital Ocean con Terraform y luego usaremos Ansible para instalar WordPress, PHP, Apache2 y MySQL como base de datos en los recursos de infraestructura creados en Terraform.

Ansible y Terraform son soluciones complementarias, cada una tiene un rol en la gestión de aplicaciones y entornos. Terraform proporciona la gestión del ciclo de vida de la infraestructura, mientras que Ansible  ayuda a aprovisionar y configurar aplicaciones.

Mientras  que usando Terraform iniciaremos desde cero la infraestructura, con Ansible resolveremos la instalación de aplicaciones y las configuraciones como copiar archivos, cambiar rutas y permisos, iniciar servicios y habilitarlos etc.

## Desplegar Wordpress en Digital Ocean

El código en el que se basa este tutorial está disponible en [está disponible en este repositorio de Github](https://github.com/galvarado/terraform-ansible-DO-deploy-wordpress).  Será necesario para comprender lo que estaremos revisando. Primero mostraré lo necesario para ejecutar el código por cuenta propia para ver en acción a Terraform y a Ansible trabajando juntos. Posteriormente explicaré todo el código para entender todo lo que sucede debajo y cómo se logra.

**1.Clonar el repositorio de github:**

    git clone git@github.com:galvarado/terraform-ansible-DO-deploy-wordpress.git

**2.Obtener token de Digital Ocean:**

Para aprovisionar la infraestructura dónde se instalará el blog con Wordpress es necesario contar con una cuenta en Digital Ocean. Una vez tengamos la cuenta hay que darle acceso a Terraform para que pueda crear la infraestructura por nosotros. 

Para esto es necesario generar un token, ir a la página [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens "https://cloud.digitalocean.com/account/api/tokens") y crear un token:

![](/uploads/tokenDO.png)

Asignamos un nombre para reconocerlo y copiamos el token, usaremos el valor copiado en el siguiente paso. Es necesario crear un token con permisos de lectura, como se muestra en la imagen:

![](/uploads/tokenDO2.png)

**3. Crear archivo de variables para configuración**

En la ruta raíz del código, crear un archivo con nombre _terraform.tfvars_ y colocar las siguientes 2 variables:

* do_token :deberá tener el token creado en el paso previo.
* ssh_key_private: la ruta de la llave privada que será usada para acceder al servidor en Digital Ocean. 

**terraform.tfvars**

    do_token = "123bc07c22f942ceccbdc010ff18025db0199bd6f916953c90b974d95caa7439"

    ssh_key_private = "~/.ssh/id_rsa"

**4. Configuración de Wordpress (opcional)**

Aunque no es necesario para ejecutar el código, opcionalmente se pueden cambiar los valores definidos para la base de datos de MySQL que se usará con wordpress aí como los valores de configuración de wordpress:

_playbooks/roles/mysql/defaults/main.yml_ contiene las siguientes variables que se pueden modificar:

    ---

    # defaults file for mysql

    wp_mysql_db: wordpress

    wp_mysql_user: wordpress

    wp_mysql_password: randompassword

Si no se modifican estos valores, serán los datos que se usarán para crear la base de datos de wordpress en MySQL y también serán los valores que se usarán en el archivo wp_config.php mientras ansible configura el sitio.

_playbooks/roles/wordpress/defaults/main.yml_ contiene las siguientes variables que se pueden modificar:

    ---

    # defaults file for wordpress

    wp_site_title: New blog

    wp_site_user: superadmin

    wp_site_password: strongpasshere

    wp_site_email: some_email@example.com

Si no se modifican estos valores, serán los datos que necesitarás para entrar a Wordpress como usuario administrador.

**5. Ejecutar terraform**

SI no cuentas con Terraform instalado, en este enlance están los pasos para instalarlo:  [Tutorial: Infraestructura como código con Terraform](https://galvarado.com.mx/post/tutorial-infraestructura-como-c%C3%B3digo-con-terraform/).

Para desplegar el blog solo tenemos que ejecutar los siguientes comandos:

    [galvarado@zenbook terraform-ansible-DO-deploy-wordpress]$ terraform plan

    [galvarado@zenbook terraform-ansible-DO-deploy-wordpress]$ terraform apply

Una vez finalizada la ejecución de los playbooks, podremos acceder a nuestro blog en la dirección/IP que se muestra como output de ansible:

## Paso a paso

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