+++
comments = "true"
date = "2019-05-09T15:00:00+00:00"
image = "/uploads/Terraform.png"
tags = ["devops", "cloud", "CloudOps"]
title = "Tutorial: Infraestructura como código con Terraform"

+++
Esta ocasión quiero hablar sobre qué es la Infraestructura como código y cómo empezar a usarla con Terraform. **Terraform** es un software de código libre que permite a partir de un lenguaje de alto nivel crear el plan de construcción de una infraestructura compleja, esto sería Infrastructura como código (Infrastructure as Code).

## ¿Que es Infrastructura cómo código?

Infraestructura como código hace referencia a la  práctica de utilizar scripts para configurar la infraestructura de una aplicación como máquinas virtuales, en lugar de configurar estas máquinas de forma manual.

La infraestructura como código permite a las máquinas virtuales gestionarse de manera programada, lo que elimina la necesidad de realizar configuraciones manuales (y actualizaciones) de componentes individuales. Esto es una  construcción de infraestructura más consistente y de mayor calidad con mejores capacidades de administración, maximizando la eficiencia y evitando el error humano.

 El resultado es una infraestructura  muy elástica, escalable y replicable gracias a la  capacidad de modificar, configurar y apagar cientos de máquinas en cuestión de minutos con solo presionar un botón.

Las mejores prácticas de DevOps, incluido el control de versiones, las pruebas  y el monitoreo continuo, se aplican al código que gobierna la creación y administración de la infraestructura. **Básicamente, la infraestructura es tratada de la misma manera que cualquier otro código.**

Los equipos ahora  pueden implementar o actualizar una infraestructura formada por docenas de servidores en cuestión de minutos sin necesidad de instalar nada. Simplemente se activa el proceso que se ha escrito en el código y las máquinas hacen el trabajo. Si es necesario es posible retroceder a la última versión estable de la configuración del servidor haciendo que las pruebas sean más sencillas.

## Gestión de configuración vs orquestación

Establecido lo que es la infrastructura cómo código, queda una importante aclaración que hacer ¿Entonces cual es la diferencia de usar Ansible o Chef para gestionar la configuración? 

Chef, Puppet, Ansible y SaltStack son herramientas de "gestión de configuración" lo que significa que están diseñadas para instalar y administrar software en **servidores** **existentes**.  

Terraform, CloudFormation, OpenStack Heat y otros, son "herramientas de orquestación" lo que significa que están diseñadas para aprovisionar los servidores, dejando el trabajo de configurar esos servidores para otras herramientas. 

Estas dos categorías no se excluyen, ya que la mayoría de las herramientas de gestión de configuración pueden realizar cierto grado de aprovisionamiento y la mayoría de las herramientas de orquestación pueden realizar cierto grado de gestión de configuración. Pero el enfoque en la gestión de la configuración o la orquestación significa que algunas de las herramientas se adaptarán mejor a ciertos tipos de tareas.

Ambas tareas, gestión de configuración y orquestación forman parte del ciclo de vida de las aplicaciones y la infraestructura en un equipo DevOps. Ambas son tareas de automatización, pero con enfoques distintos.

