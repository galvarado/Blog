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
Cada vez es más común encontrar en el ecosistema  aplicaciones construidas y entregadas en contenedores. Una de las primeras dudas cuando se trata de migrar a este tipo de arquitecturas es el tema del almacenamiento ya que los contenedores son efímeros, no persistentes, si el proceso del contenedor muere, todos los datos de las aplicaciones residentes se pierden.  
  
Las aplicaciones críticas para el negocio requieren que los datos  permanezcan disponibles más allá de la vida útil del contenedor. La capa de almacenamiento entonces debe ser elástica, aprovisionada  fácilmente y orquestada.

En esta ocasión decidí escribir acerca de las diferentes estrategias que se pueden seguir para construir un ambiente de OpenShift con almacenamiento persistente provisto por Gluster.

## El almacenamiento local no es suficiente. 

Al igual que con las VMS, algunas aplicaciones deben conservar sus estado, datos y configuración. Un ejemplo es un contenedor de base de datos. Este necesita almacenamiento persistente para su almacén de datos (donde la base de datos real vive). 

El primer ejemplo que aprendemos cuando comenzamos con Docker, entorno al almacenamiento, es que podemos usar el host y su almacenamiento, como volumen para nuestros contenedores. Finalmente los datos terminan siendo persistentes en el host. 

Pero cuando usamos una tecnología de orquestación, que es un ejemplo más real donde en realidad no hay un host sino varios que son orquestados, el almacenamiento local no es suficiente porque si el contenedor se mueve a otro host, pierde acceso a los datos. Por tanto se requiere una capa de almacenamiento subyacente para proporcionar características empresariales como las que están disponibles para las aplicaciones  en entornos virtualizados.

Con el fin de abordar el problema de aprovisionamiento, OpenShift  permite  entregar volúmenes desde una amplia gama de plataformas usando plugins. Esto garantiza que no importa donde se ejecute el contenedor (dentro del cluster) podrá acceder a su volumen de almacenamiento persistente. **Los volúmenes persistentes son conexiones  que apuntan a la capa de almacenamiento subyacente.**La capa subyacente que mejor se acopla a OpenShift es Gluster.

La literatura entorno al temas distingue 2 tipos de almacenamiento:

## **Almacenamiento para contenedores**

También conocido como "Container ready storage", esto es esencialmente una configuración donde el almacenamiento es expuesto a un contenedor desde un punto de montaje externo a través de la red. 

La mayoría de soluciones soluciones, incluyendo SDS, SAN o NAS se puede configurar de esta manera utilizando interfaces estándar. Sin embargo, esto  no ofrece  valor adicional ya que pocos almacenamientos tradicionales tienen APIs que pueden ser aprovechados por Kubernetes para otorgar aprovisionamiento dinámico. _Más tarde definimos qué es el aprovisionamiento dinámico._

## **Almacenamiento en contenedores**

 También conocido como "Container native storage" y es almacenamiento desplegado dentro de contenedores, junto a las aplicaciones que se ejecutan en contenedores.

Teniendo los contenedores de almacenamiento en el mismo plano de gestión, se pueden ejecutar las aplicaciones y la plataforma de almacenamiento en el mismo conjunto de infraestructura, lo que reduce el gasto en infraestructura.

Adicional mente los desarrolladores se benefician al poder proveer a las aplicaciones almacenamiento que es altamente elástico y amigable para estos entornos. Con esta solución tenemos almacenamiento con aprovisionamieto dinámico para los contenedores.

## **Aprovisionamiento dinámico de volúmenes**

 Permite que cualquier persona con acceso a la consola de gestión de OpenShift pueda crear volúmenes de almacenamiento bajo demanda. Con esto, los desarrolladores pueden aprovisionar el almacenamiento por su cuenta sin la necesidad de conocer la tecnología subyacente. Los desarrolladores ya no tienen que enviar una solicitud de almacenamiento a un administrador y esperar a que sea atendida.

## Red Hat Gluster Storage

Red Hat Gluster Storage puede configurarse para proporcionar almacenamiento persistente y aprovisionamiento dinámico para  OpenShift. Puede utilizarse desplegado en contenedores "container native " dentro de OpenShift, llamado modo convergente o  sin estar en contenedores, instalado en sus propio nodos "container ready", llamado modo independiente. Podemos identificar otra variante del modo independiente, llamada Standalone.

### 1. Modo convergente

Configuración de un nuevo clúster de GlusterFS alojado de forma nativa. En este escenario, los pods de GlusterFS se implementan en nodos en el clúster OpenShift que están configurados para proporcionar almacenamiento.

![](/uploads/Screenshot-20181129164551-885x666.png)

Imagen 1. Arquitectura de la solución en modo convergente.

### 2. Modo independiente

Configurando un nuevo cluster externo de GlusterFS. En este escenario, los nodos del clúster tienen el software GlusterFS preinstalado pero aún no se han configurado. El instalador se encargará de configurar los clústers para su uso por las aplicaciones OpenShift.

![](/uploads/Screenshot-20181129164603-868x527.png)

Imagen 2 . Arquitectura de la solución en modo independiente y standalone.

### 3. Modo standalone

Usando los clusters existentes de GlusterFS. En este escenario, se supone que uno o más clústeres de GlusterFS ya están configurados. Estos clústeres pueden ser nativos o externos, pero deben ser gestionados por el servicio [heketi](https://github.com/heketi/heketi).

Referencias:

*  [https://docs.openshift.com/container-platform/3.10/install_config/persistent_storage/persistent_storage_glusterfs.html](https://docs.openshift.com/container-platform/3.10/install_config/persistent_storage/persistent_storage_glusterfs.html "https://docs.openshift.com/container-platform/3.10/install_config/persistent_storage/persistent_storage_glusterfs.html")
* [https://github.com/openshift/openshift-ansible/tree/master/roles/openshift_storage_glusterfs](https://github.com/openshift/openshift-ansible/tree/master/roles/openshift_storage_glusterfs "https://github.com/openshift/openshift-ansible/tree/master/roles/openshift_storage_glusterfs")
* [https://www.redhat.com/es/resources/solving-persistent-storage-for-containers-infographic](https://www.redhat.com/es/resources/solving-persistent-storage-for-containers-infographic "https://www.redhat.com/es/resources/solving-persistent-storage-for-containers-infographic")
* [https://www.redhat.com/es/technologies/cloud-computing/openshift-container-storage](https://www.redhat.com/es/technologies/cloud-computing/openshift-container-storage "https://www.redhat.com/es/technologies/cloud-computing/openshift-container-storage")

Si te es de utilidad, por favor comparte =)