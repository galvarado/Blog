+++
comments = "true"
date = 2023-03-01T17:00:00Z
draft = true
image = "/uploads/cicdpackeraws.png"
tags = ["devops", "aws"]
title = "Reemplazar instancias de EC2 sin downtime con CircleCI y Packer"

+++
Esta ocasión quiero compartir como lograr un enfoque de de infraestructura inmutable muy sencillo con instancias de EC2 en AWS usando [CircleCI](https://circleci.com/) para orquestar el flujo CI/CD y Packer para construir las nuevas imagenes.

Estaremos resolviendo dos desafíos. El primero es ¿Cómo crear una pipeline de CI/CD para [Hashicorp Packer](https://www.packer.io/)? y el segundo es ¿Cómo actualizar automáticamente las instancias de EC2 con esta nueva imagen sin ningún tiempo de inactividad o downtime?

Este enfoque es  muy útil para liberar nuevas versiones de aplicaciones que están desplegadas en instancias de EC2.  Esta estrategia  significa reemplazar la o las  instancias EC2 para actualizar la aplicación o la configuración en lugar de implementar los cambios en instancias  que ya se están ejecutando.

Para logar esto haremos uso de los Auto Scaling Groups, estos ayudan a mantener la disponibilidad de las aplicaciones a través de un amplio conjunto de funciones:

* Integración en Elastic Load Balancing
* Reemplazo automático de instancias en mal estado
* Escalamiento horizontal de instancias
* Agregar/Eliminar de forma dinámica instancias

Si quieres saber  más sobre las ventajas de Packer [en este post](https://galvarado.com.mx/post/packer-automatiza-la-creacion-de-cualquier-tipo-de-imagen-de-maquina-virtual/) escribí al respecto y también sobre el concepto de  [infraestructura inmutable.](https://galvarado.com.mx/post/beneficios-retos-y-como-lograr-infraestructura-inmutable-con-packer-ansible-y-terraform/)  Además te sugiero dar una lectura a [este tutorial](https://docs.aws.amazon.com/autoscaling/ec2/userguide/get-started-with-ec2-auto-scaling.html) sobre los ASG si quieres profundizar en el tema.

## Diseño de la solución

Aquí hay una descripción general de lo que contiene la solución y cómo funciona:

* Un grupo de EC2 Auto Scaling con dos instancias en ejecución, creado con Terraform.
* Una Pipeline de CircleCI  que orquesta el flujo:
  * Construye una nueva AMI usando Packer.
  * Crea una nueva nueva versión de la plantilla de lanzamiento (launch template) indicando la nueva imagen.
  * Activa un instance-refresh en el ASG para que se realicé un _rolling update_ de las instancias.

El ASG debe estar configurado con LaunchTemplateVersion = $Latest, para que cada nueva instancia que se lanza mediante el proceso _instance Refresh_ use la  última AMI construida.

Podemos ver el flujo de la automatización en el siguiente diagrama.

Referencias:

* [https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html "https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html")
* [https://aws.amazon.com/es/blogs/compute/introducing-instance-refresh-for-ec2-auto-scaling/](https://aws.amazon.com/es/blogs/compute/introducing-instance-refresh-for-ec2-auto-scaling/ "https://aws.amazon.com/es/blogs/compute/introducing-instance-refresh-for-ec2-auto-scaling/")