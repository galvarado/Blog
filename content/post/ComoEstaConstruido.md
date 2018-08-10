---
title: Cómo está construido este Blog
date: 2018-05-11 00:00:00 +0000
categories:
- arquitectura
autoThumbnailImage: false
thumbnailImagePosition: top
thumbnailImage: images/build.jpg
metaAlignment: center

---
Como primer entrada, me gustaría compartir como está construido este blog. Los blogs anteriores que tuve estuvieron siempre desplegados en Digital Ocean y usé Wordpress, está vez elegí desplegar un blog completamente estático. 

<!--more-->


## Hugo como generador de sitios estáticos

Como CMS/Generador elegí [Hugo](https://gohugo.io/) básicamente por estar escrito en [GO/Golang](https://golang.org/) (Ya que estoy por aprender este lenguaje).

Piensa en el primer sitio web que construiste. La mayoría de los desarrolladores comenzamos creando una serie de páginas en HTML individuales usando imágenes, CSS y tal vez un poco  de JavaScript. Solo teniamos que colocar estos archivos en un servidor web. La vida era simple.

Las dificultades surgen a medida que el sitio o la aplicación se vuelve más grande y más compleja. Comenzamos a usar algun lenguaje del lado del servidor pero de pronto. el servidor cada vez esta haciendo más trabajo y el rendimiento puede verse afectado. Conforme crece, tenemos más puntos de falla. Una actualización de software o una falla en la base de datos puede hacer que la aplicación tenga perdida de servicio.

En cambio servir  un sitio estático es extremadamente rápido porque todo lo que el servidor web necesita hacer es devolver un archivo. También podemos asegurarnos de que el sitio esté perfectamente optimizado antes de implementarlo. Hacemos esto ejecutando todo el código fuente a través de minificadores, optimizando las imágenes, usando herramientas para eliminar CSS no utilizados y otras técnicas.

Los generadores estáticos, mediante algún motor nos ayudan a crear todos los archivos estáticos para desplegarlos facilmente.

## Netlify como CDN

El despliegue está hecho usando [Netlify](https://www.netlify.com) un CDN para sitios estáticos que se integra con Github. Este CDN lo he usado anteriormente para desplegar en la empresa ya que nos apegamos al JAM Stack - JavaScript, APIs and Markup. Es el stack de mayor crecimiento para construir aplicaciones web, significa no más servidores, hostear todo el front-end en un CDN y usar APIs para cualquier parte dinámica.

Con Netlify simplemente hacemos push del repositorio de  nuestro sitio a su CDN ya que está integrado con Github. Después de un git push, la versión más nueva está disponible de inmediato en todas partes .

Netlify tiene muchas funciones como protección DDoS, snapshot, control de versiones y reversiones, invalidación de caché instantánea, alojamiento de DNS, registro de dominios, etc. Se puede  consultar más funciones de Netlify [aquí](https://www.netlify.com/features/)


## Small footprint

La elección la hice ya que está ocasión no quiero pasar tiempo admistrando una instancia cloud más y tampoco administrar un Wordpress y lo que eso implica:


1. Una máquina ejecutando tu distribución preferida de Linux
2. Un servidor web que ejecuta Nginx o Apache
3. PHP con sus extensiones asociadas y configuraciones de servidor web
4. MySQL
5. WordPress (obviamente)
6. Todos los plugins que necesitas 
7. Un tema de wordpress 

 Sé que podría haber elegido un servicio de Wordpress-as-a-service, pero incluso eso requiere cierta operación además de que las plataformas de esa naturaleza incrementan costos.

 Eliminando todos los puntos anteriores se obtiene lo que se llama un "small footprint" y eso permite que las aplicaciones sean migradas más facilmente y tengan mejor escalabilidad (Aunque en este caso es un simple blog, puede ser todo un proyecto en AngularJS/ReactJS que sirva de UI para una aplicación que exponga una API escrita en Python/Ruby por poner un ejemplo)