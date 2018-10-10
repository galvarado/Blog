+++
categories = ["devops"]
date = "2018-07-13T16:14:34-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = "/uploads/ops.jpg"
thumbnailImagePosition = "top"
title = "Estrategias de operación clave para aplicaciones nativas de nube"
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

### 1. Asegurar la redundancia

Deben anticiparse fallas de los componentes de la aplicación: máquinas virtuales, redes, almacenamiento y otra infraestructura. Diseñando en redundancia, el impacto de estas fallas puede ser limitado. Por ejemplo, si el entorno de  nube proporciona múltiples zonas geográficas, la aplicación completa y los servicios de los que depende se pueden replicar en múltiples zonas. Si ocurre una falla en una zona, el tráfico puede ser redirigido a la zona saludable, asegurando la continuidad del servicio.

### 2. Utilizar el almacenamiento en caché

El almacenamiento en caché es una técnica que se utiliza ampliamente en entornos convencionales y en la nube. Mejora el rendimiento manteniendo más cerca los datos que más se acceden. También mejora la capacidad de recuperación al permitir el acceso a los datos almacenados en caché en caso de una falla de

Otri punto es que el almacenamiento en caché reduce el tráfico de red. Esto reduce los costos operativos cuando los proveedores de servicios en la nube miden y factura por uso de ancho de banda. 

### 3. Acceso seguro a las APIs

El acceso seguro a la API garantiza que las aplicaciones y los servicios solo sean accesibles para los clientes que deberían tener acceso a ellos. No hay garantías de que los servicios implementados en la nube sean seguros. Una solución es consumir cada servicio con una gestión de API  (Proxy) mediante permisos, esto no solo limita el acceso, sino que también permite auditoría y se rastreen cómo está siendo utilizada y por quién.

### 4. Despliegue por etapas

En un sistema grande y distribuido, los despliegues de software pueden conducir a comportamientos inesperados debido a errores, efectos secundarios e incompatibilidades imprevistas. Los sistemas se vuelven más grandes, más dinámicos y más complejos, la capacidad de anticipar y prevenir estos problemas disminuye. 

Un enfoque para administrar el riesgo es implementar despliegues a pequeña escala y monitorear cuidadosamente el comportamiento de la nueva versión. Lo nuevo y lo viejo - en cuanto a versiones - de un componente funcionan en paralelo, lo que reduce la posibilidad de que una nueva versión afecte todo el sistema. Si el despliegue a pequeña escala es exitoso, la actualización se puede implementar en una escala mayor para un nuevo conjunto de máquinas virtuales, mientras que las antiguas se ejecutan como soporte de conmutación por error. 

### 5. Plan para fallas de zona/región

### 6. Minimizar la latencia entre zonas/regiones

### 7. Colocar los datos que consumen el mayor ancho de banda externamente

### 8. Abstraer las dependencias

Referencias: [OPEN DATA CENTER ALLIANCE Best Practices: Architecting Cloud-Aware Applications](https://oaca-project.github.io/files/Architecting%20Cloud-Aware%20Applications%20Best%20Practices%20Rev%201.0.pdf)