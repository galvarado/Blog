+++
comments = "true"
date = "2019-07-12T05:00:00+00:00"
draft = true
image = "/uploads/6toolsk8s.png"
tags = ["devops", "cloud", "containers", "kubernetes"]
title = "6  herramientas para desplegar un cluster de kubernetes"

+++
Trabajando en tecnología ya seas desarrollor de software, DevOps o administración de sistemas, indudablemente has oído hablar de Kubernetes, pero como una herramienta poderosa, Kubernetes tiene bastante curva de aprendizaje. Todos estos roles están involucrados de alguna manera con Kubernetes pero no todos desde la misma perspectiva. El desarollador solo quiere comenzar a preparar sus aplicaciones para este ambiente sin conocer  a detalle una arquitectura de producción. Alguien que hace DevOps necesita un ambiente para crear pipelines de CI/CD y muchos otros si querrán conocer la arquitectura a detalle y comenzar a instalarlo para producción.

Como sabemos, Kubernetes o k8s, hace muchos de los procesos manuales involucrados en la implementación y escalabilidad de las aplicaciones en contenedores. En otras palabras, se puede crear un cluster de grupos de hosts que ejecutan contenedores y Kubernetes nos ayuda a administrar con facilidad y eficacia esos clusters

Estos clusteres pueden abarcar VMs en nubes públicas, privadas o híbridas. Por este motivo, Kubernetes es la plataforma ideal para alojar aplicaciones nativas de nube que requieren una expansión rápida.

Entonces, sea cual sea tu motivo para instalar kubernetes, te comparto una lista de herramientas para instalarlo según sea tu caso:

## Instalar un cluster de Kubernetes local con propósito  de desarrollo y prueba

Instalar un custer en la nube puede ser que sea muy costoso para simplemente propósitos de desarrollo, académicos o dar tus primeros pasos. Entonces la solución pasa por poder ejecutar Kubernetes de forma local.

#### 1. Minikube

Minikube es una herramienta que facilita la ejecución local de Kubernetes, ejecuta un cluster de Kubernetes de un solo nodo dentro de una Máquina Virtual  (por ejemplo, Virtualbox) en nuestro entorno de desarrollo local, es decir, en nuestra laptop. Está orientado a los desarrolladores que buscan probar Kubernetes o desarrollar aplicaciones para Kubernetes.

Para instalar Minikube, debemos asegurarnos de que ya tenemos un hipervisor instalado en nuestro sistema para poder ejecutar máquinas virtuales.  Para la mayoría de las personas, VirtualBox es sificiente además es gratuito y lo podremos usar con Minikube.

Una vez que haya instalado un hipervisor, estamos listos para instalar Minikube. Asumiré que estás usando una estación de trabajo basada en Unix, pero es completamente posible usar Minikube desde Windows.

Como ejemplo en fedora, instalamos el cliente de linea de comandos de minkube:

    $ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && \
      chmod +x minikube && \
      mv minikube /usr/local/bin/

Ahora, el cliente de linea de comandos kubectl:

    $ curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/ amd64 / kubectl && \ chmod + x kubectl && \ mv kubectl / usr / local / bin /

Entonces, para levantar nuestro cluster con minikube, simplemente necesitamos ejecutar:

    minikube start

Te dejo el link de[ la documentación oficial de instalación]()

#### 2. Microk8s

