+++
comments = "true"
date = "2019-05-16T05:00:00+00:00"
image = "/uploads/terraformansibledigitalocean.png"
tags = ["devops", "cloud", "best practices", "terraform"]
title = " Terraform + Ansible: Automatizar el despliegue de WordPress en DigitalOcean"

+++
Este tutorial es la segunda parte de la entrada anterior: [Tutorial: Infraestructura como código con Terraform](https://galvarado.com.mx/post/tutorial-infraestructura-como-c%C3%B3digo-con-terraform/).  En esta ocasión,  veremos un ejemplo que tiene como objetivo  automatizar todo el despliegue de una aplicación con terraform y veremos cómo podemos usar en conjunto RedHat Ansible para automatizar la configuración de la aplicación. Por tanto, se creará la infraestructura en Digital Ocean con Terraform y luego usaremos Ansible para instalar WordPress, PHP, Apache2 y MySQL como base de datos en los recursos de infraestructura creados en Terraform.

Ansible y Terraform son soluciones complementarias, cada una tiene un rol en la gestión de aplicaciones y entornos, mientras  que usando Terraform iniciaremos desde cero la infraestructura, con Ansible resolveremos la instalación de aplicaciones y las configuraciones como copiar archivos, cambiar rutas y permisos, iniciar servicios y habilitarlos etc.

## Desplegar Wordpress en Digital Ocean

El código en el que se basa este tutorial  [está disponible en este repositorio de Github](https://github.com/galvarado/terraform-ansible-DO-deploy-wordpress).  Será necesario para comprender lo que estaremos revisando. Primero mostraré lo necesario para ejecutar el código por cuenta propia para ver en acción a Terraform y a Ansible trabajando juntos. Posteriormente explicaré todo el código para entender todo lo que sucede debajo y cómo se logra.

La máquina virtual donde que se creará  tiene los siguientes recursos:

* Tamaño: s-1vcpu-1gb
* Región: nyc1
* Sistema operativo: centos-7-x64

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

Aunque no es necesario para ejecutar el código, opcionalmente se pueden cambiar los valores definidos para la base de datos de MySQL que se usará con wordpress así como los valores de configuración de wordpress:

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

![](/uploads/Screenshot-20190520132957-1156x242.png)

En mi caso el host creado para wordpress está en la IP 104.248.226.237, por tanto al dirigirme a http://104.248.226.237 encuentro el blog recién instalado:

![](/uploads/Screenshot-20190520133138-1178x768.png)

## Paso a paso

¿Que sucedió por debajo para poder crear la infraestructura e instalar Wordpress totalmente de una manera automatizada?

Este es el resumen de las tareas ejecutadas:

Terraform:

* Create Digitral Ocean droplet

Ansible:

* Install python 2
* Update yum cache
* Download and install MySQL Community Repo
* Install MySQL Server
* Install remi repo
* Enable remi-php72
* Update yum
* Install Apache and PHP
* Install php extensions
* Start MySQL Server and enable it
* Remove Test database if it exists
* Remove All Anonymous User Accounts
* Create mysql database
* Create mysql user
* Download WordPress
* Extract WordPress 
* Update default Apache site
* Update default document root
* Copy sample config file
* Update WordPress config file
* Download wp-cli
* Test if wp-cli is correctly installed
* Finish wordpress setup via wp-cli
* Restart apache

En el repositorio podemos notar la siguiente estructura de los directorios:

    playbooks/
    digitalocean.tf 
    LICENSE 
    README.md 
    .gitignore

## Terraform

El flujo que sigue terraform es crear la máquina virtual y una vez lista, ejecutar el playbook de ansible que instala wordpress.

El archivo **digitalocean.tf** contiene la configuración de Terraform para crear la máquina virtual:

    variable "do_token" {}
    variable "ssh_key_private" {}
    
    # Configure the DigitalOcean Provider
    provider "digitalocean" {
        token = "${var.do_token}"
    }
    
    # Create a web server
    resource "digitalocean_droplet" "myblog" {
        image  = "centos-7-x64"
        name   = "myblog"
        region = "nyc1"
        size   = "s-1vcpu-1gb"
        monitoring = "true"
        ssh_keys = ["1632017"]
    
        # Install python on the droplet using remote-exec to execute ansible playbooks to configure the services
        provisioner "remote-exec" {
            inline = [
              "yum install python -y",
            ]
    
             connection {
                host        = "${self.ipv4_address}"
                type        = "ssh"
                user        = "root"
                private_key = "${file("~/.ssh/id_rsa")}"
            }
        }
    
       

La primer parte del archivo define las varibales a usar y configura el privisioner de Digital Ocean. Posteriormente se define el recurso a crear, en este caso es un máquina virtual. Aquí se definen las características de la máquina virtual:

    # Create a web server

    resource "digitalocean_droplet" "myblog" {

        image  = "centos-7-x64"

        name   = "myblog"

        region = "nyc1"

        size   = "s-1vcpu-1gb"

        monitoring = "true"

        ssh_keys = ["1632017"]

    

Se usa el provisioner "remote-exec" para conectarnos de manera remota  e instalar python, este es requisito para poder utilizar ansible en ese host:

    provisioner "remote-exec" {

            inline = [

              "yum install python -y",

            ]

             connection {

                host        = "${self.ipv4_address}"

                type        = "ssh"

                user        = "root"

                private_key = "${file("~/.ssh/id_rsa")}"

            }

        }

Se usa el provisioner "local-exec" para ejecutar el playbook de ansible:

    # Execute ansible playbooks using local-exec 

        provisioner "local-exec" {

            environment {

                PUBLIC_IP                 = "${self.ipv4_address}"

                PRIVATE_IP                = "${self.ipv4_address_private}"

                ANSIBLE_HOST_KEY_CHECKING = "False" 

            }

            working_dir = "playbooks/"

            command     = "ansible-playbook -u root --private-key ${var.ssh_key_private} -i ${self.ipv4_address}, wordpress_playbook.yml "

        }

    }

En la sección environment se establecen algunas variables de entrono. Se ejecuta el playbook "wordpress_playbook.yml" y se pasa como  argumento la IP del host creado y la llave para conectarnos vía ssh. El comando que ejecuta ansible es:

    command     = "ansible-playbook -u root --private-key ${var.ssh_key_private} -i ${self.ipv4_address}, wordpress_playbook.yml "

Esto es todo lo que hace Terraform, ahora revisemos lo que hace Ansible.

## Ansible

Dentro del directorio "playbooks" se encuentran los archivos de ansible que realizan la instalación de wordpress. Usé roles de ansible para modularizar la configuración. Los roles son una característica robusta de Ansible que facilita la reutilización, los roles son el mecanismo principal para dividir un playbook en varios archivos, la división del playbook permite dividir lógicamente los componentes volviendolo reutilizable.

Básicamente, cada rol está limitado a una funcionalidad particular o un resultado deseado, entonces el rol contiene todos los pasos necesarios para llegar a ese resultado. Para el ejemplo de wordpress cree 4 roles:

* server
* php
* mysql
* wordpress

Por lo regular un role corresponde a un host diferente, pero en este caso el mismo host tendrá todos los roles. Por ejemplo, el rol de wordpress contiene las tareas necesarias para instalar wordpress.

Los roles se crean ejecutando el siguiente comando: 

    $ ansible-galaxy init [ROLE]

**Playbook  install_wordpress**

**Rol "server"**

**Rol "php"**

**Rol "mysql"**

**Rol "wordpress"**

Con esto tenemos un ejemplo mucho más robusto de las capacidades de terraform y como agregando Ansible a la jugada hemos creado la automatización suficiente para crear infraestructura e instalar aplicaciones. 

Si te pareció interesante, ayúdame compartiendo =)

Referencias:

* [https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/](https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/ "https://dotlayer.com/how-to-use-an-ansible-playbook-to-install-wordpress/")
*  [https://jite.eu/2018/7/16/terraform-and-ansible/](https://jite.eu/2018/7/16/terraform-and-ansible/ "https://jite.eu/2018/7/16/terraform-and-ansible/")
*  [http://www.wiivil.com/installing-mysql-on-centos-7-server-using-ansible/](http://www.wiivil.com/installing-mysql-on-centos-7-server-using-ansible/ "http://www.wiivil.com/installing-mysql-on-centos-7-server-using-ansible/")
*  [https://www.cyberciti.biz/faq/how-to-install-php-7-2-on-centos-7-rhel-7/](https://www.cyberciti.biz/faq/how-to-install-php-7-2-on-centos-7-rhel-7/ "https://www.cyberciti.biz/faq/how-to-install-php-7-2-on-centos-7-rhel-7/")
*  [https://github.com/tlezotte/ansible-wp-cli](https://github.com/tlezotte/ansible-wp-cli "https://github.com/tlezotte/ansible-wp-cli")