+++
comments = "true"
date = 2020-07-24T16:00:00Z
image = "/uploads/spinnaker.png"
tags = ["devops", "cloud", "containers"]
title = "¿Conoces Spinnaker?  Una herramienta para desplegar a produccón rápido, seguro y repetible "

+++
Spinnaker es una plataforma de entrega continua de código abierto para liberar cambios de software con alta velocidad y confianza. A través de una poderosa capa de abstracción, Spinnaker proporciona herramientas  nos permiten llevar el código de la aplicación desde el "commit"  hasta producción. Es considerada la plataforma de entrega continua más madura  y tiene la experiencia de los equipos de Netflix, Google, Microsoft y Amazon pues la usan en su **ciclo de desarrollo de software**. Las empresas que lo usan para liberar aplicaciones a producción incluyen Target, Salesforce, Airbnb, Cerner, Adobe y JPMorgan Chase.

## ¿Porqué usar Spinnaker?

Podemos  manejar nuestro   [Systems Development Life Cycle](https://es.wikipedia.org/wiki/Systems_Development_Life_Cycle "Systems Development Life Cycle"), también conocido como _ciclo  del desarrollo de software_  en Spinnaker utilizando la GUI (interfaz gráfica de usuario) o config-as-code. Podemos ver, administrar y crear flujos de trabajo de aplicaciones que involucren uno o todos estos recursos:

* Implementaciones de máquinas virtuales (VM) en un proveedor de nube pública, "integradas" como infraestructura inmutable
* Despliegue de contenedores en una nube
* Despliegue de contenedores en Kubernetes
* Balanceadores de carga
* Grupos de seguridad
* Grupos de servidores
* Clusters
* Firewalls

Como dice el mismo sitio de Spinnaker, creamos un "camino pavimentado" para la entrega de aplicaciones, con protecciones que aseguran que solo la infraestructura y configuración válida  alcancen producción.

## Características

**Multi-Nube:**

Soporta múltiples proveedores de  nube, incluidos AWS EC2, Kubernetes, Google Compute Engine, Google Kubernetes Engine, Google App Engine, Microsoft Azure, Openstack, Cloud Foundry y Oracle Cloud Infrastructure, con DC / OS próximamente.

**Liberación automatizadas**

Soporta pipelines de implementación que ejecutan pruebas de integración y puede activar y desactivar grupos de servidores así como  supervisar las implementaciones.  Escucha eventos, recolecta artiacts y activa pipelines de Jenkins o Travis CI. También se admiten triggers a través de git, cron o el push de una nueva imagen en un registro de docker.

**Integraciones de monitoreo**

Se integra con servicios de monitoreo; Datadog, Prometheus, Stackdriver, SignalFx o New Relic utilizando sus métricas para el análisis canario.

**Notificaciones**

Integración para notificaciones de eventos por correo electrónico, Slack, HipChat o SMS (a través de Twilio).

**VM Bakery**

"Hornea" imágenesde  VM inmutables a través de Packer, que viene empaquetado con Spinnaker y ofrece soporte para plantillas de Chef y Puppet.

**Estrategias de implementación**

Configura pipelines con estrategias de implementación  como highlander y red/black o blue/green deployment. Soporte para Canary releases.

## Componentes de Spinnaker

¿Cómo está hecho  Spinnaker? Se compone de una serie de microservicios :

![](/uploads/componentes_spinnaker.png)

* **Deck** es la interfaz de usuario (UI) para acceder desde navegador.
* **Gate** es la e API. La interfaz de usuario de Spinnaker y todos los componentes que llaman a  Spinnaker lo hacen a través de Gate.
* **Orca** es el motor de orquestación. Maneja todas las operaciones y pipelines.
* **Clouddriver** es responsable de todas las llamadas hacia los proveedores de nube y de indexar / almacenar en caché todos los recursos desplegados.
* **Front50** se utiliza para persistir los metadatos de aplicaciones, piplenes, proyectos y notificaciones.
* **Rosco** es el componente que se utiliza para "Bakeru". Se usa para producir imágenes de máquinas(por ejemplo, imágenes GCE, AWS AMI, imágenes de Azure VM) Actualmente es un wrapper para  Packer de Hashicorp, pero se ampliará para admitir otros plugins para producir imágenes de VM.
* **Igor** se usa para activar (trigger) pipelines a través de trabajos de integración continua en sistemas como Jenkins, Travis CI y Docker Registry
* **Echo** es el bus de eventos de Spinnaker. Admite el envío de notificaciones (por ejemplo, Slack, correo electrónico, Hipchat, SMS) y actúa en los webhooks  de servicios como GitHub.
* **Fiat** es el servicio de autorización de Spinnaker. Se utiliza para consultar los permisos de acceso de un usuario para cuentas, aplicaciones y cuentas de servicio.
* **Kayenta** proporciona análisis canario automatizado para Spinnaker.
* **Halyard** es el servicio de configuración de Spinnaker. Halyard gestiona el ciclo de vida de cada uno de los servicios anteriores. Es la herramienta con la que instalamos Spinnaker.

Además, Spinnaker utiliza Redis como un motor de almacenamiento en caché para almacenar información relacionada con la infraestructura, almacenar ejecuciones en vivo, devolver definiciones de pipelines más rápido, etc.

## Terminología de Spinnaker

![](/uploads/terminologia_spinnaker.png)![](/uploads/terminologia_spinnaker.png)

### Aplicación

Una aplicación es una agrupación lógica de servicios que tiene que implementar Spinnaker, incluye una colección de clústeres, que a su vez son colecciones de grupos de servidores. Tambiénse  puede incluir firewalls y equilibradores de carga.

Podemos entender una aplicación como un  servicio, es decir, una sola aplicación puede asignarse a un microservicio, aunque spinnaker no lo impone.

### Clúster

Varios servidores es un grupo de servidores, mientras que un clúster es un conjunto de grupos de servidores.

### Grupos de servidores

Es el recurso base, un grupo de servidores  identifica el artefacto desplegable para la aplicación como una imagen de VM o una  imagen de Docker además de sus configuraciones como número de instancias, políticas de autoescalado, metadatos, etc.

Ejemlpos de esto son deslplegar una VM (En este caso el grupo des de 1)  o Dos  VMs. También pueden ser 1 o 2 pods/containers de k8s.

### LoadBalancer

Un Load Balancer está asociado con un protocolo de ingreso y un rango de puertos. Maneja el tráfico entre instancias en los grupos de servidores.

### Firewall

Un conjunto de reglas de firewall para políticas de acceso a la red.

## Sobre la instalación de Spinnaker

## Bonus: Jenkins vs Spinnaker

Spinnaker no es una herramienta de construcción (Build) , sino una herramienta de implementación, con un enfoque en la nube.  Jenkins es para CI (Integración continua) y necesita scripts y complementos para hacer CD (Despliegue continuo).

**Spinnaker no reemplaza por completo a Jenkins** en un pipeline de CI/CD, pero tiene integraciones nativas hacia la nube y con capacidades extendidas. Spinnaker se creó para combinar CI y CD para lograr implementaciones optimizadas en la  nube. Si bien Jenkins nos puede ayudar a desplegar sofware, no se construyó con esos fines y necesita mucha mano para lograrlo.  Spinnaker ofrece soporte integrado para hacer cosas como crear balanceadores de carga, redimensionar clústeres y ejecutar rollbacks. 

Spinnaker ofrece soporte nativo para implementaciones básicas y avanzadas sin la necesidad de código y scripts personalizados como necesita Jenkins.

Entones, antes teniamos: Jenkins + Ansible + proveedor de la nube para hacer un pipeline de CI/CD completo.

Hoy, podemos centralizar todos los pasos desde Spinnaker pues podemos mandar llamar a Jenkins y monitorearlo desde el tablero de Spinnaker.

**En conclusión: es correcto usar Jenkins y Spinnaker, cada quién a lo suyo, pero podemos gestionar todo el pipeline desde Spinnaker delegando tareas a Jenkins.**

Si te pareció útil, por favor comparte. Si tienes dudas , no dudes en escribirme en los comentarios o a través de redes sociales.

Referencias:

[https://medium.com/searce/spinnaker-the-hard-way-278913f3f1d8](https://medium.com/searce/spinnaker-the-hard-way-278913f3f1d8 "https://medium.com/searce/spinnaker-the-hard-way-278913f3f1d8")

[https://spinnaker.io/setup/install/](https://spinnaker.io/setup/install/ "https://spinnaker.io/setup/install/")