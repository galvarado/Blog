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

Los equipos ahora  pueden implementar o actualizar una infraestructura formada por docenas de servidores en cuestión de minutos sin necesidad de instalar nada. Simplemente se activa el proceso que se ha escrito en el código y las máquinas hacen el trabajo. Si es necesario es posible retroceder a la última versión estable de la configuración del servidor haciendo que las pruebas d sean más sencillas.

## Gestión de configuración vs orquestación

Establecido lo que es la infrastructura cómo código, queda una importante aclaración que hacer ¿Entonces cual es la diferencia de usar Ansible o Chef para gestionar la configuración? 

Chef, Puppet, Ansible y SaltStack son herramientas de "gestión de configuración" lo que significa que están diseñadas para instalar y administrar software en **servidores** **existentes**.  

Terraform, CloudFormation, OpenStack Heat y otros, son "herramientas de orquestación" lo que significa que están diseñadas para aprovisionar los servidores, dejando el trabajo de configurar esos servidores para otras herramientas. 

Estas dos categorías no se excluyen, ya que la mayoría de las herramientas de gestión de configuración pueden realizar cierto grado de aprovisionamiento y la mayoría de las herramientas de orquestación pueden realizar cierto grado de gestión de configuración. Pero el enfoque en la gestión de la configuración o la orquestación significa que algunas de las herramientas se adaptarán mejor a ciertos tipos de tareas.

Ambas tareas, gestión de configuración y orquestación forman parte del ciclo de vida de las aplicaciones y la infraestructura en un equipo DevOps. Ambas son tareas de automatización, pero con enfoques distintos.

Una buena comparativa de estos puntos se encuentra un articulo en medium de [Yevgeniy Brikman](https://blog.gruntwork.io/@brikis98): [Why we use Terraform and not Chef, Puppet, Ansible, SaltStack, or CloudFormation](https://blog.gruntwork.io/why-we-use-terraform-and-not-chef-puppet-ansible-saltstack-or-cloudformation-7989dad2865c).

## Intrioducción a Terraform