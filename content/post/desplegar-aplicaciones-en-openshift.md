+++
comments = "true"
date = 2023-02-23T00:00:00Z
draft = true
image = "/uploads/openshift.png"
tags = ["devops", "cloud", "containers"]
title = "Desplegar Aplicaciones en OpenShift"

+++
En este tutorial, aprenderás a crear una aplicación Node.js que se ejecuta en un contenedor y cómo desplegarla a un clúster Openshift.

## Sobre OpenShift

Si estás buscando una plataforma de orquestación de contenedores para ejecutar aplicaciones de manera escalable y flexible, es posible que hayas oído hablar de OpenShift y Kubernetes. Ambas son excelentes opciones para manejar contenedores, pero aquí te contaré un poco más sobre OpenShift y cómo se compara con Kubernetes.

* OpenShift es una plataforma de orquestación de contenedores de Red Hat, que se basa en Kubernetes, pero incluye componentes adicionales para mejorar la experiencia de usuario.
* OpenShift es una plataforma muy completa que cubre muchos aspectos de la implementación, la administración y el ciclo de vida de una aplicación, mientras que Kubernetes se enfoca en la orquestación de contenedores.
* OpenShift es más fácil de usar y configurar que Kubernetes, ya que viene con una serie de herramientas integradas y una interfaz de usuario intuitiva.
* OpenShift proporciona una plataforma más segura y escalable que Kubernetes, con características de seguridad incorporadas y una capacidad de gestión de recursos más avanzada.
* OpenShift es compatible con Kubernetes y se integra sin problemas con herramientas de automatización y DevOps, por lo que es una excelente opción para equipos de desarrollo que buscan una solución completa.

En general, si eres nuevo en la orquestación de contenedores y buscas una plataforma fácil de usar y con una amplia gama de características, OpenShift puede ser una excelente opción para ti. Si ya estás familiarizado con Kubernetes y buscas una solución más enfocada en la orquestación de contenedores, Kubernetes puede ser una mejor opción. Pero en última instancia, la elección depende de tus necesidades específicas y de las características que sean más importantes para ti.

## Tutorial

### Requisitos

Primero, asegúrate de tener instalado Node.js, npm y podman en tu máquina. También necesitarás acceso a un clúster Openshift. Si no tienes acceso a uno, puedes usar MiniShift para crear uno localmente y aprender a través de él.

Una vez que hayas preparado el entorno, podrás ejecutar la aplicación localmente sin contenedor. Luego, containerizaremos la aplicación y la ejecutaremos en un contenedor. Finalmente, aprenderás a desplegar la aplicación a un clúster Openshift. ¡Comencemos!

### Ejecuta la aplicación localmente

Para ejecutar la aplicación localmente, clona el repositorio y, dentro del directorio del proyecto, ejecuta los siguientes comandos:

    npm install
    node app.js

