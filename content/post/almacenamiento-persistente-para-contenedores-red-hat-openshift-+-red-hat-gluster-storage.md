+++
categories = ["arquitectura"]
date = "2018-11-29T13:24:03-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = "/uploads/container_storage.png"
thumbnailImagePosition = "top"
title = "Almacenamiento persistente para contenedores: Red Hat OpenShift + Red Hat Gluster Storage"
undefined = ""

+++
Cada vez es más común encontrar en el ecosistema  aplicaciones construidas y entregadas en contenedores. Una de las primeras dudas cuando se trata de migrar a este tipo de arquitecturas es el tema del almacenamiento ya que los contenedores son efímeros, no persistentes, si el proceso muere o el contenedor es reiniciado, todos los datos de las aplicaciones residentes se pierden.  
  
Las aplicaciones críticas para el negocio requieren que datos  permanezcan disponibles más allá de la vida útil del contenedor. La capa de almacenamiento entonces debe ser elástica, aprovisionada  fácilmente y orquestada.

En esta ocasión decidí escribir acerca de las diferentes estrategias que se pueden seguir para construir in ambiente de OpenShift con almacenamiento persistente provisto por Gluster.

OpenShift

Gluster

Arquitectura

Tipos de despliegue