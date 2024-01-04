+++
comments = "true"
date = 2024-01-03T14:00:00Z
image = "/uploads/container_runtimes.png"
tags = ["containers", "devops"]
title = "Docker, containerd, cri-o, runc? Explorando Runtimes de Contenedores"

+++

Desde los primeros días de Docker hasta la orquestación de Kubernetes, la gestión de contenedores ha evolucionado rápidamente, y con ella, los runtimes que dan vida a estas tecnologías.

Descubrir el corazón de los contenedores, los mecanismos que los hacen funcionar y las opciones disponibles, se ha vuelto esencial para cualquier profesional de la tecnología. En esta ocasión, exploraremos los detalles de los OCI runtimes, los entornos específicos para Kubernetes con los CRI runtimes, y las opciones destacadas como Containerd y CRI-O.

## Primero un poco de historia

Un contenedor representa un entorno aislado para el código, independiente del sistema operativo o archivos subyacentes. Este entorno encapsula todos los componentes necesarios para la ejecución del código, incluyendo un sistema operativo base. La gestión y exploración de estos contenedores pueden realizarse a través de una plataforma específica para este propósito y todos comenzamos este camino con Docker.

Sin embargo los contenedores tienen sus raíces en la década de 1970, con la introducción de las chroot jails (chroot significa change root) en sistemas operativos Unix. Estas jaulas permiten crear entornos aislados al limitar el acceso de un proceso a un subdirectorio específico del sistema de archivos, considerándolo su directorio raíz.

Las chroot jails cambian la perspectiva del sistema de archivos para un proceso, haciéndole creer que tiene su propio entorno de archivos separado. Esto aísla al proceso y sus hijos, limitándose a acceder y alterar únicamente archivos y directorios dentro de un subdirectorio específico.

Sin embargo, el concepto moderno de contenedores realmente despegó con el surgimiento de tecnologías como LXC (Linux Containers) alrededor de 2008. LXC utilizaba funcionalidades del kernel de Linux, como cgroups y namespaces, para proporcionar una virtualización a nivel de sistema operativo, permitiendo la ejecución de múltiples entornos aislados en un solo sistema operativo.

- Los cgroups son un mecanismo en el kernel de Linux que controla y gestiona los recursos del sistema, como CPU, memoria, ancho de banda de red, entre otros.
- Los namespaces son un mecanismo de kernel de Linux que permite aislar y virtualizar recursos del sistema. Hay varios tipos de namespaces, cada uno enfocado en aislar un aspecto particular del sistema, como el espacio de nombres de procesos, el espacio de nombres de red, el espacio de nombres de montaje (filesystem), entre otros.

Los contenedores de LXC son como mini sistemas que comparten el kernel del sistema principal pero se mantienen separados en términos de recursos. Esto les da la libertad y aislamiento parecido a una máquina virtual, sin tanta carga. Cada uno tiene su propio sistema de archivos, procesos, redes y límites de recursos. LXC hace esto más fácil con su API y herramientas para manejar contenedores: crear, configurar, iniciar, parar y monitorearlos.

Aunque LXC fue una tecnología pionera en el campo de la virtualización de contenedores, su popularidad inicial fue superada por Docker, principalmente debido a la facilidad de uso y las herramientas adicionales que Docker ofrecía para la creación y distribución de contenedores.

## ¿Por qué Docker revolucionó los contenedores?

En 2008, Docker apareció en escena con su tecnología de contenedores que lleva el mismo nombre. La tecnología Docker incorporó una serie de conceptos y herramientas nuevos: una interfaz de línea de comandos sencilla para ejecutar y diseñar imágenes nuevas en capas, un daemon de servidor, una biblioteca de imágenes en contenedores prediseñadas y el concepto de un servidor de registros.

Estas tecnologías combinadas permitieron que los usuarios diseñaran rápidamente nuevos contenedores en capas y los compartieran con otros sin ninguna dificultad.

Antes de Docker, configurar y gestionar entornos de desarrollo podía ser complejo y lento. Con Docker, se simplificó enormemente este proceso.