Una buena comparativa de estos puntos se encuentra un articulo en medium de [Yevgeniy Brikman](https://blog.gruntwork.io/@brikis98): [Why we use Terraform and not Chef, Puppet, Ansible, SaltStack, or CloudFormation](https://blog.gruntwork.io/why-we-use-terraform-and-not-chef-puppet-ansible-saltstack-or-cloudformation-7989dad2865c).

## Introducción a Terraform

"Terraform es una herramienta para construir, combinar y poner en marcha de manera segura y eficiente la infraestructura. Desde servidores físicos a contenedores hasta productos SaaS (Software como un Servicio), Terraform es capaz de crear y componer todos los componentes necesarios para ejecutar cualquier servicio o aplicación."

Se define la infraestructura completa como código, incluso si se extiende a múltiples proveedores de servicios. Por ejemplo los servidores pueden estar de Openstack, el DNS en AWS, terraform construirá todos los recursos a través de estos proveedores en paralelo, con esto se proporciona un flujo de trabajo y se usa como herramientas para cambiar y actualizar la infraestructura con seguridad.

Los archivos de configuración describen en Terraform los componentes necesarios para ejecutar una sola aplicación o el centro de datos completo. Terraform genera un plan de ejecución que describe lo que hará para alcanzar el estado deseado y luego lo ejecuta para construir la infraestructura descrita. A medida que cambia la configuración, Terraform puede determinar qué ha cambiado y crear planes de ejecución incrementales que se pueden aplicar.

La infraestructura que Terraform puede administrar incluye componentes de bajo nivel, como instancias de cómputo, almacenamiento y redes, así como componentes de alto nivel como entradas de DNS, características de SaaS, etc.

Las principales características de Terraform son:

**Infraestructura como código**

La infraestructura se describe utilizando una sintaxis de alto nivel. Esto permite que un blueprint sea versionado y tratado como lo haría con cualquier otro código. Estos archivos que describen la infraestructura pueden ser compartidos y reutilizados.

**Planes de Ejecución**

Terraform tiene un paso de "planificación" donde genera un plan de ejecución. El plan de ejecución muestra lo que hará Terraform cuando se ejecute. Esto  permite evitar sorpresas.

**Gráfico de recursos**

Terraform crea un gráfico de todos los recursos y paraleliza la creación y modificación de cualquier recurso. Con esto los operadores obtienen información sobre las dependencias en la infraestructura.

**Automatización de cambios** 

Los conjuntos de cambios complejos se pueden aplicar a su infraestructura con una mínima interacción humana. Con el plan de ejecución y el gráfico de recursos mencionados anteriormente, se sabe exactamente qué cambiará Terraform y en qué orden, evitando muchos posibles errores humanos.

## Instalación de Terraform

Este tutorial sigue los pasos para de instalación para Linux - Fedora 29.

###   
1\. Descargar el paquete

Descargar el paquete según la plataforma. El paquete debe descargarse desde [https://www.terraform.io/downloads.html](https://www.terraform.io/downloads.html "https://www.terraform.io/downloads.html"). 

Sistemas operativos compatibles con Terraform:

* Linux: 32­bit | 64­bit | Arm
* Windows: 32­bit | 64­bit
* Mac OS X: 64­bit
* FreeBSD: 32­bit | 64­bit | Arm
* OpenBSD: 32­bit | 64­bit
* Solaris: 64­bit

Seleccionamos el sistema operativo y la arquitectura, en mi caso elegiremos Linux 64­bit puesto que lo instalaremos en una maquina con Fedora 29.

### 2. Instalación

#### 2.1 Crear un directorio para los binarios de Terraform:

    [root@zenbook Descargas]# mkdir /opt/terraform

#### 2.2 Mover el archivo descargado anteriormente al interior del directorio:

    [root@zenbook Descargas]# mv terraform_0.11.13_linux_amd64.zip /opt/terraform/

#### 2.3 Nos situamos en el directorio terraformy descomprimimos los binarios:

    [root@zenbook Descargas]# cd /opt/terraform/

    [root@zenbook terraform]# unzip terraform_0.11.13_linux_amd64.zip 

    Archive:  terraform_0.11.13_linux_amd64.zip

      inflating: terraform

#### 2.4 Exportamos las variables de entorno para añadir el directorio de Terraform al PATH del sistema (variable $PATH):

    [root@zenbook terraform]# export PATH="$PATH:/opt/terraform"

Para hacer persistente el cambio y que el binario de terraform sea reconocido despues de esta sesión la terminar debemos agregarlo en \~/.profile o \~/.bashrc:

    [root@zenbook ~]# echo PATH="$PATH:/opt/terraform" >>  ~/.bashrc

    [root@zenbook ~]# source .bashrc

#### 2.5 Por último comprobamos que se ha instalado bien ejecutando el comando siguiente:

    [root@zenbook terraform]# terraform --version

    Terraform v0.11.13

## Primeros pasos con Terraform

### Archivos de configuración

Terraform utiliza archivos de texto para describir la infraestructura y establecer variables. El lenguaje de los ficheros de configuración de Terraform se llama HashiCorp Configuration Language (HCL). Los ficheros se deberán crear con la extensión “.tf”.

El formato de los archivos de configuración puede estar en dos formatos: formato Terraform y JSON. El formato de Terraform es más legible, admite comentarios y es el formato generalmente recomendado para la mayoría de los archivos de Terraform. El formato JSON está destinado a las máquinas para crear, modificar y actualizar, pero los operadores de Terraform también pueden hacerlo si lo prefiere. El formato Terraform termina en .tf y el formato JSON termina en .tf.json.

Ejemplo de archivo Terraform, en el cual  conectamos a una nube OpenStack para crear una máquina virtual:

    [root@zenbook terraform-example]# cat openstack-example.tf 

    # Configure the OpenStack Provider

    provider "openstack" {

      user_name   = "admin"

      tenant_name = "admin"

      password    = "w3h58h3ooq"

      auth_url    = "http://controller01:5000/v3"

      region      = "RegionOne"

    }

    # Create a RHEL server

    resource "openstack_compute_instance_v2" "basic" {

      name            = "vm_from_terraform"

      image_id        = "765887bd-2635-4c2e-9feb-248a1b7707ea"

      flavor_id       = "c98478b4-2d58-42f6-940e-15bdea5aa74f"

      

      metadata = {

        this = "that"

      }

      network {

        name = "Openshift_Network"

      }

    }

### Proveedores de Terraform

Terraform se utiliza para crear, administrar y actualizar recursos de infraestructura como máquinas físicas, máquinas virtuales, routers , contenedores y más. Casi cualquier tipo de infraestructura puede representarse como un recurso en Terraform.

Un proveedor es responsable de comprender las interacciones de  API entre terraform y la plataforma proveedora de los recursos y crear los recursos. 

Los proveedores generalmente son IaaS, por ejemplo:

* AWS
* GCP
* Microsoft Azure
* OpenStack
* Digital Ocean

Proveedores de PaaS: 

* Heroku
* Nutanix
* Rancher
* Kubernetes (No es completamente un PaaS)

Servicios  SaaS:

* Terraform Enterprise
*  DNSimple
* CloudFlare
* Bitbucket
* Datadog

La lista completa de proveedores se encuentra en la documentación oficial: [https://www.terraform.io/docs/providers/index.html](https://www.terraform.io/docs/providers/index.html "https://www.terraform.io/docs/providers/index.html") 

La mayoría de los proveedores requieren algún tipo de configuración para proporcionar información de autenticación, URLs, etc. Cuando se requiere una configuración explícita, se utiliza un bloque de proveedor dentro de la configuración, como se ilustra a continuación:

Configuración para conectar a OpenStack como proveedor:

    # Configure the OpenStack Provider
    provider "openstack" {
      user_name   = "admin"
      tenant_name = "admin"
      password    = "pwd"
      auth_url    = "http://myauthurl:5000/3"
      region      = "RegionOne"
    }

Configuración para conectar a AWS como proveedor:

    # Configure the AWS Provider
    provider "aws" {
      access_key = "${var.aws_access_key}"
      secret_key = "${var.aws_secret_key}"
      region     = "us-east-1"
    }

Referencias:

*  [https://terraform-infraestructura.readthedocs.io/es/latest/caracteristicas/index.html](https://terraform-infraestructura.readthedocs.io/es/latest/caracteristicas/index.html "https://terraform-infraestructura.readthedocs.io/es/latest/caracteristicas/index.html")
* [https://www.terraform.io/intro/index.html](https://www.terraform.io/intro/index.html "https://www.terraform.io/intro/index.html")
* [https://learn.hashicorp.com/terraform/getting-started/install](https://learn.hashicorp.com/terraform/getting-started/install "https://learn.hashicorp.com/terraform/getting-started/install")