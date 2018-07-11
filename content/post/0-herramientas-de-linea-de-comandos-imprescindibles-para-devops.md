+++
categories = []
date = "2018-06-29T11:57:32-06:00"
metaAlignment = "center"
thumbnailImage = "/uploads/devops.jpg"
thumbnailImagePosition = "center"
title = "20 herramientas de línea de comandos imprescindibles para DevOps"
undefined = ""

+++
Una gran parte del mundo DevOps consiste en mantener la operación continua de las plataformas, una gran parte es desarrollar y mantener las aplicaciones, pero también está la infraestructura. Es difícil monitorear y debbugear problemas de performance, pero con las herramientas indicadas, en el momento justo, la tarea puede ser más sencilla. Aquí mi lista de herramientas que probablemente has escuchado, otras no sabias que existian y seguro otras más que ya estás usando:

### _1.- top_

Con TOP podemos ver en tiempo real un listado de los procesos que se están ejecutando en el sistema  además del porcentaje de uso de Cpu y Memoria que están utilizando, ID y usuarios que lo están ejecutando entre otros.

El output del comando se divide en dos partes, la primer parte muestra información como  el Uptime del servidor, número de usuarios conectados y load average. En la siguiente línea podemos ver el número de procesos ejecutándose en el sistema, así como el uso de disco, memoria y cpus.

En la otra parte podemos ver una lista de procesos, que pueden ser ordenados por uso de cpu o memoria, lo que es una excelente ayuda para detectar procesos que consumen excesivos recursos en el servidor.

### _2.- htop_

Básicamente es lo mismo que top, pero mejorado. A diferencia de top, htop proporciona una lista completa de los procesos en ejecución, en lugar de los procesos que más recursos consume. Htop utiliza colores y proporciona información visual, es una interfaz tipo cursor o ncurses. Adicionalmente desde htop se pueden ejecutar cmandos  “kill” entre otros.

### 

### _3.- iotop_

El comando iotop nos permite monitorear  las entradas y salidas (I/O) del kernel mostrando en una tabla el uso actual de las mismas por los diferentes procesos o subprocesos en el sistema.

El comando iotop  muestra columnas para el ancho de banda de I/O de lectura y escrita por cada proceso/hilo durante el periodo de muestreo, para cada proceso, se muestra su I/O el ancho de banda total de I/O leído y escrito durante el período.

### _4.- ntop_

Con esta herramienta podremos realizar análisis del tráfico de red y  observar cómo esta siendo utilizado nuestro ancho de banda para determinar posibles abusos, vulnerabilidades o fallos en nuestro esquema de red y servicios para tomar las decisiones preventivas o correctivas necesarias para preservar y mejorar la calidad de los servicios de red.

Genera estadísticas sobre de la red incluyendo actividad IP por IP y además cuenta con interfaz web.

### 

### _5.- ethtool_

Con ehtool obtenemos muchas herramientas para gestionar nuestras tarjetas de red, permite modificar y mostrar la configuración de la tarjeta, por ejemplo podemos cambiar la velocidad, el tipo de duplex. Algo curioso pero útil es que también podemos generar un blink en la luz de la interfaz, para reconocerlas fácilmente cuando estemos trabajando con un servidor con múltiples tarjetas.

### 

### _6.- iptraf_

E una utilidad basada en ncurses y lo que realiza es interceptar los paquetes que se están transfiriendo en la red para luego brindarnos información sobre los mismos. Incluye estadísticas de interfaz general detallado mostrando IP, TCP, UDP, ICMP, no-IP y otros paquetes IP, errores checksum IP, actividad del interface, contenido del tamaña del paquete.

Se puede ejecutar tanto en modo interactivo como en modo desatendido (batch). Permite grabar Logs.  y soporta redes Ethernet, FDDI, ISDN, SLIP y PPP además utiliza el built-in interface de socket raw del kernel Linux, permitiendo que el sea usado en una amplia gama de placas de redes soportadas.

### _7.- traceroute_

Traceroute es una consola de diagnóstico que permite seguir el camino de los paquetes que vienen desde un host (punto de red). Se obtiene además una estadística de latencia de red de esos paquetes, lo que viene a ser una estimación de la distancia a la que están los extremos de la comunicación.

Cuando necesitamos determinar un problema en el camino que siguen los paquetes de red desde un equipo a otro es muy probable que las comunicaciones entre equipos no vayan directas y siempre atraviesan diversos dispositivos como routers o servidores, si tenemos un problema con esta herramienta podemos verificar en qué momento sucede el problema y así intentar encontrar la solución más adecuada.

