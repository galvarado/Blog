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

[https://github.com/kubernetes/kops](https://github.com/kubernetes/kops "https://github.com/kubernetes/kops")

[https://github.com/kubernetes-sigs/kubespray](https://github.com/kubernetes-sigs/kubespray "https://github.com/kubernetes-sigs/kubespray")

[https://github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm "https://github.com/kubernetes/kubeadm")

## Realizar una instalación "Self hosting" de  Kubernetes

[https://github.com/kubernetes-incubator/bootkube](https://github.com/kubernetes-incubator/bootkube "https://github.com/kubernetes-incubator/bootkube")