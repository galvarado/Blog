+++
comments = "true"
date = "2019-11-07T13:00:00+00:00"
draft = true
image = ""
tags = ["devops", "cloud", "containers", "GCP"]
title = "Desplegar un cluster de Kubernetes en GKE en 15 minutos"

+++
Google Kubernetes Engine (GKE) proporciona un entorno administrado para implementar, administrar y escalar  aplicaciones en contenedores utilizando la infraestructura de Google. Cuando creamos un  entorno de  Kubernetes Engine este se forma de varias máquinas de instancias de Google Compute Engine.  En este post crearemos un cluster de k8s administrado en GKE e implementaremos una aplicación de prueba accediendo a ella en nuestro navegador.

Nota: GKE utiliza las instancias de Google Compute Engine como [nodos del clúster](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#nodes) y cada una se factura según los [precios de Compute Engine](https://cloud.google.com/compute/pricing) 

Los clústeres de Kubernetes Engine funcionan con el sistema de gestión de clúster de código abierto de Kubernetes.

Kubernetes se basa en los mismos principios de diseño que ejecutan los servicios populares de Google y ofrece los mismos beneficios: gestión automática, monitoreo y sondeos de vida para contenedores de aplicaciones, escalado automático, actualizaciones continuas y más. Cuando ejecuta sus aplicaciones en un clúster de contenedores, está utilizando tecnología basada en los más de 10 años de experiencia de Google ejecutando cargas de trabajo de producción en contenedores.

Kubernetes en Google Cloud Platform

Cuando ejecutamos un clúster de Kubernetes Engine,  obtenemos  funciones avanzadas de administración de clúster que ofrece Google Cloud Platform.  Por ejemplo:

* Balanceo de carga para instancias de Compute Engine.
* Grupos de nodos para designar subconjuntos de nodos dentro de un clúster para mayor flexibilidad.
* Escalado automático del número de instancias del clúster.
* Reparación automática de nodos para mantener la salud y disponibilidad del nodo.
* Logging y Monitoreo con Stackdriver para visibilidad.