Un ejemplo es realizar un traceroute a google.com

### _8.- netstat_

Netstat permite monitorear y conocer de todas las conexiones establecidas entre nuestro equipo y el mundo exterior. Podemos  ver, conocer, detectar e identificar las conexiones activas establecidas con el exterior, tanto entrantes como salientes, su origen y dirección IP. Además podemos  saber los puertos que tenemos abiertos a la escucha y saber si tenemos procesos que establezcan contacto con un host remoto.

Por ejemplo podemos ver las conexiones para el protocolo especificado con el argumento ; el protocolo puede ser TCP o UDP. También podemos ver la tabla de enrutamiento o ruteo. Equivale al comando route print.

### _9.- nmap_

El viejo y conocido nmap, en definitiva un escáner de puertos muy potente. Con nmap podemos determinar si un servidor está en uso y que servicios ofrece, incluso podemos escanear toda una red.

Usos interesantes de la herramienta serían escanear un host sin hacerle ping, la opción -p0 Puede servirnos si no queremos que intente hacer ping a un servidor antes de escanearlo, es muy útil para máquinas que tienen firewall o no responden a ping. También podemos escanear sacando versiones de los servicios, por ejemplo  para saber la versión de ssh que se esta usando en una determinada ip o host, podemos usar usar la opción -sV. Con la opción -O podemos saber que sistema tiene un host.

### _10.- df_

Muestra la cantidad de espacio libre en los diferentes dispositivos montados o pasados como parámetro.  La primera columna muestra el nombre de la partición tal como aparece en el directorio /dev. Las columnas siguientes muestran el espacio total, bloques asignados y bloques disponibles.

La opción -T muestra el sistema de archivo también. De forma estandar, df muestra las cantidades en tamaños de bloques de 1K, lo cual podría ser difícil de leer rápidamente si queremos el output “human” usamos -h

### _11.- ps_

Muestra una instantánea de los procesos actuales para que conozcamos el estado de nuestros procesos. “ps” es la abreviatura de Process Status .“ps” esta basado en el sistema de archivos /proc, es decir, lee directamente la información de los archivos que se encuentran en este directorio. Tiene una gran cantidad de opciones, incluso estas opciones varían dependiendo del estilo en que se use el comando. Podemos ver los recursos del sistema que esté consumiendo, sus atributos de seguridad, etc.

La más simple definición de un proceso podría ser que es una instancia de un programa en ejecución (corriendo). A los procesos frecuentemente se les refiere como tareas. El contexto de un programa que está en ejecución es lo que se llama un proceso)

### _12.- free_

El comando Free en Linux muestra la cantidad de memoria libre y usada que tiene el sistema. Por una parte muestra la memoria física y por otra la swap, también muestra la memoria caché y de buffer consumida por el Kernel. No es necesario pasarle ningún parámetro al comando para ver su funcionalidad.

La siguiente forma de comprobar el uso de memoria es leer el archivo /proc/meminfo. Debes saber que el sistema de ficheros /proc no contiene archivos reales. Son archivos dinámicos o virtuales que contienen información sobre el núcleo y el sistema.

### 

### _13.-/proc file system_

Bajo Linux, todo es administrado como un archivo; incluso los dispositivos son accedidos como archivos, en el directorio /dev. El directorio /proc contiene una extraño tipo de archivo: archivos virtuales. Estos archivos son listados, pero realmente no existen en disco; el sistema operativo los crea al vuelo si tratas de leerlos.

El kernel de Linux controla el acceso a los dispositivos físicos del ordenador y establece cuándo y cómo los procesos interactuarán con estos dispositivos. El directorio /proc/ - también llamado el sistema de archivos proc -  contiene una jerarquía de archivos especiales que representan el estado actual del kernel, así permite a  las aplicaciones y usuarios mirar detenidamente  la vista del kernel del sistema.

Este no existe físicamente en disco, sino que el núcleo lo crea en memoria. Se utiliza para ofrecer información relacionada con el sistema, originalmente acerca de procesos, de aquí su nombre.

Mediante el uso de los comandos cat, more, o less en los archivos dentro del directorio /proc/, los usuarios pueden inmediatamente acceder una cantidad enorme de información acerca del sistema. Por ejemplo, para desplegar el tipo de CPU que tiene un equipo, podemos usar  cat /proc/cpuinfo para recibir una salida sobre el procesador.

### _14.- telnet_