- **Facilidad de uso:** con una creación simple de contenedores Docker proporcionó un conjunto de comandos intuitivos (por ejemplo, docker build, docker run) y un formato de archivo (Dockerfile) para definir y crear contenedores. Esto permitió a los desarrolladores crear rápidamente entornos reproducibles y compatibles con todas las dependencias necesarias para su aplicación.

- **Entornos consistentes en cualquier lugar:** Los contenedores Docker podían ejecutarse de manera consistente en cualquier sistema que admitiera Docker, ya fuera un entorno local de desarrollo, un servidor en la nube o un centro de datos, sin importar el sistema operativo subyacente.

- **Eliminación de problemas de dependencias:** Docker encapsula las dependencias de una aplicación dentro del contenedor, lo que significaba que una aplicación funcionaría de la misma manera independientemente del entorno en el que se ejecutara.

El ecosistema de herramientas de Docker es amplio y diverso dado que ofrece multiples herramientas como docker compose, docker gub, docker registry pero ahora nos centraremos en docker engine.

## Docker Engine

El motor de Docker, conocido como Docker Engine, sirve como el corazón de la plataforma Docker. Es responsable de la creación y gestión de los contenedores, facilitando la construcción, distribución y ejecución de aplicaciones dentro de entornos contenerizados. El motor se compone de:

- **dockerd:** Es el corazón de Docker Engine. Este daemon es un servicio que se ejecuta en un sistema operativo compatible y se encarga de controlar todos los aspectos relacionados con los contenedores Docker. Administra la creación, ejecución y supervisión de contenedores, y gestiona recursos como imágenes, redes y volúmenes de almacenamiento. Dockerd usa containerd como container runtime.
- **API REST de Docker:** El servidor Docker expone una API RESTful que proporciona un conjunto de endpoints para interactuar con el daemon (dockerd). Esta API permite a otros servicios o herramientas comunicarse con el servidor Docker para realizar operaciones como la gestión de contenedores, imágenes y redes.
- **Interfaz de línea de comandos (CLI):** La interfaz de línea de comandos docker es la herramienta que utilizan los usuarios para interactuar con el servidor Docker. Permite a los usuarios enviar comandos al daemon de Docker a través de la API REST, facilitando operaciones como la creación, ejecución, inspección y gestión de contenedores, así como la manipulación de imágenes y redes.

De hecho un punto muy relevante es que Docker utiliza Containerd como su runtime de contenedores subyacente para gestionar la creación, ejecución y gestión de los contenedores. Containerd proporciona la funcionalidad principal para la ejecución de contenedores mientras Docker brinda una interfaz amigable y herramientas adicionales para trabajar con ellos.

## Kubernetes deja de soportar directamente Docker

Desde Kubernetes 1.20 (lanzado en diciembre de 2020), se ha ido eliminando gradualmente el soporte directo para Docker como runtime de contenedores por varias razones:

- Desacoplamiento de runtimes de contenedores: Kubernetes buscó desacoplar su dependencia de un runtime específico de contenedores para fomentar la interoperabilidad y la elección de runtimes alternativos.
- Interfaz estándar de contenedores: Kubernetes se ha centrado en la Container Runtime Interface (CRI), que proporciona una interfaz estándar para interactuar con los runtimes de contenedores, permitiendo así que otros runtimes, además de Docker, sean utilizados en un cluster de Kubernetes.
- Diversificación de runtimes: Esto permitió la adopción de otros runtimes como containerd, CRI-O y otros, además de Docker, brindando flexibilidad y opciones a los usuarios.

En consecuencia, mientras que Kubernetes ya no depende directamente de Docker como runtime, sigue siendo perfectamente capaz de administrar contenedores Docker. Los contenedores Docker pueden ejecutarse en un cluster de Kubernetes utilizando containerd (que es utilizado por Docker como su propio runtime), CRI-O u otros runtimes compatibles con la interfaz CRI.

IMAGEN

