---
title: "Modelo de madurez de una aplicación nativa de nube"
date: 2018-05-21
categories:
- arquitectura
- cloud
- devops
autoThumbnailImage: false
thumbnailImagePosition: "top"
thumbnailImage: images/tech.jpg
metaAlignment: center
---

¿Cómo se que tan madura es mi aplicación en terminos de nube? ¿Cual debería ser mi objetivo para explotar todas las ventajas de la nube? Estoy prerado material para un curso que dictaré en Santiago de Chile para uno de nuestros clientes y estoy agregando el modelo propuesto por la Open Datacenter alliance que leí hace unos meses, ellos en una publicación "Architecting Cloud Aware Applications" recomiendan las mejores practicas para arquitecturar una aplicación en la nube y describen un modelo para evaluar la madure que me gustaría compartir ya que no hay mucha informaciń en español al respecto...



<!--more-->

##  Niveles del modelo de madurez

El modelo es una forma simple de evaluar el nivel de madurez en la nube de nuestra aplicación. El modelo de madurez sugiere cambios que pueden implementarse para aumentar la resiliencia, flexibilidad y escalabilidad de la aplicación. En este modelo hay cuatro niveles para el modelo de madurez con el nivel 3 que representa el nivel más alto de madurez y el nivel 0 que representael nivel más bajo.

En la siguiente tabla se resumen las caracteristicas de cada nivel:  

{{< image classes="fancybox enter" src="/images/tabla_madurez.png" title="Tabla de madurez de aplicaciones nativa de nube" >}}



### Nivel  0: Aplicación Virtualizada.

El nivel 0 es el nivel de madurez más bajo y menos sofisticado. Una aplicación en este nivel solo se ejecuta en un recurso virtualizado, como
una Máquina virtual. Las aplicaciones se instancian desde una imagen o usando scripts en bash/ansible/puppet/chef. Una caracterísitica es que estas aplicaciones tienen muchas dependencias o mejor dicho, están fuertemente acopladas, con dependencias explícitas entre todos los componentes de la aplicación.

El objetivo principal en este nivel es poder instalar la aplicación de manera fácil y rápida en diferentes tipos de máquinas virtuales o instancias de nube. Con esto logramos llegar a un ambiente 100% Virtual y proveer el HA desde la aplicación y no desde sus compoenentes de Hardware, como ocurre en una aplición tradicional o legacy. Si partimos desde una aplicación legacy, este es nuestro primer objetivo, llegar al nivel 0.

### Nivel  1: Aplicación debilmente acoplada.

El nivel 1 introduce el concepto de acoplamiento debil o flexible para abordar las limitaciones del nivel 0. Esto significa que los componentes no tienen una fuerte dependencia entre sí, de modo que si un componente falla, otros componentes no se ven afectados y la aplicación puede continuar funcionando normalmente.

El debil acoplamiento nos ayuda también ara hacer que sea más fácil escalar la aplicación, al permitir que los componentes operen de forma asíncrona. Esto lo podemos lograr mediante varias estrategías desde la arquitectura de software de la aplicación o también desde la arquitectura de infraestructura, una de ellas es la separación de cómputo y almacenamiento para que las aplicaciones se vuelvan agnósticas al mecanismo de almacenamiento subyacente, lo que permite que el almacenamiento se escale y se administre independientemente de los recursos de computo. Desacoplar el almacenamiento significa separar todo el almacenamiento, incluidos los datos de registro (logs) y archivos configuración, no solo los datos que el servicio consume o administra. Esto es fundamental para tener la capacidad de llegar al  Nivel 2.

### Nivel  2: Aplicación desacoplada.

Para alcanzar este nivel, la aplicación debe estar totalmente desacoplada de la infraestructura. Los servicios deben ser diseñados como stateless.  Los contenedorescomo Docker, proporcionan una forma de desacoplar componentes de la aplicaciones de la infraestructura. En este nivel, cada servicio de aplicación debe ser elástico (es decir, puede ampliarse y reducirse independientemente de otros servicios) y resistente (es decir, tiene múltiples instancias y puede sobrevivir a fallas de instancias). La aplicación también debe diseñarse para que las fallas en un servicio no entren en cascada a otros servicios.

La arquitectura de  Microservicios es un buen ejemplo de una arquitectura de aplicaciones en este nivel.

### Nivel 3: Aplicación adaptativa

En este nivel, la aplicación puede detectar o anticipar cambios y reaccionar ante ellos de manera totalmente automática. Por ejemplo, Netflix usa un algoritmo predictivo de escalado automático. Las aplicaiones diseñadas en este nivel explotan completamente las cualidades  de un entorno de nube. Aplicaciones en este nivel de la madurez puede migrar sin problemas de un proveedor de nube a otro, parcial o completamente, sin interrupción en el servicio.

El documento de ODCA también habla sobre la migración dinámica entre proveedores. Este es un objetivo deseable, sin embargo, la realidad actual es que la dependencia en  cada proveedor de la nube es bastante. Una razón por la que los contenedores de aplicaciones, como Docker, se han vuelto tan populares rápidamente es que prometen facilitar el desafío de portabilidad en la nube, pero todavía son una pequeña pieza del rompecabezas general. Se necesita mucho más para la verdadera portabilidad de la aplicación entre los proveedores. Sin embargo, mientras más cerca estemos y menos interaccipones humanas se necesiten, estaremos más cerca de alcanzar este nivel.