Microk8s está certificado por [CNCF](https://www.cncf.io/) y es desarrollado por el equipo de Kubernetes en Canonical. Este se ejecuta completamente en nuestra laptop que a diferencia de Minikube no requiere de una máquina virtual sino que podemos instalarlo y ejecutar todos los servicios de Kubernetes  ejecutan de forma nativa .

Este aislamiento se logra al empaquetar todos los archivos binarios para Kubernetes, Docker, iptables y CNI en un solo paquete de snap. Snap es un contenedor de aplicaciones y funciona en Linux en cualquier distribución o versión. Para conocer más detalles de snap en [este link](https://snapcraft.io/) está la información oficial.

Microk8s se puede instalar como un solo comando de snap, directamente desde la tienda de Snap.

Primero, hay que instalar snap en nuestr distribución de linux, en fedora se puede hacer con dnf, en ubuntu con apt, incluso en Ubuntu 18.04 ya viene instalado.

Una vez instalado snap, instalamos microk8s:

    sudo snap install microk8s --classic

¿Y si no queremos que todo el tiempo se esté ejecutan microk8s?E n cualquier momento puedo pausar todos los servicios de Kubernetes que se estén ejecutando con:

    snap disable microk8s

[Aquí hay un tutorial completo de microk8s](https://tutorials.ubuntu.com/tutorial/install-a-local-kubernetes-with-microk8s#0) y [este es el sitio oifical](https://microk8s.io/), manos a la obra!

## Herramientas para desplegar Kubernetes para producción

#### 3. Kubeadm

Kubeadm es una herramienta que nos ayuda a iniciar clusters de Kubernetes siguiendo las mejores prácticas en la infraestructura existente. Su  principal ventaja es la capacidad de lanzar grupos de Kubernetes mínimos viables en cualquier lugar, es decir, realiza las acciones necesarias para que un cluster  sea mínimamente viable y funcione de manera fácil para el usuario.  Kubeadm automatiza bastantes pasos difíciles en la implementación de un clúster Kubernetes, incluida la emisión y coordinación de los certificados de seguridad de cada nodo, así como los permisos necesarios para el control de acceso basado en roles (RBAC).  

Kubeadm no puede proveer la infraestructura  y tampoco incluye instalación de addons y la configuración de red. Kubeadm se  pretende que sea un componente compositivo de herramientas de nivel superior.

Esta parece ser una buena opción para las instalaciones en baremetal de Kubernetes o como complemento a cualquier otra herramienta complementaria en una configuración manual.

Según los documentos oficiales, kubeadm se puede utilizar en los siguientes escenarios:

* Para probar Kubernetes por primera vez.
* Implementar un clúster  minimo para probar una aplicación
* Para ser explotado como un bloque de construcción en otros sistemas complejos

Comandos de Kubeadm comunes:

* **kubeadm init** para iniciar el nodo inicial del control plane de Kubernetes.
* **kubeadm** **join** usa para arrancar un nodo worker de Kubernetes o un nodo de control plane adicional  y unirlo al clúster.
* **kubeadm upgrade** para actualizar un clúster Kubernetes a una versión más nueva.
* **kubeadm reset** para revertir cualquier cambio realizado en un host por kubeadm init o kubeadm join.

Más detalles [se encuentran aquí](https://kubernetes.io/blog/2017/01/stronger-foundation-for-creating-and-managing-kubernetes-clusters/) y puedes seguir [este tutorial para instalar k8s con kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).

#### 4. Kops

Kops, abreviatura de Kubernetes Operations, es un conjunto de herramientas para instalar, operar y eliminar  clusters de Kubernetes en plataformas de nube. Kops [es un proyecto oficial de Kubernetes](https://github.com/kubernetes/kops).  

Las plataformas con las que es compatible es AWS, Google Cloud Platform, OpenStack, DigitalOCean y VMware vSphere en alpha, algunas otras plataformas están planeadas a futuro.

La mayor ventaja de kops es que hay muchas posibilidades de que se convierta en un método de instalación predeterminado en el futuro. Las características principales de la herramienta incluyen:

* Creación automatizada de infraestructura y despliegue de clusters.
* Soporte para características nativas de proveedores de nube.
* Soporte para actualizaciones y actualizaciones.

**¿Cuando elegir Kops ?** Kops está más estrechamente integrado con características únicas de las nubes que soporta, por lo que es la mejor opción si se usará una de estas plataformas de nube pública.

Una nota importante: kops usa kubeadm, pero no hay necesidad de elegir entre kops y kubeadm,  kubeadm está destinado a ser un componente básico que cualquier herramienta de instalación pueda aprovechar, en lugar de que cada instalador construya la misma funcionalidad de bajo nivel.  Además, kubeadmn no está pensado principalmente para usuarios finales, a menos que desee crear su propia herramienta de instalación.

Ahora los tutoriales, para[ instalar un cluster Kubernetes en AWS.](https://github.com/kubernetes/kops/blob/master/docs/aws.md) Para instalar un clúster [Kubernetes en GCE,](https://github.com/kubernetes/kops/blob/master/docs/tutorial/gce.md) y ara instalar un cluster [Kubernetes en DigitalOcean.](https://github.com/kubernetes/kops/blob/master/docs/tutorial/digitalocean.md)

#### 5. Kubespray

[https://github.com/kubernetes-sigs/kubespray](https://github.com/kubernetes-sigs/kubespray "https://github.com/kubernetes-sigs/kubespray")

[https://github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm "https://github.com/kubernetes/kubeadm")

## Realizar una instalación "Self hosting" de  Kubernetes

#### 6.Bootkube

[https://github.com/kubernetes-incubator/bootkube](https://github.com/kubernetes-incubator/bootkube "https://github.com/kubernetes-incubator/bootkube")

[https://tasdikrahman.me/2019/04/04/self-hosting-highly-available-kubernetes-cluster-aws-google-cloud-azure/](https://tasdikrahman.me/2019/04/04/self-hosting-highly-available-kubernetes-cluster-aws-google-cloud-azure/ "https://tasdikrahman.me/2019/04/04/self-hosting-highly-available-kubernetes-cluster-aws-google-cloud-azure/")