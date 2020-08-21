+++
comments = "true"
date = 2020-08-20T14:00:00Z
image = "/uploads/vagrantkindkubernetes.png"
tags = ["devops", "cloud", "containers", "CloudOps"]
title = "Crear un entorno DevOps de kubernetes local fácil y rápido: Vagrant + Kind"

+++
Kubernetes es una plataforma  para administrar clústers de contenedores, escrita originalmente por Google y disponible como open source.  Como desarrolladores, es muy importante aprender a desarrollar aplicaciones listas para desplegarse en  Kubernetes, ya que es una herramienta muy potente para desplegar  aplicaciones en producción y que  se está convertiendo en el líder del mercado. Si eres Sysadmin o DevOps, también te interesa tener un cluster para desplegar aplicaciones, crear  pipelines de CI/CD o integrar herramientas como Helm o Spinnaker. Hay un universo de posibilidades.

Como la mayoría del software  para crear un cluster, Kubernetes  puede ser un desafío.  Entonces en este tutorial usaremos Vagrant y Kind para crear un entorno  de trabajo independiente y  replicable de un cluster  de kubernetes en nuestra laptop.

## Vagrant

Vagrant es una herramienta de [Hashicorp](https://www.hashicorp.com/) para crear y configurar entornos de desarrollo virtualizados. Originalmente se desarrolló para VirtualBox, sin embargo desde la versión 1.1 Vagrant es capaz de trabajar con múltiples [proveedores](https://www.vagrantup.com/docs/providers).

Con un flujo de trabajo fácil de usar y un enfoque en la automatización, Vagrant reduce el tiempo de configuración del entorno de desarrollo, aumenta la paridad de producción y hace que los "En mi máquina funciona" sean una cosa del pasado.

#### **¿Por qué Vagrant?**

Vagrant proporciona entornos de trabajo fáciles de configurar, reproducibles y portátiles construidos sobre  tecnología estándar y controlados por un único flujo de trabajo  para ayudar a maximizar la productividad y flexibilidad de todo el equipo.

Para lograr su magia, Vagrant se para sobre los hombros de gigantes. Las máquinas se aprovisionan sobre un hypervisor como VirtualBox, Hyper-V,  VMware o KVM.  Vagrant puede configurar automáticamente carpetas compartidas, conexiones SSH, crear túneles HTTP en nuestro entorno de desarrollo, y mucho más. [Más información en su sitio oficial.](https://www.vagrantup.com/)

**Comandos útiles:**

* `vagrant init`: Crea una nueva instancia de VM. Cada instancia tiene un directorio oculto (`.vagrant` ) y un archivo de configuración ( `Vagrantfile`).
* `vagrant up`: Inicia la VM con  todas las configuraciones presentes el archivo `Vagrantfile` .
* `vagrant ssh`: Acceder a la instancia de VM por secure shell.
* `vagrant halt`: Detiene la instancia de virtualización.
* `vagrant destroy`: Elimina la instancia y todas sus configuraciones, excepto el archivo de configuración `Vagrantfile`.

La forma más fácil de encontrar "boxes" es buscar en el [catálogo público de  Vagrant](https://app.vagrantup.com/boxes/search) una caja que coincida con nuestro caso de uso. El catálogo contiene la mayoría de los principales sistemas operativos como bases, así como cajas especializadas para que podamos comenzar a trabajar rápidamente con stacks  LAMP, Ruby, Python, MySQL o entornos más complejos.

Estos Boxes del catálogo público funcionan con muchos proveedores diferentes. Ya sea que usemos  Vagrant con VirtualBox, VMware, AWS, etc., deberíamos poder encontrar la que necesitamos o podemos contruir la propia desde un Sistema Operativo base. Este último enfoque es el que seguiremos.

Agregar una box del catálogo es muy fácil. Cada una muestra instrucciones sobre cómo agregarla, pero todas siguen el mismo formato:

    $ vagrant box add USER/BOX

Por ejemplo:

    $ vagrant box add hashicorp/bionic64

Con esto estamos agregando la [box oficial de Hashicorp de  Ubuntu 16.04.](https://app.vagrantup.com/hashicorp/boxes/bionic64) En este momento es descargada la imagen y una vez finalizada la descarga, tendremos un archivo Vagrantfile. Este lo podemos modificar para lograr personalizaciones. Más información en [la documentación oficial.](https://www.vagrantup.com/docs/vagrantfile)

Creamos nuestra VM con:

    $ vagrant up

Y accedemos a nuestro entorno con:

    $ vagrant ssh

Ya tenemos un sistema independiente, a partir de este punto podemos instalar el software que queramos usar. Podemos agregar un [provisioner](https://www.vagrantup.com/docs/provisioning) para que se instale esto mediante scripts. Esto lo veremos más adelante.  En cualquier momento podremos destruir la imagen y mediante el provisioner, todo el software se volverá a instalar obteniendo así un entorno repetible y predecible.

NOTA: Antes de ejecutar estos pasos debes tener instalado Vagrant y Virtualbox. Las indicaciones están más adelante.

## Kind

Kind, que significa "**K**ubernetes **In D**ocker" es una herramienta para ejecutar clústers de Kubernetes locales utilizando Docker. Es decir, usa contenedores de Docker para simular nodos de kubernetes.

Se diseñó principalmente para probar Kubernetes en sí, pero también para desarrollo local o CI/CD. Kind hace que ejecutar kubernetes en docker se vea y se sienta tan fácil y simple como esperaríamos que fuera. Su enfoque es la velocidad y la simplicidad para optimizar la experiencia del los desarrolladores. La ventaja de kind es la posibilidad de crear rápidamente un clúster de kubernetes hermético, desechable y predecible bajo demanda.

#### **Características**

* Kind admite clústers de múltiples nodos (incluido HA)
* Soporte para make/bash/docker, o bazel, además de compilaciones publicadas previamente
* Es compatible con Linux, macOS y Windows.

Un punto muy importante, Kind es un instalador de Kubernetes certificado por CNCF. (minikube no lo es).

![](/uploads/kindcncf.png)

Ver: [Platform - Certified Kubernetes - Installer](https://landscape.cncf.io/category=certified-kubernetes-installer&format=card-mode&grouping=category&selected=kind)

Kind es lo más parecido a un clúster real de k8s que encontrarás. Podemos ejecutar un cluster de 4 nodos: 1 maestro + 3 workers. Minikube nos limita a 1 solo nodo y entonces no podemos probar escenarios de HA.

La instalación de Kind es muy sencilla, es un ejecutable en go por tanto solo falta descargarlo y darle permisos de ejecución:

    curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.8.1/kind-linux-amd64
    chmod +x ./kind
    mv ./kind /some-dir-in-your-PATH/kind

Para crear un cluster con Kind:

    kind create cluster # Default cluster context name is `kind`.

Pero también podemos definir el cluster en un archivo y crearlo como usualmente creamos recursos en k8s:

    kind: Cluster
    apiVersion: kind.x-k8s.io/v1alpha4
    # One control plane node and three "workers".
    #
    # While these will not add more real compute capacity and
    # have limited isolation, this can be useful for testing
    # rolling updates etc.
    #
    # The API-server and other control plane components will be
    # on the control-plane node.
    #
    # You probably don't need this unless you are testing Kubernetes itself.
    nodes:
    - role: control-plane
    - role: worker
    - role: worker
    - role: worker

## ¿Qué resolvemos con Vagrant y Kind?

El enfoque que estoy siguiendo es elegir herramientas que me permitan tener un ambiente homogeneo, capaz de ser automatizado y replicable fácilmente. Si bien podemos instalar directamente [minikube](https://galvarado.com.mx/post/6-herramientas-para-desplegar-un-cluster-de-kubernetes/) en nuestra laptop, esto nos limita en personalización pues minikube crea la VM por nosotros y se vuelve un artifact que no podemos replicar con el resto del equipo.

**Usar Kind con Vagrant  nos permite crear un entorno estandarizado para compartirlo con el resto de nuestro equipo.**

Como hemos venido mencionado Vagrant sirve para ayudarnos a crear y configurar máquinas virtuales con determinadas características y componentes. La gran ventaja de Vagrant es que posee un archivo de configuración, el  [Vagrantfile](https://www.vagrantup.com/docs/vagrantfile/) donde se centraliza toda la configuración de la VM que creamos.  Esto conlleva un  enfoque de automatización pues estos archivos pueden ser versionados, por lo tanto nos bastaría compartir nuestro archivo  en un repositorio de git y cualquiera que tenga instalado  Vagrant usará el Vagrantfile para crear una VM exactamente igual cuantas veces quiera, está maquina tendrá todo el software preinstalado lista para usarse. Cuando realicemos cambios, podremos compartirlos con los demás vía el repositorio.

Otra funcionalidad de Vagrant son  las carpetas sincronizadas. Estas  permiten a Vagrant sincronizar una carpeta en la máquina host con la máquina guest, lo que le permite continuar trabajando en los archivos del  proyecto en la máquina host, pero usar los recursos en la máquina guest para  ejecutar el proyecto.

De forma predeterminada, Vagrant compartirá el directorio del proyecto (el directorio con el Vagrantfile) con el guest en `/vagrant`. En este escenario podremos tener el respositorio del código de la app en nuestro host sincronizado en `/vagrant` y podremos desplegarla en nuestro entorno de k8s.

Entonces, al combinar Vagrant con Kind, no instalamos software en nuestra laptop y logramos abstraer cada una de las capas. Kind se encargará de ejecutar kubernetes en un solo nodo, nuestra Vagrant box, además podremos instalar otros componentes como Helm o algún ingress controller.

El enfoque DevOps de Kind es:

* **Personalizaciones a través de un archivo de configuración declarativo:** Puedo definir un config.yaml que describa cómo se ve mi clúster de k8s  (por ejemplo, 1 maestro, 3workers).
* **Clústers de múltiples nodos:** Para probar la resistencia de mi aplicación a medida que presento diferentes escenarios de falla. Los multiples nodos son contenedores dentro de una sola VM.
* **Portabilidad**: Puedo compartir el archivo de configuración tanto de Vagrant como de Kind con el resto del equipo.
* **Flujo de trabajo amigable para los desarrolladores:** La posibilidad de crear clústers con la misma configuración en los pipelines de de CI que los de producción.

Entonces, cada ocasión que necesites interactuar con un cluster real de kubernetes, solo tendrás que ejecutar:

    $ vagrant up

## Manos a la obra

Todo lo necesario para ejecutar el entorno [está disponible en este repositorio.](https://github.com/galvarado/vagrant-box-bionic64-kind)

#### Instalar Vagrant

Para instalar Vagrant, descargamos [el paquete que nos corresponde](https://www.vagrantup.com/downloads). Vagrant está empaquetado para los sistemas en especifico:

* MAC OS X
* WINDOWS
* LINUX
* DEBIAN
* CENTOS

El instalador agregará automáticamente Vagrant a la ruta del sistema para que esté disponible en la terminal.

**Verificar la instalación**

Después de instalar Vagrant, verificamos que la instalación funcionó  en la consola:

    $ vagrant -v
    Vagrant 2.2.9

#### Instalar Virtualbox

Los providers en Vagrant son los hipervisores  capaces de virtualizar, en nuestro caso instalaremos VirtualBox. Vamos [a la página de descarga](https://www.virtualbox.org/wiki/Downloads) y elegimos el paquete para nuestro sistema. Las versiones de VirtualBox compatibles con Vagrant están [ en la documentación oficial](https://www.vagrantup.com/docs/providers/virtualbox).

#### Crear Vagrant box

Basada en la imagen de hashicorp/bionic64:

Creamos un directorio:

    $ mkdir vagrant-box-bionic64-kind

Agregamos el box que usaremos como base:

    $ vagrant box add hashicorp/bionic64

Modificamos el archivo Vagrantfile y colocamos las siguientes configuraciones:

    Vagrant.configure("2") do |config|
      # The most common configuration options are documented and commented below.
      # For a complete reference, please see the online documentation at
      # https://docs.vagrantup.com
      # Every Vagrant development environment requires a box. You can search for
      # boxes at https://vagrantcloud.com/search.
      config.vm.box = "hashicorp/bionic64"
      config.vm.network "private_network", ip: "192.168.50.4"
      config.vm.hostname = "myk8s"
      config.vm.provision :shell, path: "bootstrap.sh"
      config.vm.provision :shell, path: "kind_cluster_with_localregistry.sh"
      config.vm.provider "virtualbox" do |v|
        v.memory = 4096
        v.cpus = 2
        v.name = "myk8s"
      end

#### Script bootstrap

Ya tenemos una imagen de Ubuntu, pero necesitamos instalar el software que requerimos, en este caso Docker, kubectl y kind.

Creamos un archivo en bash:

    #!/bin/bash
    
    # Install docker
    sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io 
    usermod -aG docker vagrant
    sudo docker run hello-world
    echo "**** End installing Docker CE"
    
    # Install kubectl
    sudo apt-get update && sudo apt-get install -y apt-transport-https
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
    sudo apt-get update
    sudo apt-get install -y kubectl 
    kubectl cluster-info
    echo "**** End installing kubectl"
    
    # Install kind
    curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.8.1/kind-linux-amd64
    chmod +x ./kind
    mv ./kind /usr/local/bin/kind
    
    # Initialize kind
    kind create cluster --name myk8s 
    kind get clusters
    mkdir .kube
    kind get kubeconfig --name "myk8s" > .kube/config
    echo "**** Cluster started :) Ready to shine!"

Este script está basado en la documentación oficial para instalar [docker](https://docs.docker.com/engine/install/ubuntu/), [kubectl](https://kubernetes.io/es/docs/tasks/tools/install-kubectl/) y [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Colocamos este archivo en el mismo directorio que el Vagrantfile. En este último archivo, estamos indicando nuestro archivo bootstrap de la siguiente manera:

    config.vm.provision :shell, path: "bootstrap.sh"

Entonces cuando la VM se cree, se ejecutará este script que instala lo necesario para que kind pueda crear por nosotros un cluster de kubernetes.

#### Script create kind cluster

El siguiente script tiene las definiciones para que kind cree un cluster y un docker registry local. Basado en [la documentación oficial de kind](https://kind.sigs.k8s.io/docs/user/local-registry/).

Creamos un archivo en bash:

    #!/bin/sh
    set -o errexit
    
    # create registry container unless it already exists
    reg_name='kind-registry'
    reg_port='5000'
    running="$(docker inspect -f '{{.State.Running}}' "${reg_name}" 2>/dev/null || true)"
    if [ "${running}" != 'true' ]; then
      docker run \
        -d --restart=always -p "${reg_port}:5000" --name "${reg_name}" \
        registry:2
    fi
    
    # create a cluster with the local registry enabled in containerd
    cat <<EOF | kind create cluster --config=-
    kind: Cluster
    apiVersion: kind.x-k8s.io/v1alpha4
    containerdConfigPatches:
    - |-
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:${reg_port}"]
        endpoint = ["http://${reg_name}:${reg_port}"]
    EOF
    
    # connect the registry to the cluster network
    docker network connect "kind" "${reg_name}"
    
    # tell https://tilt.dev to use the registry
    # https://docs.tilt.dev/choosing_clusters.html#discovering-the-registry
    for node in $(kind get nodes); do
      kubectl annotate node "${node}" "kind.x-k8s.io/registry=localhost:${reg_port}";
    done
    
    # Initialize kind
    kind get clusters
    mkdir .kube
    kind get kubeconfig > .kube/config
    
    echo "**** Cluster started :) Ready to shine!"

Colocamos este archivo en el mismo directorio que el Vagrantfile. En este último archivo, estamos indicando nuestro archivo bootstrap de la siguiente manera:

    config.vm.provision :shell, path: "kind_cluster_with_localregistry.sh"

Entonces cuando la VM se cree, se ejecutará este script que instala lo necesario para que kind pueda crear por nosotros un cluster de kubernetes.

#### Vagrant Up!

Vamos a levantar el entorno con:

    $ vagrant up

Una vez finalizado entramos con:

    $ vagrant ssh

Y verificamos nuestro cluster con kubectl:

    $ kubectl cluster-info
    Kubernetes master is running at https://127.0.0.1:46157
    KubeDNS is running at https://127.0.0.1:46157/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    
    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

Podemos listar los contenedores dentro de nuestra VM y veremos el nodo de k8s, en este caso es uno solo pero podríamos crear una topología más compleja para tener un cluster  más cercano a producción. Dentro de este contenedor se está ejecutando todo un cluster de k8s con el que podemos interactuar. También podemos ver el contenedor del registro local:

    $ docker ps
    CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
    5f0d100a5f0c        kindest/node:v1.18.2   "/usr/local/bin/entr…"   24 minutes ago      Up 23 minutes       127.0.0.1:40899->6443/tcp   kind-control-plane
    036174b1e88a        registry:2             "/entrypoint.sh /etc…"   25 minutes ago      Up 25 minutes       0.0.0.0:5000->5000/tcp      kind-registry

#### Repositorio en Github

Todo lo necesario para ejecutar el entorno [está disponible en este repositorio.](https://github.com/galvarado/vagrant-box-bionic64-kind)  En el repositorio también encontrarás el directorio nginx-app-example que contiene un Dockerfile y  los manifest de kubernetes para desplegar una aplicación basada en nginx.

Ahora sí, vamos a desplegar una aplicación en nuestro nuevo entorno.

#### Desplegar una aplicación sobre nuestro clúster

Si clonaste el  repositorio, entonces  el directorio `/vagrant` dentro de la VM contiene los manifests de kubernetes, dentro del directorio  `nginx-app-example` Si no los tienes, tómalos del repositorio y  colócalos en el mismo directorio donde tienes el archivo Vagrantfile y los podrás ver dentro de la VM.

Construiremos una imagen y desplegaremos una aplicación en nuestro Kubernetes:

Dockerfile:

    FROM nginx
    COPY landing /usr/share/nginx/html

Construir imagen:

    $ docker build -t nginx-app-example:latest .

Taggeamos a imagen y hacemos push para subirla al docker registry local:

    $ docker tag nginx-app-example:latest localhost:5000/nginx-app-example:latest
    $ docker push localhost:5000/nginx-app-example:latest
    The push refers to repository [localhost:5000/nginx-app-example]
    d2aca6f889f3: Pushed 
    550333325e31: Pushed 
    22ea89b1a816: Pushed 
    a4d893caa5c9: Pushed 
    0338db614b95: Pushed 
    d0f104dc0a1f: Pushed 
    latest: digest: sha256:bf7556c6be09126a4219cc9b2b7caac91d53f03b666e5f25e1ae4ab2ee9e9080 size: 1571

Crear namespace:

    $ kubectl create -f nginx-namespace.yml 
    namespace/nginx-app-example created

Crear deployment:

    kubectl create -f nginx-deployment.yml 
    deployment.apps/nginx-deployment created
    
    $ kubectl get pods -n nginx-app-example
    
    NAME                                READY   STATUS    RESTARTS   AGE
    
    nginx-deployment-8469fcbd4f-9cvsk   1/1     Running   0          9s
    
    nginx-deployment-8469fcbd4f-twczg   1/1     Running   0          9s

Crear servicio:

    $ kubectl create -f nginx-service.yml
    service/nginx-service created

Crear ingress:

    kubectl create -f nginx-ingress.yml 

    ingress.networking.k8s.io/nginx-ingress created

Revisamos los recursos creados:

    NAME                                    READY   STATUS    RESTARTS   AGE
    pod/nginx-deployment-8469fcbd4f-9cvsk   1/1     Running   0          6m24s
    pod/nginx-deployment-8469fcbd4f-twczg   1/1     Running   0          6m24s
    
    NAME                    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
    service/nginx-service   NodePort   10.111.22.182   <none>        80:31480/TCP   62s
    NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/nginx-deployment   2/2     2            2           6m24s
    
    NAME                                          DESIRED   CURRENT   READY   AGE
    replicaset.apps/nginx-deployment-8469fcbd4f   2         2         2       6m24s

Si tienes dudas o comentarios no dejes de escribirme.

Si te pareció útil, por favor comparte =)

Referencias:

[https://learn.hashicorp.com/collections/vagrant/getting-started](https://learn.hashicorp.com/collections/vagrant/getting-started "https://learn.hashicorp.com/collections/vagrant/getting-started")

[https://kind.sigs.k8s.io/](https://kind.sigs.k8s.io/ "https://kind.sigs.k8s.io/")