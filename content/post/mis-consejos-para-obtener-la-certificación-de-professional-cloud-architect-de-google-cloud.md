+++
comments = "true"
date = "2019-04-08T05:00:00+00:00"
image = "/uploads/gcpcertification.png"
tags = ["cloud", "GCP"]
title = "Mis consejos para obtener la certificación de Professional Cloud Architect de Google Cloud "

+++
Las últimas semanas me preparé para rendir el examen y obtener la certificación como Professional Cloud Architect de Google Cloud Platform y me gustaría compartir el proceso que seguí, cómo me preparé y algunos consejos útiles para aquellos quienes desean obtener esta certificación.

Este es el certificado que se obtiene al pasar el examen de certificación:

![](/uploads/GoogleCloudCertificate.jpg)

## ¿Es dificil el examen?

La primer pregunta es ¿Es un examen difícil? Para mi la respuesta es sí. Pero definitivamente no es imposible, quizá un 8/10 de dificultad. Creo que la principal diferencia con otros exámenes que he rendido es que Google espera que todos los arquitectos de soluciones tengan un buen conocimiento de practicas desarrollo. Esto podría no ser un problema para la mayoría de las personas, pero algunos se verán en aprietos en preguntas que les pidan analizar código Python que no tiene nada que ver con toda la plataforma de Google Cloud o en preguntas de mejores practicas de despliegue de software para actualizar aplicaciones mitigando riesgos en los updates y estrategias de rollback, también se asume conocimiento de estrategias como Blue-green deployments, A/B Testing,  Canary Releases e incluso algunas preguntas relacionadas con herramientas  cómo Jenkins o  Spinnaker.

Pero esto es en realidad una ventaja ya que la certificación demuestra que gira completamente en torno al desempeño profesional del rol de Arquitecto de Nube, en lugar de solo demostrar que se conoce la plataforma en sí. Hay un valor significativo en esto porque puede representar mejor la capacidad en el mundo real, pero esto también lo hace mucho más difícil porque el alcance es casi ilimitado, muchas preguntas del examen no tienen nada que ver con Google.

## ¿Cómo prepararse?

Primero debo remarcar que yo decidí tomar esta ruta ya que los últimos 4 años me he enfocado en cloud, containers, devops e integración continua, tengo experiencia en ambientes de nube pública con AWS, DigitalOcean y el mismo GCP  y con nube privada con Openstack.  

#### 1 . Tomar la especialización Architecting with Google Cloud Platform en Coursera

