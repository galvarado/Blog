+++
comments = "true"
date = 2020-08-20T14:00:00Z
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

Kind es lo más parecido a un clúster real que encontrarás. Podeos ejecutar un cluster de 4 nodos: 1 maestro + 3 workers. Minikube nos limita a 1 solo nodo y entonces no podemos probar escenarios de HA.

## ¿Qué resolvemos con Vagrant y Kind?

El enfoque que estoy siguiendo es elegir herramientas que me permitan tener un ambiente homogeneo, capaz de ser automatizado y replicable fácilmente. Si bien podemos instalar directamente minikube en nuestra laptop, esto nos limita en personalización pues minikube crea la VM por nosotros, esto nos limita en compartir personalizaciones con  los demás. 

Usar Kink con Vagrant  nos permite crear un entorno estandarizado para compartirlo con el resto de nuestro equipo.

Como hemos venido mencionado vagrant sirve para ayudarnos a crear y configurar máquinas virtuales con determinadas características y componentes. La gran ventaja de Vagrant es que posee un archivo de configuración, el  [Vagrantfile](https://www.vagrantup.com/docs/vagrantfile/) donde se centraliza toda la configuración de la VM que creamos.  Esto conlleva un  enfoque de automatización pues estos archivos pueden ser versionados, por lo tanto nos bastaría compartir nuestro archivo  en un repositorio de git y cualquiera que tenga instgalado  vagrant usará el vagrantfile para crear una VM exactamente igual cuantas veces quiera, está maquina tendrá todo el software preinstalado lista para usarse.

Al combinarse con Kind, no instalamos software en nuestra laptop y logramos abstraer cada una de las capas. Kind se encargará de ejecutar kubernetes en un solo nodo, nuestra Vagrant box

Una característica que me gusta mucho es la capacidad de cargar mis imágenes locales directamente en el clúster. Esto me ahorra algunos pasos adicionales de configurar un registro y hacer push de mi imagen cada vez que quiero probar mis cambios. Con un  simple:

    load docker-image my-app:latest

La imagen ya está disponible para su uso en mi clúster. 

El enfoque DevOps de Kind es:

* **Personalizaciones a través de un archivo de configuración declarativo:** puedo definir un config.yaml que describa cómo se ve mi clúster de k8s  (por ejemplo, 1 maestro, 3workers).


* **Clústers de múltiples nodos:** para probar la resistencia de mi aplicación a medida que presento diferentes escenarios de falla. Los multiples nodos son contenedores dentro de una sola VM.


* **Portabilidad**: puedo compartir el archivo de configuración tanto de Vagrant como de Kind con el resto del equipo.


* **Flujo de trabajo amigable para los desarrolladores:** La posibilidad de crear clústeres con la misma configuración en los pipelnes de de CI que los de producción.

Entonces, cada ocasión que necesites interactuar con un cluster real de kubernetes, solo tendrás que ejecutar:

    $ vagrant up

## Manos a la obra

#### Instalar VirtualBox y Vagrant

#### Crear Vagrant box

#### Script de instalación de Minikube

## Desplegar una aplicación en nuestro kubernetes

## Repositorio en Github

Todo lo que estuvimos ejecutando está disponible en este repositorio.

Si te pareció útil, por favor comparte.

Referencias: