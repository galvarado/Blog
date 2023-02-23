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

    Copy codepodman build -t nodejs-demo .
    sd

Una vez que se construye la imagen, ejecutamos el contenedor con:

    cssCopy codepodman run --name nodejs-demo -p 8090:8080 -d nodejs-demo
    

Ahora, la aplicación debería estar disponible en [**http://127.0.0.1:8080/**](http://127.0.0.1:8080/).

### Despliega la aplicación en Openshift

Primero, inicia sesión en el clúster Openshift y crea un proyecto:

    javascriptCopy codeoc login
    oc new-project demo-project
    

Obtén la ruta predeterminada del registro de Openshift:

    csharpCopy codeoc get route default-route -n openshift-image-registry
    

Guarda la ruta en una variable:

    javascriptCopy codeHOST=$(oc get route default-route -n openshift-image-registry --template='{{ .spec.host }}')
    

Luego, inicia sesión en el registro:

    bashCopy codepodman login -u $(oc whoami) -p $(oc whoami -t) --tls-verify=false $HOST
    

Etiqueta la imagen y súbela al registro:

    bashCopy codepodman tag nodejs-demo:$HOST/demo-project/nodejs-demo
    podman push $HOST/demo-project/nodejs-demo
    

Ahora, despleguemos la aplicación:

    cssCopy codeoc apply -f orchestration/deployment,yml
    oc expose deployment nodejs-demo --name nodejs-demo-svc --port 8080 --target-port=8080
    oc expose service nodejs-demo-svc -l route=external --name=nodejs-demo
    

Y eso es todo, ¡ya tienes tu aplicación Node.js ejecutándose en Openshift! Espero que este tutorial haya sido útil para ti y que hayas aprendido cómo desplegar una aplicación Node.js en Openshift. Si tienes alguna pregunta, no dudes en preguntar en los comentarios. ¡Feliz hacking!