+++
categories = ["cloud", "architecture"]
date = "2018-07-13T16:36:31-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = ""
thumbnailImagePosition = "top"
title = "12 Factor apps: Una colección de patrones de arquitectura para aplicaciones cloud"
undefined = ""

+++
“The twelve-factor app” es una metodología para construir aplicaciones SaaS.

**¿Quién debería leer este documento?**

Cualquier desarrollador que construya aplicaciones y las ejecute como un servicio. Ingenieros de operaciones que desplieguen y gestionen dichas aplicaciones.

**¿Quién escribió este documento?** 

  
Este documento sintetiza toda la experiencia y observaciones del equipo de Ingeniería de Heroku sobre una amplia variedad de aplicaciones SaaS. Es la triangulación entre practicas para el desarrollo de aplicaciones, prestando especial atención a las dinámicas del crecimiento natural de una aplicación a lo largo del tiempo, [evitando el coste de la entropía del software](http://blog.heroku.com/archives/2011/6/28/the_new_heroku_4_erosion_resistance_explicit_contracts/).

**¿Cual es su objetivo?**

Ofrecer un conjunto de soluciones conceptualmente robustas para esos problemas acompañados de su correspondiente terminología. 

## Los 12 factores