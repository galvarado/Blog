+++
categories = ["cloud"]
date = "2018-11-06T08:05:48-06:00"
metaAlignment = "center"
thumbnailImage = "/uploads/cloud_platform_webinar_banner_v2-1.png"
thumbnailImagePosition = "top"
title = "Migrar una VM entre Centros de Datos en Google Cloud"
undefined = ""

+++
Google Cloud está disponible en 17 regiones o centros de datos alrededor del mundo y a su vez, divididos cada uno en zonas, teniendo un total de 52 zonas. En este post explico como migrar una VM de un centro de datos de Google a otro. En mi caso de la  región US-Central que está en **Iowa**  hacia US-East que está en Carolina del Sur. Sin embargo el procedimiento funciona entre cualquier región.

El objetivo es migrar la VM de la siguiente manera:

![](/uploads/GCE.png)

Distinguimos 2 estrategias distintas para la migración:

#### 1 Transferir los datos

Consiste en crear una nueva VM, instalar el software requerido y configurar las aplicaciones para transferir los datos necesarios para ejecutar las aplicaciones.

#### 2. Trasladar las máquinas virtuales

Trasladar totalmente el disco de la maquina virtual y crear una nueva a partir de este disco, preservando software, configuraciones y datos. Esta es la opción más transparente para la aplicación.

En la documentación en linea encontré [ ésta guía ](https://cloud.google.com/compute/docs/instances/moving-instance-across-zones)dónde existe un comando de gcloud para mover una VM de una zona a otra dentro de la misma región, pero no entre regiones. Se menciona que para mover una VM de una región a otra, es necesario hacer un procedimiento manual.

Encontré [esta publicación ](https://stackoverflow.com/questions/36441423/migrate-google-compute-engine-instance-to-a-different-region)en la Biblia (Stack Overflow)  donde sugieren los pasos a seguir, entonces realicé  el procedimiento para realizar la migración manual usando gcloud, [el cliente de Google Cloud.](https://cloud.google.com/sdk/gcloud/)

En resumen los pasos necesarios son:

##### 1. Obtener el nombre del disco origen al cual se realizará el snapshot.

##### 2 Apagar la máquina virtual para realizar el snapshot.

##### 3. Realizar snapshot.

##### 4. Crear imagen usando el snapshot del disco.

##### 5. Lanzar nueva maquina virtual en la zona/región destino

## Procedimiento paso a paso

Esta actividad requiere de una ventana de mantenimiento donde los servicios tendrán un apagado programado. Generalmente debería tomar no más de 30 minutos la migración, pero depende del volumen de la información que está en la VM o del número de VMs a migrar.

Es importante considerar que la IP pública de la VM cambiará a menos de que se tenga contratada una "reserved IP address", esto se debe considerar para cambios necesarios de DNS.

### 1. Obtener el nombre del disco origen al cual se realizará el snapshot

Para listar las caracteristicas de la VM origen:

    $ gcloud compute instances  describe <NAME>

Copiar el nombre del disco, identificado con "deviceName". Sse lee algo similar a esto en el output del comando anterior:

    disks:
    
      deviceName: web01-usc-gc
      index: 0
      interface: SCSI
      kind: compute#attachedDisk
      mode: READ_WRITE
      type: PERSISTENT

### 2 Apagar la máquina virtual para realizar el snapshot.

### 

Para detener la VM:

    $ gcloud compute instances stop <NAME>

Al detener una instancia, Compute Engine envía la señal de apagado ACPI a la instancia. Casi todos los sistemas operativos   stán configurados para realizar un apagado limpio antes de apagarse en respuesta a la señal de apagado. Compute Engine espera un breve tiempo para que el invitado termine de apagarse y luego realiza la transición de la instancia al estado TERMINADO. 

Si la instancia aún se está ejecutando después de período , Compute Engine la termina a la fuerza incluso si la secuencia de comandos de cierre todavía se está ejecutando. Las instancias normales tienen un período de apagado que generalmente dura al menos 90 segundos, pero podría ser más largo.

### 3. Realizar snapshot

Realizar el snapshot del disco origen:

    $ gcloud compute disks snapshot <DISK_NAME> --zone <ZONE>

_  
Donde ZONE es la zona actual donde reside la VM._

Después de esperar y obtener el mensaje de finalización de snapshot, listar los snaps disponibles, deberá estar listado el snap en estado READY

    $ gcloud compute snapshots list

### 4. Crear imagen

Crear la imagen para lanzar la nueva VM en la región destino:

    $ gcloud compute images create [IMAGE_NAME] --source-snapshot [SOURCE_SNAPSHOT]

### 5. Lanzar nueva maquina virtual 

Lanzamos la nueva VM, que tendrá como imagen el disco origen de la VM, con esto preservamos los datos:

Listar las imagenes disponibles:

    $ gcloud compute images list

Crear VM a partir de la imagen recién creada, especificamos la region donde deseamos crear la instancia, en este caso es la region destino de la migración:

    $ gcloud compute instances create <INSTANCE_NAME> --image <IMAGE_NAME> --zone <ZONE>

_  
Donde ZONE es la zona donde queremos migrar la VM. Esta será una zona dentro de la región destino._

Despues de crear la VM, entrar a comprobar que los datos fueron preservados, actualizar la IP en el DNS y comenzar a servir los servicios desde esta instancia.

Una vez comprobado que todo resulto buen, se puede apagar la VM original, esto ya no genera cosots, pero si planeas no volver a encenderl, es mejor eliminarla.

Si te resulta útil, porfavor comparte =)