Telnet es un protocolo que sirve para emular una terminal remota, lo que significa que se puede utilizar para ejecutar comandos introducidos con un teclado en un equipo remoto. La herramienta Telnet está implementada por el protocolo Telnet.

En lo personal uso telnet cuando estoy verificando la conexión entre servidores a específicos puertos. Se Puede ejecutar una simple prueba s para asegurarse de que el cliente puede conectar con el puerto. Dada la salida conoceremos si:

a)El puerto está filtrado (Trying...)

b)El puerto está abierto y hay un servicio que responde en ese puerto. (Connected)

c)El puerto está abierto, pero no hay servicio que responda en ese puerto (Connection refused)

### _15.- ping_

Ping es un comando muy sencillo pero también con varias opciones para personalizar los resultados. Como el principal objetivo de un ping es ver si un determinado ordenador o servidor es accesible desde otro, es una herramienta muy útil a la hora de diagnosticar problemas en una determinada red.

Ping utiliza el Protocolo de Control de Mensajes ICMP para determinar si otro sistema está conectado a la red y puede responder o no. Una prueba de ping EXITOSA requiere que el host origen realice una solicitud de ping con la dirección IP del equipo destino, enviándole así un paquete de solicitud de eco ICMP. El host remoto recibe el paquete y envía una respuesta de eco ICMP a cambio, comprobando que la conectividad entre ambos equipos es exitosa.

### 

### _16.- uptime_

Tengo un mantra, el uptime de un sistema es sagrado, esto quiere decir que no se debe reiniciar. Este es un dato que puede ser indicativo de la calidad o estabilidad del sistema  pues nos indica el tiempo que el servidor ha pasado encendido sin ser reiniciado.

Se despliegan los campos:

1)La hora actual.

2)El tiempo que ha permanecido el equipo conectado ininterrumpidamente.

3)El número de usuarios conectados en el momento.

4)Carga del sistema. Ésto es el número promedio de trabajos que se han realizado en los últimos 1, 5 y 15 minutos.

El comando top es similar a uptime, y ambos despliegan información de los archivos /proc que antes mencioné.

### 

### _17.- fdisk_

Fdisk es un software que esta disponible para varios sistemas operativos, el cual permite dividir en forma lógica un disco duro, siendo denominado este nuevo espacio como partición.

La descripción de las particiones se guarda en la tabla de particiones que se localiza en el sector 0 de cada disco.

En Linux, los nombres de los dispositivos de almacenamiento varían en función de si son unidades SCSI o IDE. Para los discos IDE, el primero se llama hda, el segundo se llama hdb, etc. Para discos SCSI, el primero se llama sda, el segundo se llama sdb y así sucesivamente.

### 

### _18.- watch_

watch sirve para ejecutar periódicamente un comando y mostrar lo que este imprime en pantalla completa, permitiendo ver claramente cómo cambian los datos tras cada ejecución.

Es muy útil para hacer monitoreos del estado de un sistema como por ejemplo el uso de recursos, procesos que están corriendo, etc, así como también para hacer el seguimiento de otro tipo de información que se quiera examinar. Para lograr esto último el usuario puede obtener la información que desea monitorizar con el uso de tuberías o bashscripts.

### _19.- strace_

El comando strace nos va a permitir realizar un diagnóstico sobre la ejecución de una aplicación, generando una salida con todas las llamadas al sistema que invoque la aplicación durante su ejecución.

Si Tienes problemas para iniciar algún servicio  y no hay errores en los logs o tienes otro proceso que que se congela y no tienes ni idea de que pueda estar pasando, tienes que conocer strace. De esta  forma que puedes ver exactamente que epusblishsta haciendo el programa desde que inicia hasta que sale incluso puede ser usado para hacer pruebas de rendimiento y estabilidad

### _20.- lsof_

Lsof es una potente herramienta que lista los archivos abiertos en el sistema. Partiendo de esta base, podemos conocer rápidamente que archivos mantiene abiertos un determinado proceso (PID) o usuario e información adicional como el puerto utilizado por dichos servicios/archivos, sockets en uso, etc.

Al igual que strace, es muy útil para conocer el comportamiento de algún proceso, para diagnosticar algún error o tratar de comprender cómo mejorar el performance de una aplicación.

**Como pueden ver, no indique la forma de uso de las herramientas, pues la intención es que esta sea una guía rápida que sirva a modo de conocer las herramientas disponibles, si necesitas usarlas, toda la información que necesitas está en la web.**