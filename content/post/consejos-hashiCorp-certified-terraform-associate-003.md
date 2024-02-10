+++
comments = "true"
date = 2024-02-08T14:00:00Z
image = "/uploads/terraformcertification.png"
tags = ["terraform", "devops", "cloud", "IaC"]
title = "Mis consejos para obtener la certificación HashiCorp Certified: Terraform Associate (003)"
+++


Las últimas semanas me preparé para rendir el examen y obtener la certificación como HashiCorp Certified: Terraform Associate (003) y me gustaría compartir el proceso que seguí, cómo me preparé y algunos consejos útiles para aquellos quienes desean obtener esta certificación.

Este es el certificado que se obtiene al pasar el examen de certificación:



## ¿Cómo es el exámen?

Está formado por 57 preguntas, el costo al día de hoy es de 70 USD y se aprueba con 70% que son básicamente 40 respuestas correctas.Las preguntas que puedes esperar están relacionadas a  comportamientos puntuales del flujo de terraform, sus comandos, la forma en la que opera y su arquitectura en general como los proviers, modulos, backends e incluso Terraform CLoud.  Además algunas preguntas presentan casos hipoteticos y debes responder que es lo que se debe de hacer según la necesidad expresada en el caso. 


El exámen se puede tomar desde cualquier lugar con PSI (Proctoring Service Inc) que brinda servicios de supervisión o vigilancien línea para exámenes y evaluaciones a través de Internet. El proctoring es un proceso que garantiza la integridad del examen al supervisar a los candidatos para prevenir trampas y asegurar que el examen se realice de manera justa y transparente.

El formato específico de un examen con PSI puede variar según la institución o entidad que administre la prueba. Sin embargo, en términos generales, el proceso de un examen con Proctoring Services ciertos pasos comunes qye implica registro y verificación de identidad, descarga de software con funciones de vigilancia, verificación fisica del entorno de examen, conexión con un proctor en línea, y vigilancia durante el examen para prevenir trampas y garantizar la integridad del proceso.



## ¿Qué estudiar para pasar la certificación?

La frase "Terraform es fácil de aprender pero difícil de dominar " refleja  la naturaleza de Terraform así como su exámen de certificación, pues aunque me parece más difícil el exámen de un Cloud Provider porque abarca muchos productos dentro, definiticamente debes tener experiencia en terraform para pasar la certficación. Lo más fácil es copiar y pegar código de internet y probarlo para ver que hace, pero es hasta que tienes que mantener los cambios del día a día de la infraestructura con terraform que de verdad lo dominas.

Terraform utiliza una sintaxis declarativa que es fácil de entender y aprender. Con su lenguaje simple y estructura clara,  puedes comenzar a definir la infraestructura de manera comprensible y rápida. A medida que avanzamos, la complejidad de Terraform se revela en aspectos como la gestión del estado, el uso de modulos y su interoperabilidad y la gestión de múltiples entornos basados en el mismo código, como staging, desarrollo, sandbox y produción. 

Algunos conceptos que debes domonar para el exámen incluyen:

- Gestión del Estado: Comprender cómo Terraform mantiene y utiliza el estado para rastrear los recursos desplegados.
- Módulos: Utilizar módulos para la reutilización de código y la construcción de abstracciones más complejas.
- Provisionamiento Avanzado: Implementar estrategias de provisionamiento avanzadas, como la ejecución de scripts o la configuración de recursos después del despliegue.


## Recursos en línea


Recomiendo el curso de [Andrew Brown](https://exampro.co/terraform) de ExamPro  porque primero que nada, tiene una versión gratis que además incluye un simulador del exámen, es decir son 57 preguntas de opción múltiple orientado a tener la misma experiencia que cuando rindas el exámen de certificación.


## Pregunas que puedes esperar en el éxamen

Te dejo 10 preguntas muy similares a lo que puedes esperar en el exámen:

**Pregunta #1 **
El archivo `terraform.tfstate` siempre coincide con la infraestructura actualmente construida.
- A. Verdadero
- B. Falso

**Pregunta #2 **
Una configuración remota de backend siempre se asigna a un único espacio de trabajo remoto.
- A. Verdadero
- B. Falso

**Pregunta #3 **
¿En qué se diferencia el backend remoto de Terraform de otros backends de estado como S3, Consul, etc.?
- A. Puede ejecutar ejecuciones de Terraform en infraestructura dedicada en las instalaciones o en Terraform Cloud.
- B. No muestra la salida de un `terraform apply` localmente.
- C. Solo está disponible para clientes de pago.
- D. Todas las anteriores.

**Pregunta #4 **
¿Cuál es el flujo de trabajo para implementar nueva infraestructura con Terraform?
- A. `terraform plan` para importar la infraestructura actual al archivo de estado, realizar cambios de código, y `terraform apply` para actualizar la infraestructura.
- B. Escribir una configuración de Terraform, ejecutar `terraform show` para ver los cambios propuestos, y `terraform apply` para crear nueva infraestructura.
- C. `terraform import` para importar la infraestructura actual al archivo de estado, realizar cambios de código, y `terraform apply` para actualizar la infraestructura.
- D. Escribir una configuración de Terraform, ejecutar `terraform init`, ejecutar `terraform plan` para ver los cambios planificados en la infraestructura, y `terraform apply` para crear nueva infraestructura.

**Pregunta #5 **
Siempre se requiere un bloque de configuración de proveedor en cada configuración de Terraform.
- A. Verdadero
- B. Falso

**Pregunta #6 **
Ejecutas un aprovisionador `local-exec` en un recurso nulo llamado `null_resource.run_script` y te das cuenta de que necesitas volver a ejecutar el script.
¿Cuál de los siguientes comandos usarías primero?
- A. `terraform taint null_resource.run_script`
- B. `terraform apply -target=null_resource.run_script`
- C. `terraform validate null_resource.run_script`
- D. `terraform plan -target=null_resource.run_script`

**Pregunta #7 **
¿Cuál aprovisionador invoca un proceso en el recurso creado por Terraform?
- A. `remote-exec`
- B. `null-exec`
- C. `local-exec`
- D. `file`

**Pregunta #8 **
¿Cuál de las siguientes afirmaciones no es cierta acerca de los proveedores de Terraform?
- A. Los proveedores pueden ser escritos por individuos.
- B. Los proveedores pueden ser mantenidos por una comunidad de usuarios.
- C. Algunos proveedores son mantenidos por HashiCorp.
- D. Importantes proveedores en la nube y proveedores que no son en la nube pueden escribir, mantener o colaborar en proveedores de Terraform.
- E. Ninguna de las anteriores.

**Pregunta #9 **
¿Qué comando requiere Terraform la primera vez que se ejecuta dentro de un directorio de configuración?
- A. `terraform import`
- B. `terraform init`
- C. `terraform plan`
- D. `terraform workspace`

**Pregunta #10 **
Has implementado una nueva aplicación web con una dirección IP pública en un proveedor de servicios en la nube. Sin embargo, no creaste ninguna salida para tu código.
¿Cuál es el mejor método para encontrar rápidamente la dirección IP del recurso que implementaste?
- A. Ejecutar `terraform output ip_address` para ver el resultado.
- B. En una nueva carpeta, utilizar el origen de datos `terraform_remote_state` para cargar el archivo de estado y luego escribir una salida para cada recurso que encuentres en el archivo de estado.
- C. Ejecutar `terraform state list` para encontrar el nombre del recurso y luego `terraform state show` para encontrar los atributos, incluida la dirección IP pública.
- D. Ejecutar `terraform destroy`, luego `terraform apply` y buscar la dirección IP en la salida estándar (stdout).
