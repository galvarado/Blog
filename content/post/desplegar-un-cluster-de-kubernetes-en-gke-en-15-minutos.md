+++
comments = "true"
date = 2020-01-19T23:00:00Z
image = "/uploads/KubernetesGoogleCloud.png"
tags = ["devops", "cloud", "containers", "GCP", "kubernetes"]
title = "Tutorial: Desplegar un cluster de Kubernetes en GKE en 15 minutos"

+++
En este tutorial de Kubernetes me enfoqué en usar  Google Kubernetes Engine (GKE) que proporciona un entorno  para implementar, administrar y escalar  aplicaciones en contenedores utilizando la infraestructura de Google de una manera muy, muy sencilla.

Cuando creamos un  entorno de  Kubernetes Engine este se forma de varias máquinas de instancias de Google Compute Engine, en esta ocasión crearemos un clúster de k8s administrado en GKE e implementaremos una aplicación de prueba accediendo a ella en nuestro navegador.

Antes de entrar de lleno a   Google Kubernetes Engine: Si deseas conocer otras herramientas para instalar Kubernetes en otros entornos te recomiendo consultar el post[ 6 herramientas para desplegar un cluster de kubernetes](https://galvarado.com.mx/post/6-herramientas-para-desplegar-un-cluster-de-kubernetes/). Encontrarás  opciones para  entornos locales,de desarrollo y otras nubes como AWS, Azure o Digital Ocean.

## Kubernetes en Google Cloud Platform

GKE utiliza las instancias de Google Compute Engine como [nodos del clúster](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#nodes) y cada una se factura según los [precios de Compute Engine](https://cloud.google.com/compute/pricing). Las máquinas  las crea GKE  automáticamente cuando creamos un clúster. El precio que pagaremos será el tiempo que tengamos encendidas estas máquinas. No hay ninǵun otro costo asociado.

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

![](/uploads/cloud_shell.png)

**¿Qué es Cloud Shell?**

Google Cloud Shell  ofrece acceso a los recursos en la nube mediante la línea de comandos directamente desde el navegador.

Para administrar fácilmente los proyectos y recursos sin tener que instalar  el [SDK de Google Cloud](https://cloud.google.com/sdk/) ni otras herramientas. Cloud Shell proporciona:

* Una instancia de máquina virtual de Compute Engine temporal que ejecuta un Sistema operativo Linux basado en Debian
* Acceso de línea de comandos a la instancia desde un navegador web utilizando ventanas de terminal en la consola de la plataforma en la nube
* 5 GB de almacenamiento en disco persistente por usuario, montado como su $ HOME
* Google Cloud SDK y otras herramientas preinstaladas

Toma unos minutos aprovisionar y conectarnos al entorno. Cuando estamos conectados, ya estamos autenticados y el proyecto está configurado en la variable PROJECT_ID.

Se debería ver algo simiar a esto:

![](/uploads/Captura_realizada_el_2019-10-25_14.16.11.png)

Desde esta ventana ejecutaremos todos los comandos.

**gcloud**

gcloud es la herramienta que usaremos para desplegar. Esta es la línea de comandos para Google Cloud Platform. Viene preinstalado en Cloud Shell. A continuacion una serie de comandos de ejemplo que debemos ejecutar:

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

## Despliegue de clúster GKE paso a paso

Una vez realizados los pasos anteriores podemos comenzar a crear el clúster. Los pasos a seguir son realmente sencillos:

#### 1. Designar una zona de cómputo por default

Estableceremos la zona y región donde desplegaremos el clúster en **us-centrral1-a**. Podemos consultar [la lista completa de zonas y regiones](https://cloud.google.com/about/locations/?hl=es-419) en GCP.

Ejecutamos el comando:

    $ gcloud config set compute/zone us-central1-a

Salida:

    Updated property [compute/zone]

#### 2. Desplegar el clúster

Un clúster consta de al menos un nodo master  y varios  nodos workers. Los nodos son instancias de máquina virtual (VM) de Compute Engine que ejecutan los procesos de Kubernetes necesarios.

Para crear un clúster, ejecutamos el siguiente comando:

    $ gcloud container clusters create [CLUSTER-NAME]

Reemplazando \[CLUSTER-NAME\] con el nombre que vayamos a usar  para el clúster (por ejemplo, awesome-cluster). Los nombres de clúster deben comenzar con una letra, terminar con un carácter alfanumérico y no pueden tener más de 40 caracteres.

    $ gcloud container clusters create awesome-cluster
    Creating cluster awesome-cluster in us-central1-a... Cluster is being deployed...⠹

Puede llevar varios minutos terminar de crear el clúster. Poco después, deberíamos recibir una salida similar:

    NAME               LOCATION            NODE_VERSION     NUM_NODES      STATUS
    awesome-cluster   us-central1-a         1.10.9-gke.5        3          RUNNING

Si vamos al panel de Compute Engine, veremos las VMs que se crearon. Estás son los hosts del cluster de K8s.

![](/uploads/Captura_realizada_el_2020-01-16_15.17.23.png)

NOTA: Es posible que el acceso a la API para ejecutar este comando no está habilitado. En tal caso recibiremos un ERROR similar a este:

    ERROR: (gcloud.container.clusters.create) ResponseError: code=403, message=Google Compute Engine: Access Not Configured. Compute Engine API has not been used in project 272718626493 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/compute.googleapis.com/overview?project=272718626493 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.

Basta con seguir el link que nos muestra el error. Desde ahí habilitaremos el acceso a la API de Compute. Damos click  en el botón Habiitar API y Servicios:

![](/uploads/GKEhabilitarAPI.png)

En el cuadro de busqueda filtraremos por "Compute" y habilitaremos el acceso:

![](/uploads/Captura_realizada_el_2020-01-16_15.02.49.png)

Si es la primera vez que usas Googe Cloud también deberás crear una cuenta de facturación. El cuadro de dialogo aparecerá en tal caso y basta con llenar el formulario.

#### 3. Autenticarse en  el clúster

Después de crear el clúster, necesita obtener credenciales de autenticación para interactuar con el. Para autenticarnos,  ejecutaremos el siguiente comando:

    $ gcloud container clusters get-credentials [CLUSTER-NAME]

Reemplazando \[CLUSTER-NAME\] con el nombre del  clúster:

    $ gcloud container clusters get-credentials awesome-cluster

Deberíamos recibir una salida similar:

    Fetching cluster endpoint and auth data.
    kubeconfig entry generated for awesome-cluster.

#### 4. Implementar una aplicación en el clúster

Ahora podemos implementar una aplicación basada en contenedores. Para este laboratorio, ejecutaremos la aplicación hello-app en el clúster.  El motor de Kubernetes utiliza  objetos de Kubernetes para crear y administrar los recursos de su clúster. Kubernetes proporciona el objeto de "Deployment" para implementar aplicaciones. Otros  objetos como el de "Service" definen reglas para acceder a la aplicación desde Internet.

Ejecuteamos el  siguiente comando de  [kubectl](https://kubernetes.io/es/docs/tasks/tools/install-kubectl/)  para crear la aplicación  a partir de la imagen  hello-app.

NOTA: En este punto es necesario estar familiarizado con los conceptos de Kubernetes.

    kubectl run hello-server --image=gcr.io/google-samples/hello-app:1.0 --port 8080

Debemos obtener una salida similar a esta:

    deployment.apps/hello-server created

Este comando de Kubernetes crea un objeto "Deployment" que representa a la aplicación hello-app.

En este comando:

_--port:_ Especifica el puerto que expone el contenedor. En este caso expondremos el puerto 8080

_--image:_  Especifica la imagen de contenedor para desplegar. En este caso, el comando extrae la imagen de ejemplo de un repositorio de Google Container Registry, en este caso  gcr.io/google-samples/hello-app:1.0 indica  la imagen y la versión  específica que se debe extraer. Si no se especificamos una versión, se utiliza la última versión. Si tienes curiosidad por la imagen la puedes consultar aquí: [https://console.cloud.google.com/gcr/images/google-samples/GLOBAL/hello-app](https://console.cloud.google.com/gcr/images/google-samples/GLOBAL/hello-app "https://console.cloud.google.com/gcr/images/google-samples/GLOBAL/hello-app")

![](/uploads/Captura_realizada_el_2020-01-16_15.37.57.png)

Ahora crearemos un objetivo tipo "Service" de Kubernetes, que es un recurso que  permite exponer la aplicación al tráfico externo. Al pasar type = "LoadBalancer" se crea un balanceador de carga de Compute Engine para la aplicación.

Ejecutamos el siguiente comando de kubectl :

    kubectl expose deployment hello-server --type="LoadBalancer"

Salida:

    service/hello-server exposed

Si vamos a los recursos de red en el panel de GCP, podemos ver el balanceador recién creado:

![](/uploads/Captura_realizada_el_2020-01-16_15.31.05.png)

Estas son algunas de las bondades de GKE, puedes crear balanceadores de carga y hosts de Kubernetes con un par de comandos, gracias a la integración de K8s  con Google Cloud.

#### 

#### 5. Acceder a la aplicación

La aplicación está lista. Inspeccionamos el servicio para acceder a él:

    kubectl get service hello-server

Salida:

    NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
    hello-server   LoadBalancer   10.15.249.250   34.70.181.160   8080:32396/TCP   2m18s

NOTA: puede llevar unos 2 minutos  generar la dirección IP externa. Ejecuteamos el comando anterior nuevamente si la columna EXTERNAL-IP está en estado "pendiente".

De la salida de este comando, copiamos la dirección IP externa del Servicio de la columna IP EXTERNA.

Vamos a la aplicación desde el navegador web utilizando la dirección IP externa con el puerto expuesto:

http: // \[IP EXTERNA\]: 8080

En mi caso:

[http://34.70.181.160:8080/](http://34.70.181.160:8080/)

La página debe parecerse a lo siguiente:

#### ![](/uploads/Captura_realizada_el_2020-01-16_15.26.49.png)

#### 6. Eliminar los recursos

Ejecutamos lo siguiente para eliminar el clúster:

    gcloud container clusters delete [CLUSTER-NAME]

Cuando se  solicite, escribimos Y para confirmar.  Eliminar el clúster puede llevar unos minutos. La salida es similar a esta:

    Deleting cluster awesome-cluster...done.
    Deleted [https://container.googleapis.com/v1/projects/gketutorial-257019/zones/us-central1-a/clusters/awesome-cluster].

Borramos los recursos ya que este laboratorio usa VMs reales. Es importante mencionar que el costo de estas VMs se facturarán mientras estén ejecutandose. **NO OLVIDES ELIMINAR LOS RECURSOS PARA NO GENERAR COSTOS EXTRA.**

¡Listo!  Acabas de implementar una aplicación en contenedores en Kubernetes Engine. Si tienes dudas o comentarios, no dudes en dejarme por aquí tus opiniones [o por mis redes sociales](https://galvarado.com.mx/static/me/).

Si te fue de utilidad por favor comparte =)