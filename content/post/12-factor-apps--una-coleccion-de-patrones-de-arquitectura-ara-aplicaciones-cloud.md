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
“The twelve-factor app” es una metodología para construir aplicaciones. Lo podriamos ver como un conjunto de prácticas de desarrollo y arquitectura, que presta especial atención a las dinámicas del escalamiento, evitando el coste de la entropía del software.

Si se siguen estos lineamientos se logra una notable diferencia entre una aplicación que puede funcionar en la nube y otra que está diseñada para aprovechar la nube:

**¿Quién debería leer este documento?**

Cualquier desarrollador que construya aplicaciones y las ejecute como un servicio. Ingenieros de operaciones que desplieguen y gestionen dichas aplicaciones.

**¿Quién escribió este documento?**

Este documento sintetiza toda la experiencia y observaciones del equipo de Ingeniería de Heroku sobre una amplia variedad de aplicaciones SaaS. Es la triangulación entre practicas para el desarrollo de aplicaciones, prestando especial atención a las dinámicas del crecimiento natural de una aplicación a lo largo del tiempo, [evitando el coste de la entropía del software](http://blog.heroku.com/archives/2011/6/28/the_new_heroku_4_erosion_resistance_explicit_contracts/).

**¿Cual es su objetivo?**

Ofrecer un conjunto de soluciones conceptualmente robustas para esos problemas acompañados de su correspondiente terminología.

**¿Porque son importantes?**

Empresas como Facebook, Uber, Netflix, Airbnb y Tesla crecen continuamente, siendo líderes en la industria y dictando pauta en sus modelos de entrega de servicio.

**¿Qué tienen en común estas empresas?**

1. • Velocidad de innovación
2. • Servicios siempre disponibles
3. • Escalabilidad web

_La nube es una evolución natural del software. Las arquitecturas de aplicaciones nativas de la nube son el centro de cómo estas empresas obtuvieron su carácter disruptivo._

## Los 12 factores

### 1. Código base

Utilizar un código base sobre el que hacer el control de versiones y múltiples despliegues. Se utiliza un sistema de control de versiones (por ej. Git). Este código base es único, aunque pueden haber tantos despliegues de la aplicación como sean necesarios. 

### 2. Dependencias

Se deben declarar y aislar explícitamente las dependencias. Una aplicación no debe depender nunca de la existencia explícita de paquetes instalados en el sistema. Esto se hace mediante un manifiesto de declaración de dependencias, usando un gestor de dependencias (por ej. Maven, Rubygems, etc.)

### 3. Configuración

Cualquier configuración que difiere entre ambientes como conexiones, IPs, credenciales para servicios externo o valores de despliegue se inyectan a través de variables de entorno de sistema operativo. No se deben usar configuraciones como constantes dentro del código. La configuración varía en cada despliegue, el código no.

### 4. ”Backing services”

Los servicios externos como bases de datos, colas de mensajes, etc. son recursos conectados, accedidos mediante una URL almacenado en la configuración. Por ejemplo, se debe ser capaz de reemplazar un MySQL local por otra externa sin ningún cambio en el código de la aplicación.

### 5. Construir, distribuir, ejecutar

Separar completamente las fases de construcción, de distribución y de ejecución. En la construcción se traen todas las dependencias y se compilan los binarios para generar un _artifact_. En la distribución se usa esta construcción y se combina con la configuración. Finalmente, en la ejecución, se lanza la aplicación como un conjunto de procesos.

### 6. Procesos

La aplicación se ejecuta como uno o más procesos sin estado, sin compartir nada. Si se requiere un estado, se externaliza a servicios (caché, almacén de objetos, etc.) Por ejemplo, debemos evitar utilizar _sticky sessions_.

### 7. Port binding.

Las aplicaciones cloud-native están completamente autocontenidas y no dependen de un servidor web. La aplicación exporta HTTP como un servicio, siento todo parte de la aplicación y solamente se expone el puerto para atender peticiones.

### 8. Concurrencia

Heredada por el manejo de procesos. Por horizontalidad y concurrencia, los procesos/componentes nunca deberían ser demonios ni escribir archivos PID. En su lugar, se debería utilizar un gestor de procesos del sistema operativo, (por ej. Systemd).

### 9. Desechabilidad

Hacer el sistema más robusto intentando conseguir inicios rápidos y finalizaciones seguras. Se debe poder iniciar o finalizar en el momento que sea necesario. Una aplicación no se puede escalar, implementar, liberar o recuperar rápidamente si no puede comenzar rápidamente y cerrar con gracia. 

### 10. Igualdad entre desarrollo y producción

Se deben poder hacer despliegues continuos, que reducen las diferencias entre los entornos de desarrollo y producción, teniendo en cuenta reducir las diferencias de tiempo. Es vital automatizar el despliegue y construcción adoptando CI/CD.

### 11. Logs

En lugar de administrar archivos de registro, tratar los registros como secuencias de eventos, permitiendo que el entorno de ejecución recolecte, agregue, indexe, y analice los eventos a través de servicios centralizados.

### 12.Procesos de administración

Las tareas administrativas o de gestión, como las migraciones de bases de datos, se ejecutan como procesos únicos en entornos idénticos a los procesos de ejecución de la aplicación. Deben ser tareas automatizadas y supervisadas que tengan un posible punto de retorno.

###### Fuente: [https://12factor.net/](https://12factor.net/ "https://12factor.net/")