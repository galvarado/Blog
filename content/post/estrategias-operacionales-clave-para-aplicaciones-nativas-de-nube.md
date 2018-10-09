+++
categories = ["devops"]
date = "2018-07-13T16:14:34-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = "/uploads/ops.jpg"
thumbnailImagePosition = "top"
title = "Estrategias de opera clave para aplicaciones nativas de nube"
undefined = ""

+++
Para aprovechar eficazmente el potencial de la computación en la nube, las empresas deben hacer cambios fundamentales en la forma en que abordan el desarrollo y las operaciones ya que con la computación en la nube,  **las aplicaciones se construyen de manera diferente, se ejecutan de manera diferente y se consumen de manera diferente.** Este post está basado en las practicas propuestas por la [Open Data Center Alliance](https://www.opendatacenteralliance.org/ "Open Data Center Alliance")  para operar estas aplicaciones.

Las estrategias operacional que proponen se refieren a cómo la aplicación se implementa y opera y cómo otros componentes del sistema interactúan con ella. 

**TL;DR**,

1. Asegurar la redundancia
2. Utilizar el almacenamiento en caché
3. Acceso seguro a las APIs
4. Despliegue por etapas
5. Plan para fallas de zona/región
6. Minimizar la latencia entre zonas/regiones
7. Colocar los datos que consumen el mayor ancho de banda externamente
8. Abstraer las dependencias

1. Asegurar la redundancia

Referencias: [OPEN DATA CENTER ALLIANCE Best Practices: Architecting Cloud-Aware Applications](https://oaca-project.github.io/files/Architecting%20Cloud-Aware%20Applications%20Best%20Practices%20Rev%201.0.pdf)