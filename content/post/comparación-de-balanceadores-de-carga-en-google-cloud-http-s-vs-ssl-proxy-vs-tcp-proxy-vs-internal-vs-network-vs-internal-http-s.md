+++
comments = "true"
date = "2019-10-09T05:00:00+00:00"
image = "/uploads/GoogleCloudLoadBalancers.png"
tags = ["architecture", "cloud", "GCP"]
title = "Comparación de Balanceadores de carga en Google Cloud: Global HTTP(s) vs SSL Proxy vs TCP Proxy vs Networl load balancer vs Internal TCP/UDP vs Internal HTTP(S)"

+++
En Google Cloud Platform contamos hoy en día con 6 diferentes balanceadores de carga disponibles para cada caso o situación. En este post describiré las características y diferencias entre ellos así como una guía de apoyo para saber elegir el que mejor se adapta a nuestras necesidades de arquitectura.

## Un breve recordatorio a los balanceadores de carga

El balanceo de carga se refiere a la distribución eficiente del tráfico de red entrante en un grupo de servidores de backend. Las aplicaciones de alto tráfico deben atender millones de solicitudes concurrentes de usuarios o clientes y devolver una respuesta correcta de manera rápida y confiable.

Para escalar de manera rentable y cumplir con estos volúmenes, la mejor práctica generalmente requiere agregar más servidores.

![](/uploads/Untitled-1.png)

Un balanceador de carga actúa como el "agente de tránsito" frente a los servidores y enruta las solicitudes de los clientes a los servidores capaces de satisfacer esas solicitudes para maximizar la velocidad y la utilización de la capacidad garantizando que ningún servidor trabaje demasiado.

Si un solo servidor deja de funcionar, el balanceador de carga redirige el tráfico a los servidores en línea restantes. Cuando se agrega un nuevo servidor al grupo de servidores, el balanceador de carga comienza automáticamente a enviarle solicitudes.

Estos Realizan las siguientes funciones:

* Distribuye solicitudes de los clientes de manera eficiente en varios servidores.
* Asegura alta disponibilidad y confiabilidad enviando solicitudes solo a servidores que están en línea
* Brinda la flexibilidad de agregar o restar servidores según lo exija la demanda

## ¿Cómo elegir el Cloud Load Balancer correcto?

Existen 6 soluciones disponibles, cree una tabla de resumen basada en la documentación oficial de GCP para poder contrastar cada solución:

![](/uploads/LoadbalancersTable.png)

Para decidir cual Balanceador de carga se adapta mejor a nuestra implementación  debemos responder a los siguientes cuestionamientos:

* ¿Necesito balanceo de carga global o regional?
* ¿El tráfico es externo o  interno?
* ¿Qué tipo de tráfico voy a balancear?

**Balanceo de carga global versus regional**

Utilizar el balanceo de carga global cuando los backends se distribuyen en varias regiones, los usuarios necesiten acceso a las mismas aplicaciones y contenido, y se desea proporcionar acceso utilizando una única dirección IP de difusión ilimitada. El balanceo de carga global también puede proporcionar la terminación de IPv6.

Utilizar el balanceo de carga regional cuando los backends estén en una sola región y solo se requiere IPv4.

**Balanceo de carga externo versus interno**

Los balanceadores carga externos distribuyen el tráfico proveniente de Internet hacia la red VPC en GCP.

Los balanceadores de carga internos distribuyen el tráfico generado dentro de la red VPC en GCP y son destinados para uso interno.

**Tipo de Tráfico**

¿El tráfico a balancear es HTTP(S), UDP o TCP?

Analogía: UDP es dejar una carta a la oficina de correos. TCP es enviar una carta con un acuse de recibo a la oficina de correos, el administrador de correo organizará las cartas en orden de envío y así las entregará.

**UDP**: cualquier cosa donde no te importe demasiado si obtienes todos los datos siempre

Ejemplos:

* Tunneling / VPN
* Transmisión de video (los cuadros perdidos están bien)
* Juegos en linea a los que no les importa si recibes todas las actualizaciones
* Domain Name System (DNS)
* Voice over IP (VoIP)

**TCP**: casi cualquier cosa donde tenga que obtener todos los datos transmitidos

Ejemplos

* World Wide Web(HTTP)
* E-mail - SMTP para enviar - IMAP/POP Para recibir
* File Transfer Protocol (FTP)
* Secure Shell (SSH)

_Nota: Aunque HTTP(S) es tráfico TCP, si nuestras aplicaciones usan esta comunicación se deben elegir los balanceadores HTTP(S) Global o interno._

## Tipos de Cloud Balancers en GCP

### HTTP(S) load balancing

* Proporciona balanceo de **carga global para tráfico exerno,** para solicitudes HTTP (S) destinado a las VMs.
* Admite direcciones IPv4 e IPv6 para el tráfico del cliente.
* Utiliza grupos de instancias para dirigir el trafico a las instancias.

Las solicitudes HTTP se pueden equilibrar en función de los puertos 80 y 8080. Las solicitudes HTTPS se pueden equilibrar en el puerto  443.

Podemos configurar reglas de URL para enrutar algunas URL a un conjunto de instancias y enrutar otras URL a otras instancias.

Las solicitudes siempre se enrutan al grupo de instancias más cercano al usuario, siempre que ese grupo tenga suficiente capacidad y responda ok. Si el grupo más cercano no tiene suficiente capacidad, la solicitud se envía al grupo más cercano que sí tiene capacidad.

[https://cloud.google.com/load-balancing/docs/https/](https://cloud.google.com/load-balancing/docs/https/ "https://cloud.google.com/load-balancing/docs/https/")

### SSL Proxy

* **Destinado al tráfico no HTTP (S) pero que si que utiliza SSL**
* Para el tráfico HTTP (S), se debe usar la solución de anterior
* Admite direcciones IPv4 e IPv6 para el tráfico del cliente

Realiza el balanceo de carga **global para tráfico externo** con SSL, enrutando clientes al la VM más cercana con capacidad, similar a lo que hace HTTP (S) Load Balancing . Se puede configurar como un servicio de  balanceao global.

Las solicitudes de IPv6 del cliente finalizan en la capa de balanceo de carga global y luego se representan sobre IPv4 a sus backends

_¿Cuándo debo usar el balanceador de carga HTTPS en lugar del balanceador de carga proxy SSL?_

Aunque el proxy SSL puede manejar el tráfico HTTPS, HTTPS Load Balancing tiene características adicionales que lo convierten en una mejor opción en la mayoría de los casos.

El equilibrio de carga HTTPS tiene la siguiente funcionalidad adicional:

* Negocia HTTP / 2 y SPDY / 3.1
* Rechaza solicitudes o respuestas HTTP no válidas
* Reenvía solicitudes a diferentes grupos de instancias en función del host y la ruta URL
* Se integra con Cloud CDN

El equilibrio de carga de proxy SSL para Google Cloud se puede usar para otros protocolos que usan SSL, como Websockets e IMAP sobre SSL.

[https://cloud.google.com/compute/docs/load-balancing/tcp-ssl/](https://cloud.google.com/compute/docs/load-balancing/tcp-ssl/ "https://cloud.google.com/compute/docs/load-balancing/tcp-ssl/")

###   
  
TCP Proxy

* **Destinado a tráfico no HTTP y sin SSL.**
* Permite usar una sola dirección IP para todos los usuarios en todo el mundo
* Enruta automáticamente el tráfico a las instancias más cercanas al usuario

Realiza el balanceo de carga **global para tráfico externo** . Admite direcciones IPv4 e IPv6 para tráfico de clientes. Las solicitudes de IPv6 del cliente finalizan en la capa de equilibrio de carga global, luego proxy sobre IPv4 a sus backends. Se puede configurar como un servicio de balanceo de carga global.

[https://cloud.google.com/compute/docs/load-balancing/tcp-ssl/tcp-proxy](https://cloud.google.com/compute/docs/load-balancing/tcp-ssl/tcp-proxy "https://cloud.google.com/compute/docs/load-balancing/tcp-ssl/tcp-proxy")

###   
Network Load Balancer

El balanceador de carga de red es un balanceador de carga **regional y no proxy**. Se puede usar usar para **tráfico externo o interno** y se usa para la carga de los siguientes tipos de tráfico:

* UPD
* TCP
* SSL

Usado para **tráfico UDP y tráfico TCP/SSL** en puertos que no son compatibles con los balanceadores de carga de SSL proxy y TCP proxy.

Este es un balanceador cargade carga de paso. No hace proxy a las conexiones de los clientes.

Utilizamos este balanceador de carga en las siguientes circunstancias:

* Necesitamos balancear tráfico UDP o un puerto TCP que no sea compatible con las opciones anteriores.
* Se deben reenviar los paquetes originales, es decir sin proxy.
* Contamos con una configuración existente que utiliza un balanceador de carga de paso y deseamos migrarla sin cambios.

Nota: la autogestión de los certificados SSL del balanceador se debe realizar ya que los certificados SSL administrados por Google solo están disponibles para HTTPS y SSL Proxy 

[https://cloud.google.com/compute/docs/load-balancing/network/](https://cloud.google.com/compute/docs/load-balancing/network/ "https://cloud.google.com/compute/docs/load-balancing/network/")

###   
  
Internal TCP/UDP 

El balanceador de carga TCP / UDP **interno** es regional y permite ejecutar y escalar  servicios detrás de una dirección IP da privada que solo es accesible  entre las instancias de la misma región donde está el balanceador, en la red VPC utilizando una **dirección IP privada (RFC 1918).**

El alcance de este balanceador interno es **regional, no global.** Esto significa que no puede abarcar varias regiones. Dentro de una sola región,da servicio a todas las zonas. 

Podemos utilizar este balanceador TCP / UDP interno junto con otros balanceadores de carga, como HTTP (S) donde al nivel web utilizamos el balanceador externo, que luego depende de los servicios detrás del balanceador  interno.

[https://cloud.google.com/load-balancing/docs/internal/](https://cloud.google.com/load-balancing/docs/internal/ "https://cloud.google.com/load-balancing/docs/internal/")

### Internal HTTP(S)

El balanceador de carga interno HTTP (S) es **regional y no global.**  Destinado para **tráfico interno.** Se ubica  en la de capa 7 y  está basado en proxy. Permite ejecutar y escalar  servicios detrás de una dirección IP de a privada que solo es accesible en la región donde está el balanceador, enla red VPC.

Podemos usar este balanceador en conjunto con otros en una aplicación tradicionales de 3 niveles (3 tier):

* Nivel web: el tráfico ingresa desde Internet y se balancea mediante  HTTP (S) global y externo.


* Nivel de aplicación: el nivel de aplicación se escala utilizando el balanceador de carga HTTP (S) interno regional.
* Nivel de base de datos: el nivel de base de datos se escala utilizando el balanceador de carga TCP / UDP interno.

[https://cloud.google.com/load-balancing/docs/l7-internal/](https://cloud.google.com/load-balancing/docs/l7-internal/ "https://cloud.google.com/load-balancing/docs/l7-internal/")

## Flujo de decisión

Basado en la documentación oficial, hice una traducción del flujo de decisión que responde a las 3 preguntas que debemos responder para elegir el balanceador correcto:

* ¿Necesito balanceo de carga global o regional?
* ¿El tráfico es externo o  interno?
* ¿Qué tipo de tráfico voy a balancear?

![](/uploads/LoadbalancersGoogleCloudPlatform.png)

Si te es útil esta información, por favor comparte =)