Para la certificación tomé como capacitación un curso especializado en Coursera, mismo que venia recomendado por Google [en los detalles de la certificación](https://cloud.google.com/certification/cloud-architect?hl=es).

La especialización [Architecting with Google Cloud Platform](https://www.coursera.org/specializations/gcp-architecture?utm_source=googlecloud&utm_medium=institutions&utm_campaign=GoogleCloud_PCA_Architecting) en Coursera incluye los siguientes 6 cursos, he agregado una breve descripción del contenido  y los módulos que integran cada curso:

**1.1 Google Cloud Platform Fundamentals: Core Infrastructure**

* Introducción a los componentes de GCP. En general un repaso por las principales características de Cloud IAM, Compute Engine, App Engine, Kubernetes Engine, opciones de almacenamiento y bases de datos, balanceadores de carga y las soluciones de machine learnigng y bigdata.

Módulos:

* Introducing Google Cloud Platform
* Getting Started with Google Cloud Platform
* Virtual Machines in the cloud
* Storage in the cloud
* Containers in the cloud
* Applications in the cloud
* Developing, deploying and monitoring in the cloud
* Bigdata and machine learning in the cloud

**1.2 Essential Cloud Infrastructure: Foundation**

* Revisión a mayor profundidad de los servicios de red (VPC) así como la organización de las redes y los proyectos, IPs externas, rutas, reglas de firewall, modelo de billing, alcance de las redes y las subnets. En cuanto a Compute engine, ciclo de vida y gestión de máquinas virtuales, gestión de imágenes, tipos de disco, tipos de descuento.

Módulos:

* Introducción a GCP
* Google Cloud Platform VPC
* Virtual Machines

**1.3 Essential Cloud Infrastructure: Core Services**

* Revisón a mayor profundidad de Cloud Identity and Access Management, gestión, diferencias y modelos de elección de los servicios de almacenamiento como Cloud storage, Cloud SQL, Cloud Spanner, Cloud Datastore, Cloud Bigtable. Manejo de recursos y definiciones de billing. Características de Stack driver para monitoreo, logging, reporte de errores, trace y debug.

Módulos:

* Cloud Identity and Access Management (IAM)
* Data Storage Services
* Resource Management
* Resource Monitoring

**1.4 Elastic Cloud Infrastructure: Scaling and Automation**

* Curso muy enfocado a manejar a fondo los mecanismos para crear arquitecturas escalables y detalles de automatización de distintios componentes. Incluye revisón a mayor profundidad de las distintas opciones de interconectarse con Google para realizar casos de nube híbrida, ejemplos y comparaciones así como una guia de elección de los distintos balanceadores de carga. Explicación de los detalles de autoescalamiento y el manejo de los managed instances groups y el deployment manager.

Módulos:

* Interconnecting Networks
* Load Balancing
* Austoscaling
* Infrastructure automation with GCP APIs
* Infrastructure automation with Deployment Manager
* Managed services

**1.5 Elastic Cloud Infrastructure: Containers and Services**

* Detalles de Cloud Pub/Sub, API Management, Cloud Functions y Cloud Source Repositories. Introducción a Google Kubernetes Engine y Container registry.

Módulos:

* Application Infrastructure Services
* Application Development Services
* Containers

**1.6 Reliable Cloud Infrastructure: Design and Process**

* Curso enfocado a las mejores prácticas para diseñar soluciones en la nube que sean resilientes, escalables y preparadas para desastres. Este curso incluye un ejemplo de una aplicación que se va desarrollando en todo cada módulo, presenta desafíos donde se parte de un escenario inicial y se deben ir desarrollando los componentes para hacer más robusta la aplicación y más resiliente. Hacen mucho hincapié en las practicas del libro de Google Site Reliability Engineering: [https://landing.google.com/sre/books/](https://landing.google.com/sre/books/ "https://landing.google.com/sre/books/") y en “The twelve-factor app” que es una metodología para construir aplicaciones SaaS en la nube: [https://12factor.net/es/](https://12factor.net/es/ "https://12factor.net/es/")

Módulos:

* Defining the service
* Bussines logic layer design
* Data layer design
* Network design
* Design for resiliency, scalability, and disaster recovery
* Design for security
* Capacity planning and cost optimization
* Deployment, monitoring and alerting, and incident response

#### 2 . Realizar prácticas de laboratorio

Para convertirte en un experto en la nube se necesita entrenamiento práctico. Una excelente manera de hacerlo es usar [Qwiklabs](https://www.qwiklabs.com). Lo bueno de comprar el curso de Coursera es que los laboratorios con Qwiklabs vienen ya incluidos sin costo. Qwiklabs te da credenciales temporales a Google Cloud Platform (y Amazon Web Services) para que puedas practicar con la realidad, sin simulaciones.

#### 3 . Leer la documentación oficial de Google

Te recomiendo que hagas una guía de repaso del curso por módulo o por tecnología y te remitas a la documentación oficial de cada producto para formar tus propias notas remarcando los detalles técnicos y negocio importantes de cada producto. Ningún curso incluye toda la documentación de cada producto, por lo que solamente tomar el curso no basta, tienes que leer la documentación oficial.

#### 4 . Evalua tu conocimiento

Puedes tomar el examen de prueba que ofrece Google. El examen de práctica de Cloud Architect te permitirá familiarizarte con el tipo de preguntas que podrías encontrar. Puedes probar tus habilidades [siguiendo este enlance](El examen de práctica de Cloud Architect te permitirá familiarizarte con el tipo de preguntas que podrías encontrar ).

También puedes probar con [las preguntas de práctica ](https://www.whizlabs.com/google-cloud-certified-professional-cloud-architect/) en Whizlabs, que son  bastante representativas, en lo personal me gustó mucho su enfoque en los casos de uso. 

Como siempre, lee atentamente las preguntas, por lo general termina en eliminación con dos respuestas que están muy cerca y debes alguna de  ellas.

Después de pasar por estas preguntas de práctica / prueba, sabía que necesitaba reforzar  en  algunos temas, así que mi guía creció aún más. 

## Tips and tricks

EL examen consta de 50 preguntas de opción múltiple y alrededor de 20 preguntas están basadas en los casos de muestra aunque se te presenta esta información durante el examén es ideal conocer los detalles de cada empresa a analizar estos son los links de casa caso de muestra:

* [Caso de éxito de muestra: JencoMart](https://cloud.google.com/certification/guides/cloud-architect/casestudy-jencomart?hl=es-419)
* [Caso de éxito de muestra: Mountkirk Games](https://cloud.google.com/certification/guides/cloud-architect/casestudy-mountkirkgames-rev2?hl=es-419)
* [Caso de éxito de muestra: Dress4win](https://cloud.google.com/certification/guides/cloud-architect/casestudy-dress4win-rev2?hl=es-419)
* [Caso de éxito de muestra: TerramEarth](https://cloud.google.com/certification/guides/cloud-architect/casestudy-terramearth-rev2?hl=es-419)

Te recomiendo que tu misión sea entender casi al 100% los siguientes puntos:

* Diseñar y planear una arquitectura de solución en la nube.
* Gestionar y aprovisionar la infraestructura de la solución en la nube.
* Diseñar para seguridad y cumplimiento.
* Analizar y optimizar procesos técnicos y de negocio.
* Gestionar implementaciones de arquitectura en la nube.
* Asegurar la confiabilidad de soluciones y operaciones.

Recuerda, el curso por sí sólo no es suficiente, pero es un gran punto de partida, lo que si te entrega es una mayor visibilidad de lo que tiene la plataforma de GCP para ofrecer y lo que puedes hacer con ella, pero aun tienes  el trabajo de descubrir formas de aprovechar esos recursos,  conocer a detalle sus capacidades y poder crear soluciones tecnicas y de  negocio en escenarios reales.

Después de haber pasado con éxito el examen, esta sería mi lista de detalles técnicos a repasar:

* **La mayoría de las preguntas tienen las de una respuesta válida pero solo 1 respuesta que sigue las mejores prácticas de GCP.**
* Managed instance groups están cubiertos en gran medida durante el examen. Comprender cómo funciona la división del tráfico con los grupos de instancias administradas y en Appengine.
* Comprender como hacer implementaciones y actualizaciones continuas y en caso de cualquier problema o error, cómo depurar el mismo.
* Google Compute Engine vs. Google App Engine
* VM estándar vs VMs preemtibles
* SSD local vs discos persistentes SSD
* Recuross Globales vs Regionales vs De zona
* Roles de IAM primitivos vs a roles de IAM predefinidos
* App Engine Standard vs. App Engine Flex
* Conocer cuando aplicar las distintas clases de Cloud Storage
* Conocer las herramietas en GCP para hacer limpieza de datos, flujos de procesamiento, exploración de datos, dataflow, dataprep, datalab, datastudio.
* Cómo auditar información y logs. Conocer a detallelas capacidades de  Stackdriver.
* Conocer cuando aplica cada solución de balanceo de carga y su relación con GCE y GKE
* Conocer as principales diferencias de las soluciones de bases de datos en GCP
* Migrar información de clientes onpremise hacia GCP considerando velocidad, tamaño de la información GB, TB y tipos de información como archivos estáticos, VMs, logs y requerimientos de seguridad como cifrado etc.
* Conocer cuando aplica el appliance físico para transferencia de datos hacia GCP.
* Dominar las reglas de firewall, tags y priority levels
* Escalar aplicaciones en GKE y los nodos en si de GKE
* Diferencias entre VPN interconnect y peering. Velocidades de cada uno. Conectar aplicaciones onpremise hacia VPC en GCP
* Temas fuera de GCP: Jenkins, spinnaker, memcached, AB deployments, canary releases, stress tests.
* [Un gran sitio de tutoriales de muchos de estos temas](https://cloud.google.com/docs/tutorials)

## Bonus: Certification Perks

Al pasar el exámen recibiras un código para entrar a la tienda [Certification Perks Webstore](https://shop.googlemerchandisestore.com) y podrás elegir un articulo totalmente gratis incluido el envío, el articulo contará con el badge oficial de la certificación,   puedes elegir entre un hoodie, un pullover o una mochila...=)

![](/uploads/Screenshot-20190408181516-1648x549.png)

Si tienes una duda o comentario respecto a la certificación o  si necesitas ayuda para prepararte, no dudes en contactarme.