La aplicación debería estar disponible en [**http://127.0.0.1:8080/**](http://127.0.0.1:8080/). Ahora que la aplicación se está ejecutando, vamos a containerizarla

### Containeriza la aplicación

Primero, construimos la imagen con el siguiente comando:

    podman build -t nodejs-demo .

Una vez que se construye la imagen, ejecutamos el contenedor con:

    podman run --name nodejs-demo -p 8090:8080 -d nodejs-demo

Ahora, la aplicación debería estar disponible en [**http://127.0.0.1:8080/**](http://127.0.0.1:8080/).

### Despliega la aplicación en Openshift

Primero, inicia sesión en el clúster Openshift y crea un proyecto:

    eoc login
    oc new-project demo-project

Obtén la ruta predeterminada del registro de Openshift:

    oc get route default-route -n openshift-image-registry

Guarda la ruta en una variable:

    HOST=$(oc get route default-route -n openshift-image-registry --template='{{ .spec.host }}')

Luego, inicia sesión en el registro:

    podman login -u $(oc whoami) -p $(oc whoami -t) --tls-verify=false $HOST

Etiqueta la imagen y súbela al registro:

    podman tag nodejs-demo:$HOST/demo-project/nodejs-demo
    podman push $HOST/demo-project/nodejs-demo

Ahora, despleguemos la aplicación:

    oc apply -f orchestration/deployment.yml
    oc expose deployment nodejs-demo --name nodejs-demo-svc --port 8080 --target-port=8080
    oc expose service nodejs-demo-svc -l route=external --name=nodejs-demo

Vamos a la explicación:

**Archivo orchestration/deployment.yml**

    apiVersion: apps/v1

    kind: Deployment

    metadata:

    name: nodejs-demo

    spec:

    replicas: 1

    selector:

    matchLabels:

    app: nodejs-demo

    template:

    metadata:

    labels:

    app: nodejs-demo

    spec:

    containers:

     - name: nodejs-demo

    image: default-route-openshift-image-registry.apps.mtvosddev.bbej.p1.openshiftapps.com/demo-project/nodejs-demo

    ports:

     - containerPort: 8080

Este es un archivo YAML que se utiliza para definir un Deployment de Kubernetes/Openshift. Un Deployment se utiliza para gestionar la implementación de un conjunto de réplicas de un pod.

En este caso, el Deployment se llama "nodejs-demo" y se especifica que se desea tener una sola réplica. La sección "selector" especifica cómo se seleccionan los pods que se incluirán en la implementación. En este caso, los pods seleccionados tendrán una etiqueta "app" con el valor "nodejs-demo".

La sección "template" especifica cómo se crean los pods en la implementación. Aquí se define la plantilla para crear los pods con la misma etiqueta que se definió en la sección "selector". El contenedor de la aplicación se define en la sección "containers" con el nombre "nodejs-demo" y la imagen que se utilizará para construir el contenedor se especifica en "image".

La aplicación dentro del contenedor escuchará en el puerto 8080, lo que se especifica en la sección "ports". Esto permite que el tráfico se enrute correctamente al pod de la aplicación. En resumen, este archivo YAML define cómo se implementará la aplicación "nodejs-demo" en un clúster de Kubernetes con una sola réplica.

El comando **`oc apply -f orchestration/deployment.yml`** se utiliza para aplicar un archivo de definición de despliegue (deployment) a un clúster de OpenShift. Este archivo de definición especifica cómo se debe implementar y configurar una aplicación en OpenShift.

Una vez aplicado el archivo de definición, OpenShift creará automáticamente los recursos necesarios (pods, servicios, etc.) para ejecutar la aplicación en el clúster.

**oc expose deployment**

El comando oc expose deployment en Openshift se utiliza para exponer una implementación (deployment) de una aplicación como un servicio en el clúster.

El parámetro **`--name`** especifica el nombre del servicio, que en este caso es "nodejs-demo-svc". El parámetro **`--port`** especifica el puerto en el que se expone el servicio, en este caso, 8080. El parámetro **`--target-port`** especifica el puerto de destino que se utiliza para enrutar el tráfico al contenedor de la aplicación. En este caso, el puerto de destino es también 8080, que es el puerto en el que la aplicación Node.js está escuchando.

**oc expose service**

El comando **`oc expose service`** en OpenShift se utiliza para crear una ruta que permita el acceso externo a un servicio en una implementación de OpenShift. Al ejecutar el comando **`oc expose service nodejs-demo-svc -l route=external --name=nodejs-demo`**, se crea una ruta que expone el servicio **`nodejs-demo-svc`** de la implementación de OpenShift como **`nodejs-demo`** a través de la interfaz externa de la implementación.

El parámetro **`-l route=external`** indica que la ruta creada debe tener una etiqueta de ruta externa, lo que significa que se puede acceder a ella desde fuera de la implementación de OpenShift. El parámetro **`--name`** especifica el nombre de la ruta que se creará. Al crear una ruta para un servicio, se puede acceder a la aplicación a través de una URL en la forma de **`http://nombre-de-la-ruta.nombre-del-proyecto.apps.nombre-del-cluster.com`**.

Y eso es todo, ya tienes tu aplicación Node.js ejecutándose en Openshift! Espero que este tutorial haya sido útil para ti y que hayas aprendido cómo desplegar una aplicación Node.js en Openshift. Si tienes alguna pregunta, no dudes en preguntar en los comentarios. 