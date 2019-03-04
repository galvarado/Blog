+++
tags = ["devops"]
date = "2018-06-08T17:22:44-06:00"
metaAlignment = "center"
image = "/uploads/failure.jpg"
thumbnailImagePosition = "top"
title = "Guia de sobrevivencia DevOps para degradaciones y perdidas de servicio"
undefined = ""
comments=true

+++
Las degradaciones o perdida de nuestro servicio son _mitigables, pero también inevitables_. Diseñar los sistemas para manejar las fallas es el punto neurálgico de cualquier servicio, es por esto que tenemos que crear arquitecturas diseñadas para fallar, les recomiendo [ésta](https://web.archive.org/web/20160514014155/http://techblog.netflix.com/2010/12/5-lessons-weve-learned-using-aws.html) lectura de Netflix, donde mencionan que la mejor manera de evitar una falla, es fallar constantemente. 

Tener una arquitectura diseñada para fallar, quiere decir que podrá sobrevivir a la mayoria de los problemas. Aun así siempre existen escenarios en los que no pensamos, incidentes que nunca habíamos manejado e incluso bugs de software  que resultan en downtime para nuestro servicio.

Nadie tiene un 100% de uptime en todo su servicio. Amazon, Google, Netflix, cualquiera compañia que podamos mencionar sufre outages y downtimes. Aun así después de diseñar nuestra arquitectura en alta disponibilidad, escalable y robusta, podemos estar seguros que fallará. ¿Entonces que haremos? **Prepararnos para fallar.**

No solo son cuestiones de tecnología sino también de _los procesos, las herramientas y nuestras personas_. **Sí las alertas de nuestro servicio nos provocan pánico, algo estámos haciendo mal.**

## 1) Procesos

**Documentación:** De fácil acceso, navegable y actualizada. Listas de hostnames, IPs, roles, versiones de software, matrices de resolución. Esto nos da la velocidad necesaria para actuar y también muy importante contar con diagnosticos anteriores e historial de resoluciones. 

**Fallas inesperadas:** siempre ocurren, si algo puede salir mal, va a salir mal. ¿Que procedimiento tenemos si hay una catastrofe climática en el datacenter? ¿Que sucede si estamos hosteando servicios en AWS y ellos sufren un ataque o incidente relevante?

**Manejo de alertas:** Algunos odian ser contactados en caso de desastre, otros lo amamos. Lo peor de un incidente es desconocer que está sucediendo. ¿Cuales seran las vias de comunicación? ¿Que procede en caso de recibir una alerta? ¿Que clasificación tiene esa alerta?

## 2)Herramientas

**Sistemas de monitoreo**: Debemos medir todo, pues lo que no se mide no se controla. Monitorear desde la perifería es escencial, pero también lo debemos hacer en el interior de nuestra arquitectura. Definir los umbrales de alertas es lo más importante.

**Cambios rápidos:** Indispensable contar con un sistema de gestion de configuración, _puppet, chef, ansible, saltstack_ o cualquiera que permita que podamos cambiar confiuraciones de una manera controlada, ágil y con posible rollback. Nunca seremos tan rapidos como un mismo sistema, _que mejor que un sistema para arreglar otro._

**Canal de comunicación con el cliente:** No hay nada peor que ser el cliente de un servicio que se va abajo y no tener idea si alguien está atendiendo el incidente o no. Debemos establecer un sistema de gestión de tickets, cuentas de correo, lineas telefónicas y páginas de status.

## 3) Personas

**Escalación y guardia:** Cuando algo salga mal, debemos asegurarnos que todo el equipo sabrá que hacer y conozcan los niveles de escalación. Además es de vital importancia contar un personal de guardia, para atender solicitudes mientras no es horario laboral. Recuerda que hay servicios que no paran nunca, y van a fallar.

**El soporte jamás debe ser personalizado:** cualquiera debe ser capaz de atender una alerta, por ello es de vital importancia la documentación y retroalimentación.

## Postmortem

**El reporte final es la oportunidad de volver a ganar la confianza.** Si seguimos los pasos adecuados y proveemos la información necesaria durante los incidentes, nuestros clientes sabrán que está pasando. Debido a eso es recomendable generar un reporte explicando ¿Que fue lo que sucedió?, ¿Cual fue la causa del error?, ¿Que impacto tuvo en el servicio? y lo más importante de todo, ¿Que haremos para prevenir que vuelva a suceder?

Las interrupciones de servicio indican que tenemos un error y es importante que informemos que ese error este reparado o está en proceso de ser reparado. Las partes clave de un reporte postmortem serían:

* Abstracto
* Cronología de eventos
* Solución
* Causa e impacto
* Medidas preventivas y correctivas

Esta es la manera en la que mediante metodologías DevOps podemos manejar una interrupción de nuestro servicio, mo significa que sea la única así que me gustaría preguntarte, y tu ¿Como manejas las interrupciones de tu servicio?