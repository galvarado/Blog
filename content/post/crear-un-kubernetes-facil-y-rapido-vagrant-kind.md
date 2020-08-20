+++
comments = "true"
date = 2020-08-21T05:00:00Z
draft = true
image = "/uploads/vagrantkindkubernetes.png"
tags = ["devops", "cloud", "containers", "CloudOps"]
title = "Crear un ambiente local de kubernetes fácil y rápido: Vagrant + Kind"

+++
Kubernetes es una plataforma  para administrar clústers de contenedores, escrita originalmente por Google y disponible como open source.  Como desarrolladores, es muy importante aprender a desarrollar aplicaciones listas para desplegarse en  Kubernetes, ya que es una herramienta muy potente para desplegar  aplicaciones en producción y que  se está convertiendo en el líder del mercado. Si eres Sysadmin o DevOps, también te interesa tener un cluster para desplegar aplicaciones, crear  pipelines de CI/CD o integrar herramientas como Helm o Spinnaker. Hay un universo de posibilidades.

Como la mayoría del software  para crear un cluster, Kubernetes  puede ser un desafío.  Entonces en este tutorial usaremos Vagrant y Kind para levantar un cluster  rápido y fácil en nuestra laptop y comenzar a  crear aplicaciones en k8s.

## Vagrant

Vagrant es una herramienta para crear y configurar entornos de desarrollo virtualizados. Originalmente se desarrolló para VirtualBox, sin embargo desde la versión 1.1 Vagrant es capaz de trabajar con múltiples proveedores, como VMware, Amazon EC2, LXC, etc.

Con un flujo de trabajo fácil de usar y un enfoque en la automatización, Vagrant reduce el tiempo de configuración del entorno de desarrollo, aumenta la paridad de producción y hace que los "En mi máquina funciona" sean una cosa del pasado.

#### **¿Por qué Vagrant?**

Vagrant proporciona entornos de trabajo fáciles de configurar, reproducibles y portátiles construidos sobre  tecnología estándar y controlados por un único flujo de trabajo  para ayudar a maximizar la productividad y flexibilidad de todo el equipo.

Para lograr su magia, Vagrant se para sobre los hombros de gigantes. Las máquinas se aprovisionan sobre un hypervisor como VirtualBox, VMware o KVM. Vagrant puede configurar automáticamente carpetas compartidas, las conexiones SSH, crear túneles HTTP en su entorno de desarrollo, y mucho más.

[Más información en su sitio oficial.](https://www.vagrantup.com/)

## Kind

Kind, que significa "**K**ubernetes **In D**ocker" es una herramienta para ejecutar clústers de Kubernetes locales utilizando Docker. Es decir, usa contenedores de Docker para simular nodos de kubernetes.

Se diseñó principalmente para probar Kubernetes en sí, pero ambién para desarrollo local o CI. Kind hace que ejecutar kubernetes en docker se vea y se sienta tan fácil y simple como esperaríamos que fuera. Su enfoque es la velocidad y la simplicidad para optimizar la experiencia del los desarrolladores. La ventaja de kind es la posibilidad de crear rápidamente un clúster de kubernetes hermético, desechable y predecible bajo demanda.

#### **Características**

* Kind admite clústers de múltiples nodos (incluido HA)
* Soporte para make/bash/docker, o bazel, además de compilaciones publicadas previamente
* Es compatible con Linux, macOS y Windows.

Un punto muy importante, Kind es un instalador de Kubernetes certificado por CNCF. (minikube no lo es).

![](/uploads/kindcncf.png)

Ver: [Platform - Certified Kubernetes - Installer](https://landscape.cncf.io/category=certified-kubernetes-installer&format=card-mode&grouping=category&selected=kind)

## ¿Qué resolvemos con Vagrant y Kind?

Si bien podemos instalar directamente minikube en nuestra laptop, combinarla con Vagrant nos permite crear un entorno estandarizado para compartirlo con el resto de nuestro equipo.

Como hemos venido mencionado vagrant sirve para ayudarnos a crear y configurar máquinas virtuales con determinadas características y componentes. La gran ventaja de vagrant es que posee un archivo de configuración, el  [Vagrantfile](https://www.vagrantup.com/docs/vagrantfile/) donde se centraliza toda la configuración de la VM que creamos.  Esto conlleva un  enfoque de automatización pues estos archivos pueden ser versionados, por lo tanto nos bastaría compartir nuestro archivo  en un repositorio de git y cualquiera que tenga instgalado  vagrant usará el vagrantfile para crear una VM exactamente igual cuantas veces quiera, está maquina tendrá todo el software preinstalado lista para usarse.

Al combinarse con Minikube, no instalamos software en nuestra laptop y logramos abstraer cada una de las capas. Minikube se encargará de ejecutar kubernetes en un solo nodo, nuestra Vagrant box.

**Kind Kind Kind Kind Kind Kind Kind**

Entonces, cada ocasión que necesites interactuar con un cluster real de kubernetes, solo tendrás que ejecutar:

    $ vagrant up

## Manos a la obra

#### Prerequisitos

Instalar VirtualBox y Vagrant

Crear Vagrant box

Script de instalación de Minikube

## Desplegar una aplicación en nuestro kubernetes

## Repositorio en Github

Todo lo que estuvimos ejecutando está disponible en este repositorio.

Si te pareció útil, por favor comparte.

Referencias: