+++
comments = "true"
date = "2019-10-09T05:00:00+00:00"
image = "/uploads/GoogleCloudLoadBalancers.png"
tags = ["architecture", "cloud", "GCP"]
title = "Comparación de Balanceadores de carga en Google Cloud: HTTP(s) vs SSL Proxy vs TCP Proxy vs Internal vs Network vs Internal HTTP(S)"

+++
En Google Cloud Platform contamos hoy en día con 6 diferentes balanceadores de carga disponibles para cada caso o situación. En este post describiré las características y diferencias entre ellos así como una guía de apoyo para saber elegir el que mejor se adapta a nuestras necesidades de arquitectura.

## Un breve recordatorio a los balanceadores de carga

El balanceo de carga se refiere a la distribución eficiente del tráfico de red entrante en un grupo de servidores de backend. Las aplicaciones de alto tráfico deben atender millones de solicitudes concurrentes de usuarios o clientes y devolver una respuesta correcta de manera rápida y confiable.

Para escalar de manera rentable y cumplir con estos volúmenes, la mejor práctica generalmente requiere agregar más servidores.

![](/uploads/Untitled-1.png)

Un balanceador de carga actúa como el "agente de tránsito" frente a los servidores y enruta las solicitudes de los clientes a los servidores capaces de satisfacer esas solicitudes para maximizar la velocidad y la utilización de la capacidad garantizando que ningún servidor trabaje demasiado.

Si un solo servidor deja de funcionar, el balanceador de carga redirige el tráfico a los servidores en línea restantes. Cuando se agrega un nuevo servidor al grupo de servidores, el balanceador de carga comienza automáticamente a enviarle solicitudes.

Estos Realizan las siguientes funciones:

● Distribuye solicitudes de los clientes de manera eficiente en varios servidores.

● Asegura alta disponibilidad y confiabilidad enviando solicitudes solo a servidores que están en línea

● Brinda la flexibilidad de agregar o restar servidores según lo exija la demanda

## Cloud Load Balancers en GCP

Existen 6 soluciones disponibles, cree una tabla de resumen basada en la documentación oficial de GCP para poder contrastar cada solución:

![](/uploads/LoadbalancersTable.png)

Para decidir cual Balanceador de carga se adapta mejor a nuestra implementación de debemos responder a los siguientes aspectos:

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

**TCP**: casi cualquier cosa donde tenga que obtener todos los datos transmitidos:

Ejemplos

* World Wide Web(HTTP)
* E-mail - SMTP para enviar - IMAP/POP Para recibir
* File Transfer Protocol (FTP)
* Secure Shell (SSH)

_Nota: Aunque HTTP(S) es tráfico TCP, si nuestras aplicaciones usan esta comunicación se deben elegir los balanceadores HTTP(S) Global o interno._

## Tipos de Cloud Balancers en GCP

### HTTP(S) load balancing

* Proporciona equilibrio de carga global para solicitudes HTTP (S) destinado a las VMs.
* Admite direcciones IPv4 e IPv6 para el tráfico del cliente.
*  Utiliza grupos de instancias para dirigir el trafico a las instancias.
* 

Las solicitudes HTTP se pueden equilibrar en función de los puertos:

*  80
* 8080

Las solicitudes HTTPS se pueden equilibrar en el puerto de carga:

*  443

Podemos configurar reglas de URL para enrutar algunas URL a un conjunto de instancias y enrutar otras URL a otras instancias.

Las solicitudes siempre se enrutan al grupo de instancias más cercano al usuario, siempre que ese grupo tenga suficiente capacidad y responda ok. Si el grupo más cercano no tiene suficiente capacidad, la solicitud se envía al grupo más cercano que sí tiene capacidad