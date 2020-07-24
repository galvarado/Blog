+++
comments = "true"
date = 2020-07-24T05:00:00Z
draft = true
image = ""
tags = ["devops", "cloud", "containers"]
title = "Pipelines de despliegue continuo con Spinnaker"

+++
Spinnaker es una plataforma de entrega continua de código abierto para liberar cambios de software con alta velocidad y confianza. A través de una poderosa capa de abstracción, Spinnaker proporciona herramientas  nos permiten llevar el código de la aplicación desde el "commit"  hasta producción. Es considerada la plataforma de entrega continua más madura  y tiene la experiencia de los equipos de Netflix, Google, Microsoft y Amazonpues la usan en  su **ciclo de desarrollo de software**. Las empresas que lo usan para liberar aplicaciones a producción incluyen Target, Salesforce, Airbnb, Cerner, Adobe y JPMorgan Chase.

## ¿Porqué usar Spinnaker?

Podemos  nuestro   [Systems Development Life Cycle](https://es.wikipedia.org/wiki/Systems_Development_Life_Cycle "Systems Development Life Cycle"), también conocido como _ciclo  del desarrollo de software_  en Spinnaker utilizando la GUI (interfaz gráfica de usuario) o config-as-code. Podemos ver, administrar y crear flujos de trabajo de aplicaciones que involucren uno o todos estos recursos:

* Implementaciones de máquinas virtuales (VM) en un proveedor de nube pública, "integradas" como infraestructura inmutable
* Despliegue de contenedores en una nube
* Despliegue de contenedores en Kubernetes
* Balanceadores de carga
* Grupos de seguridad
* Grupos de servidores
* Clusters
* Firewalls

Como dice el mismo sitio de Spinnaer, creamos un "camino pavimentado" para la entrega de aplicaciones, con protecciones que aseguran que solo la infraestructura válida y la configuración alcancen la producción.

## Características

**Multi-Nube:**

Soporta múltiples proveedores de  nube, incluidos AWS EC2, Kubernetes, Google Compute Engine, Google Kubernetes Engine, Google App Engine, Microsoft Azure, Openstack, Cloud Foundry y Oracle Cloud Infrastructure, con DC / OS próximamente.

**Liberación automatizadas**

Soporta pipelines de implementación que ejecutan pruebas de integración y puede activar y desactivar grupos de servidores así como  supervisar las implementaciones. Dispara pipelines mediante eventos hacia  git, Jenkins, Travis CI, Docker, CRON , etc. Escucha eventos, recolecte artiacts y activa pipelines de Jenkins o Travis CI. También se admiten triggers a través de git, cron o el push de una nueva imagen en un registro de docker.

**Integraciones de monitoreo**

Se integra con servicios de monitoreo; Datadog, Prometheus, Stackdriver, SignalFx o New Relic utilizando sus métricas para el análisis canario.

**Estrategias de implementación**

Configura pipelines con estrategias de implementación integradas como highlander y red/black o blue/green deployment. Soporte para Canary releases.

**Notificaciones**

Integración para  notificaciones de eventos por correo electrónico, Slack, HipChat o SMS (a través de Twilio).

**VM Bakery**

"Hornea" imágenes VM inmutables a través de Packer, que viene empaquetado con Spinnaker y ofrece soporte para plantillas de Chef y Puppet.