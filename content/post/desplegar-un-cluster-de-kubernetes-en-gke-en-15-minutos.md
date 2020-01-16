+++
comments = "true"
date = 2019-11-08T13:00:00Z
image = "/uploads/KubernetesGoogleCloud.png"
tags = ["devops", "cloud", "containers", "GCP", "kubernetes"]
title = "Desplegar un cluster de Kubernetes en GKE en 15 minutos"

+++
Google Kubernetes Engine (GKE) proporciona un entorno administrado para implementar, administrar y escalar  aplicaciones en contenedores utilizando la infraestructura de Google. Cuando creamos un  entorno de  Kubernetes Engine este se forma de varias máquinas de instancias de Google Compute Engine.  En este post crearemos un cluster de k8s administrado en GKE e implementaremos una aplicación de prueba accediendo a ella en nuestro navegador.

## Kubernetes en Google Cloud Platform

GKE utiliza las instancias de Google Compute Engine como [nodos del clúster](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#nodes) y cada una se factura según los [precios de Compute Engine](https://cloud.google.com/compute/pricing). Las máquinas  las crea GKE  automáticamente cuando creamos un cluster. El precio que pagaremos será el tiempo que tengamos encendidas estas máquinas. No hay ninǵun otro costo asociado.

Cuando ejecutamos un clúster de Kubernetes Engine,  obtenemos  funciones avanzadas para la administración del clúster que ofrece Google Cloud Platform y que no obtenemos si desplegamos el cluster por nuestra cuenta por ejemplo instalando manualmente k8s en instancias de GCE.

Algunas de estas ventajas son:

* Balanceo de carga para instancias de Compute Engine.
* Grupos de nodos para designar subconjuntos de nodos dentro de un clúster para mayor flexibilidad.
* Escalado automático del número de instancias del clúster.
* Reparación automática de nodos para mantener la salud y disponibilidad del nodo.
* Logging y Monitoreo con Stackdriver para visibilidad.

## Preparar el despliegue de GKE

Para comenzar el despliegue accederemos a la consola de GCP en [https://console.cloud.google.com](https://console.cloud.google.com "https://console.cloud.google.com")

En la esquina superior derecha buscaremos el ícono para activar Cloud Shell.

![](/uploads/cloud shell.png)

**¿Qué es Cloud Shell?**

Google Cloud Shell  ofrece acceso a los recursos en la nube mediante la línea de comandos directamente desde el navegador. Para administrar fácilmente los proyectos y recursos sin tener que instalar  el [SDK de Google Cloud](https://cloud.google.com/sdk/) ni otras herramientas. Cloud Shell proporciona:

* Una instancia de máquina virtual de Compute Engine temporal que ejecuta un Sistema operativo Linux basado en Debian
* Acceso de línea de comandos a la instancia desde un navegador web utilizando ventanas de terminal en la consola de la plataforma en la nube
* 5 GB de almacenamiento en disco persistente por usuario, montado como su $ HOME
* Google Cloud SDK y otras herramientas preinstaladas

Toma unos minutos aprovisionar y conectarnos al entorno. Cuando estamos conectados, ya estamos autenticados y el proyecto está configurado en la variable PROJECT_ID. 

Se debería ver algo simiar a esto:

![](/uploads/Captura realizada el 2019-10-25 14.16.11.png)

Desde esta ventana ejecutaremos todos los comandos.

**gcloud**

gcloud es la herramienta de línea de comandos para Google Cloud Platform. Viene preinstalado en Cloud Shell. A continuacion una serie de comandos de ejemplo que debemos ejecutar:

Para ver el nombre de la cuenta activa ejecutamos:

    $ gcloud auth list

Ejemplo:

    Credentialed Accounts
    
    ACTIVE            ACCOUNT
    *             guillermoalvarado89@gmail.com
    To set the active account, run: $ gcloud config set account `ACCOUNT`

Podemos listar el ID del proyecto con el siguiente comando:

    $ gcloud config list project

Ejemplo:

    [core]project = gketutorial-257019

Para más información, consultar la [documentación oficial de gcloud.](https://cloud.google.com/sdk/gcloud/)

## Despliegue de cluster GKE paso a paso

#### 1. Designar una zona de cómputo default

Estableceremos la zona y región donde desplegaremos el cluster en us-centrral1-a. Podemos consultar [la lista completa de zonas y regiones](https://cloud.google.com/about/locations/?hl=es-419) en GCP.

Ejecutamos el comando:

    $ gcloud config set compute/zone us-central1-a

Salida:

    Updated property [compute/zone]

#### 2. Desplegar el cluster

Un clúster consta de al menos un nodo master maestray varios  nodos workers. Los nodos son instancias de máquina virtual (VM) de Compute Engine que ejecutan los procesos de Kubernetes necesarios.

Para crear un clúster, ejecutamos el siguiente comando, reemplazando \[CLUSTER-NAME\] con el nombre que vayamos a ysar  para el clúster (por ejemplo, awesome-luster). Los nombres de clúster deben comenzar con una letra, terminar con un carácter alfanumérico y no pueden tener más de 40 caracteres.

    $ gcloud container clusters create [CLUSTER-NAME]

Puede llevar varios minutos terminar de crear el clúster. Poco después, deberíamos recibir una salida similar:

    NAME                             LOCATION            NODE_VERSION  NUM_NODES  STATUS
    
    awesome-cluster         us-central1-a             1.10.9-gke.5                      3          RUNNING