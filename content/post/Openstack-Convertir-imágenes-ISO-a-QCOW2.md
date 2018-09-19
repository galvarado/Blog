+++
categories = ["devops"]
date = "2018-09-19T10:09:00-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = ""
thumbnailImagePosition = "top"
title = "OpenStack: Convertir imágenes ISO a QCOW2"
undefined = ""

+++
En cualquier nube, una instancia (VM) es una máquina virtual alojada en la infraestructura de esta nube, estas instancias, necesitan de una imagen de sistema operativo para arrancar. Una imagen de máquina virtual es un archivo que contiene un disco virtual que tiene instalado un sistema operativo con el cual se puede arrancar. Por lo tanto, las instancias son copias en ejecución de esa imagen.

## Diferencias entre ISO y QCOW2

En la nube, las imágenes de maquina virtual  normalmente NO SON ARCHIVOS ISO. 

El formato ISO es una imagen de disco óptico utilizado para CD y DVD. Como decía, no pensamos en ISO como un formato de imagen de máquina virtual, dado que los ISO contienen sistemas de archivos de arranque para instalar un sistema operativo en algún disco para luego, arrancar desde este disco ya instalado.

Por otro lado que QCOW2 es la partición sistema de archivos donde ya está instalado un sistema operativo y se puede utilizar como plantilla para hacer más instancias del mismo tipo de sistema operativo.

En pocas palabras, ISO es para instalar desde cero un sistema operativo y en QCOW2 ya está instalado el sistema operativo, incluso configurado y con paquetes instalados.

## Crear instancias desde ISO en OpenStack

La forma más sencilla de obtener una imagen de máquina virtual que funcione con OpenStack es descargar una que alguien más ya haya creado. La mayoría de las imágenes contienen el paquete cloud-init para admitir el par de claves SSH y la inyección de datos del usuario. 

Para obtener imagenes de sistemas operativos como CentOS, Ubuntu, RHEL, SuSE, CirrOS, Debian, Fedora, Windows, [aqui se encuentran disponibles para descarga](https://docs.openstack.org/image-guide/obtain-images.html)

Adicionalmente, para realizara personalizaciones y crear imagenes con requisitos más puntales, [esta guía describe cómo obtener, crear y modificar imágenes de máquinas virtuales](https://docs.openstack.org/image-guide/index.html) que son compatibles con OpenStack.

Sin embargo, comúnmente tenemos requerimientos de nuestros clientes que necesitan sistemas operativos que no están en esta lista o el proveedor no cuenta con otro archivo salvo el ISO, algunos casos han sistemas operativos recortados y modificados por los proveedores  o appliances de proveedores como  IBM, Cisco, Oracle, etc.

Para estos casos, seguimos el siguiente procedimiento:

#### Subir imagen ISO

El ISO del cual se desea instalar un Sistema Operativo, se debe subir al catálogo de Glance, en el ejemplo se crea una imagen llaamda EjemploISO, en este caso el nombre de la instancia es VMparaInstalarSO

![](/uploads/Screenshot-20180919121701-945x775.png)

#### Crear instancia para instalar SO

Una vez con la imagen en el catálogo se crea una instancia donde se realizará el procedimiento de instalación del ISO

![](/uploads/Screenshot-20180919121831-941x312.png)

#### Crear volumen para destino del SO

Después de crear la instancia, se creará un volumen para que la instalación use este volumen como sistema de archivos destino. En el ejemplo se crea un volumen llamada DestinoDelSO, con un tamaño de 20 GB. Este tamaño debe ser el necesario e indicado como minimo para que el ISO se pueda instalar. Se debe revisar que requirimientos tiene el ISO que se usa.

  
![](/uploads/Screenshot-20180919121928-720x621.png)

Una vez creado el volumen, lo adjuntamos a la instancia VMparaInstalarSO.

![](/uploads/Screenshot-20180919122614-726x347.png)

Con el volumen adjunto, iniciamos la instancia y realizamos la instalación paso a paso del ISO. Una vez finalizada la instalación el siguiente paso es subir esta instalación que quedó en el volumen como una imagen al catalogo de Glance.

Este punto es el más importante, la VM donde se realizó la instalación no es una VM usable, solo fue usada para instalar ya que si reiniciamos siempre se mostrará el proceso de instalación del ISO.  Esta arrancando siempre desde el ISO y no desde el disco con el SO.

Entonces, para tener una VM usable, apagamos la primera y desadjuntamos el disco.

#### Subir volumen con SO instalado como imagen

Una vez apagada la instancia y el disco libre, lo marcamos como arrancable o booteable, editandolo desde el menú y seleccionando el checkbox correspondiente.

![](/uploads/Screenshot-20180919123112-720x377.png)

El último paso es subir este volumen al catalogo de Glance. En este punto el volumen contiene una instalación del SO deseado, pero para poder crear Vms con el, debe estar disponible como imagen, en el menú seleccionamos la opción de "Subir imagen"

![](/uploads/Screenshot-20180919123133-633x182.png)

Aparece un menú como el siguiente, llenamos los datos y subimos la imagen

![](/uploads/Screenshot-20180919124754-712x394.png)

#### Crear instancia desde nueva imagen de SO

Con esto ya tenemos una imagen en formato QCOW2 de una instalación proveniente de un ISO. Solo resta crear VMs desde esta imagen y no será necesario el ISO puesto que ya está en formato QCOW2.

Si te resulta útil, comparte.