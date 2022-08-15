+++
comments = "true"
date = 2022-08-15T14:00:00Z
image = "/uploads/openinfradaysmexico.png"
tags = ["cloud", "best practices", "terraform", "aws", "vagrant"]
title = "Como implementar un Cloud ToolChain - OpenInfraDays México 2022"

+++
Tuve la oportunidad de presentar una charla en el marco del OpenInfraDays México 2022, un evento online que tiene como fin conocer como se estan resolviendo retos de diferentes industrias utilizando tecnologías Opensource para la infraestructura en la nube.

## Abstract

Hoy la infraestructura de TI debe ser una ventaja competitiva; ya que determina lo que el negocio es o no es capaz de hacer y lo que es más importante, cuándo puede hacerlo. En el mercado actual, encontrará términos como DevOps, SRE, IaC y CloudOps, aunque son términos diferentes, todos se enfocan en administrar la entrega, el ajuste, la optimización y el rendimiento de las cargas de trabajo y los servicios de TI que se ejecutan en entornos de nube.

En esta charla, compartiré algunas lecciones aprendidas sobre las mejores prácticas y herramientas para lograrlo. Hablaremos sobre Infraestructura como código con terraform y packer, así como herramientas de automatización como cloud-init y ansible y la importancia de las herramientas GitOps y los flujos de trabajo de CI/CD en la gestión del SDLC en el mercado actual.

* Esta sesión tuvo lugar en vivo el Lunes 15 de Agosto en el marco del OpenInfraDays México: [https://openinfradays.mx/](https://openinfradays.mx/ "https://openinfradays.mx/")
* La grabación de la sesión está disponible [en Youtube](https://www.youtube.com/channel/UCpB__-WAEyHdvKAK0Y15akQ).
* Puedes descargar las slides de la sesión desde [aquí](https://github.com/galvarado/devops-toolchain/blob/main/assets/slides.pdf).
* Todo el código está disponible en Githuib en el siguiente enlace: [https://github.com/galvarado/devops-toolchain](https://github.com/galvarado/devops-toolchain "https://github.com/galvarado/devops-toolchain")

## Demo

Al final de la sesión hay un demo donde integramos circleci con terraform y packer para construir imagenes y crear infraestructura en AWS usando el concepto de GitOps (además de enviar notificaciones a Slack).

El siguiente diagrama ilustra la integración de las distintas herramientas:

![](/uploads/cloudtoolchaindemo.png)

Como se observa la interacción es:

* Desde Github gatillamos las acciones de CircleCI.
* CircleCI gestiona los pipelines de contrucción de imagenes y despliegue de infraestructura.
* Packer construye una imagen baasda en Ubuntu 22.04
* Terraform toma la imagen creada por Packer y  despliega una instancia de EC2.
* Ansible puede gestionar la instancia vía SSH
* Todas las acciones son notificadas vía slack

## GitOps

En esencia, seguimos GitOps basados en las plantilla de packer y terraform (infraestructura basada en código) y  usamos Github como  la única fuente de verdad y mecanismo de control para crear, actualizar y eliminar la arquitectura del sistema mediante Pull Requests.

Configuramos el branch main como un branch protegido. Todos los commits deben realizarse en una rama no protegida y enviarse a través de un PR antes de que puedan fusionarse

Adicionalmente requerimos verificaciones de estado como prerequisitos antes de poder hacer la  fusión del PR asi que establecemos que se debe pasar un terraform plan en CircleCI como mandatorio para poder fusionar.

1\. Para realizar un cambio en la infraestructura, debemos hacer un PR con los cambios:

![](/uploads/pr1.png)

2\. CircleCI se gatilla y ejecuta el worflow _terraform plan_. Cuando finaliza, reporta el estado a Github.

![](/uploads/plan.png)

3\. Si el check es satisfactorio, se aprueba y fusiona el branch.

![](/uploads/pr2.png)

4\. Una vez aprobada y fusionada el PR, CircleIC gatilla el workflow _teraform apply,_ así que se reconfigurará y sincronizará automáticamente la infraestructura en vivo con el estado del repositorio.

Git es una herramienta de misión crítica para el desarrollo de software que permite flujos de trabajo de solicitud de incorporación o Pull Requests y revisión de código. Las solicitudes promueven la visibilidad de los cambios entrantes en una base de código y fomentan la comunicación, el debate y la revisión de los cambios.

Estas, son una característica fundamental en el desarrollo de software colaborativo y cambiaron la forma en que los equipos y las empresas crean software ya que aportan transparencia a un proceso que antes era opaco.  Trabajar en este flujo  permite la evolución de los procesos DevOps hacia el desarrollo de software. 

Todo el código está disponible en Github en el siguiente enlace: [https://github.com/galvarado/devops-toolchain](https://github.com/galvarado/devops-toolchain "https://github.com/galvarado/devops-toolchain")

Si tienes dudas, no dudes en escribirme.

Si te resulta úlil, por favor comaparte! =)