Así que de todo lo que ofrece docker engine, Kubernetes realmentes necesita lo que está dentro del área roja. Docker Network y Volume no se utilizan en Kubernetes. Tener más funciones cuando nunca las usas puede ser en sí mismo un riesgo para la seguridad. Cuantas menos funciones tengas, más pequeña será la superficie de ataque. Entonces aquí es donde comienzas a considerar alternativas: CRI runtimes.

## CRI runtimes

Container Runtime Interface" (Interfaz de Runtime de Contenedores, en español). Define una interfaz estándar que Kubernetes utiliza para comunicarse con los runtimes de contenedores. Esta interfaz establece un conjunto de operaciones comunes que un runtime de contenedores debe implementar para que Kubernetes pueda administrar los contenedores.

CRI define las operaciones básicas que Kubernetes necesita para crear, destruir y administrar contenedores. Esto permite que Kubernetes sea agnóstico al runtime de contenedores subyacente, lo que significa que puede trabajar con diferentes runtimes sin necesidad de cambiar su lógica interna.

Los runtimes que cumplen con la especificación CRI pueden ser utilizados por Kubernetes de manera uniforme, proporcionando la flexibilidad necesaria para elegir el runtime más adecuado para el entorno de trabajo.

Dentro de estos destacan 2:

**Containerd**: Si solo quieres migrar desde Docker, esta es la mejor opción, ya que containerd se utiliza en realidad dentro de Docker para realizar todos los trabajos de "runtime", como se puede ver en el diagrama anterior. Proporcionan CRI y es exactamente lo que también proporciona Docker . Containerd es 100% de código abierto.

**CRI-O**: es un runtime CRI desarrollado principalmente por Red Hat. De hecho, este runtime se usa en Red Hat OpenShift. Ya no dependen de Docker. Curiosamente, RHEL 7 tampoco admite oficialmente Docker. En cambio, proporcionan Podman, Buildah y CRI-O para el entorno de contenedores.

La fortaleza de CRI-O es su minimalismo, ya que fue creado para ser un runtime "CRI". Mientras que containerd comenzó como parte de Docker tratando de ser más de código abierto, ellos son un runtime CRI puro, por lo que CRI-O no tiene nada que CRI no requiera.

Ahora bien, podriamos decir que los CRI runtimes son runtimes de alto nivel y entonces podemos hablar de los runtimes de bajo nivel como los OCI Runtimes

## OCI runtimes

La Open Container Initiative, también conocida por sus siglas OCI, es un proyecto de la Linux Foundation para diseñar un estándar abierto para virtualización a nivel de sistema operativo.​ El objetivo con estos estándares es asegurar que las plataformas de contenedores no estén vinculadas a ninguna empresa o proyecto concreto.

Estos ripos de runtimes son responsables de generar un contenedor mediante llamadas al sistema del kernel de Linux, como cgroups y namespace. Y aqui destacan runc o gVisor.

**runC** genera contenedores después de que CRI ejecuta el binario mediante llamadas al sistema de Linux. Esto indica que runC depende del kernel que se ejecuta en tu máquina Linux.

También implica que si alguna vez descubres una vulnerabilidad en runC que te otorgue privilegios de root en tu anfitrión, una aplicación contenerizada también podría hacerlo. ¡Un hacker podría tomar el root de ka máquina anfitriona y las cosas seguramente se pondrán mal. Esta es una de las razones por las que debes mantener actualizado tu Docker (o cualquier otro runtime de contenedores), no solo tu aplicación contenerizada.

**gVisor** es un runtime OCI originalmente creado por personas de Google. En realidad, se ejecuta en su infraestructura para ejecutar sus servicios en la nube como Google Cloud Run, Google App Engine (segunda generación) y Google Cloud Functions. Lo interesante aquí es que gVisor tiene una capa de "kernel invitado", lo que significa que las aplicaciones contenerizadas no pueden tocar directamente la capa del kernel del anfitrión. Incluso si piensan que lo hacen, solo interactúan con el kernel invitado de gVisor.
