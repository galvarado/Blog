+++
comments = "true"
date = "2019-05-09T15:00:00+00:00"
image = "/uploads/Terraform.png"
tags = ["devops", "cloud", "CloudOps"]
title = "Tutorial: Infraestructura como código con Terraform"

+++
Esta ocasión quiero hablar sobre qué es la Infraestructura como código y cómo empezar a usarla con Terraform. **Terraform** es un software de código libre que permite a partir de un lenguaje de alto nivel crear el plan de construcción de una infraestructura compleja, esto sería Infrastructura como código (Infrastructure as Code).

## ¿Que la infrastructura cómo código?

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

Referencias:

*  [https://terraform-infraestructura.readthedocs.io/es/latest/caracteristicas/index.html](https://terraform-infraestructura.readthedocs.io/es/latest/caracteristicas/index.html "https://terraform-infraestructura.readthedocs.io/es/latest/caracteristicas/index.html")
* [https://www.terraform.io/intro/index.html](https://www.terraform.io/intro/index.html "https://www.terraform.io/intro/index.html")
* [https://learn.hashicorp.com/terraform/getting-started/install](https://learn.hashicorp.com/terraform/getting-started/install "https://learn.hashicorp.com/terraform/getting-started/install")