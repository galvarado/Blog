+++
comments = "true"
date = 2022-12-02T17:00:00Z
draft = true
image = "/uploads/cicdpackerawsec2.png"
tags = ["devops", "aws"]
title = "Reemplazar instancias de EC2 sin downtime con CircleCI y Packer"

+++

Esta ocasión quiero compartir como lograr un enfoque de de infraestructura inmutable muy sencillo con instancias de EC2 en AWS usando [CircleCI](https://circleci.com/) para orquestar el flujo CI/CD y Packer para construir las nuevas imagenes.

Entonces en este post estaremos resolviendo dos desafíos. El primero es ¿Cómo crear una canalización de CI/CD para [Hashicorp Packer](https://www.packer.io/)? y el segundo es ¿Cómo actualizar automáticamente las instancias de EC2 con esta nueva imagen sin ningún tiempo de inactividad o downtime?

Este enfoque es  muy útil para liberar nuevas versiones de aplicaciones que están desplegadas en instancias de EC2.  Esta estratefia  significa reemplazar la/las  instancias EC2 para actualizar la aplicación o la configuración en lugar de implementar los cambios en instancias EC2 que ya se están ejecutando. En este post hablé sobre [las ventajas de Packer](https://galvarado.com.mx/post/packer-automatiza-la-creacion-de-cualquier-tipo-de-imagen-de-maquina-virtual/) y en este otro de todo el concepto de  [infraestructura inmutable.](https://galvarado.com.mx/post/beneficios-retos-y-como-lograr-infraestructura-inmutable-con-packer-ansible-y-terraform/)

[https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html](https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html "https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html")

[https://aws.amazon.com/es/blogs/compute/introducing-instance-refresh-for-ec2-auto-scaling/](https://aws.amazon.com/es/blogs/compute/introducing-instance-refresh-for-ec2-auto-scaling/ "https://aws.amazon.com/es/blogs/compute/introducing-instance-refresh-for-ec2-auto-scaling/")