+++
date = "2019-01-24T06:00:00+00:00"
image = "/uploads/DxtNyCnXcAEAHP9-2.png"
title = "Microsoft compra Citus Data para mejorar la experiencia de PostgreSQL en Azure"

+++
Navegando por twitter me enteré hoy de una noticia que llamó mi atención. Microsoft compró Citus Data, una compañia que se caracteriza por hacer más rápida y escalable la base de datos PostgreSQL. Hicieron falta unos minutos para investigar bien la nota y me pareció importante compartirla en el Blog.

Básicamente Citus Data [ es una extensión de PostgreSQL ](https://www.citusdata.com/blog/2017/10/25/what-it-means-to-be-a-postgresql-extension/)como hstore y  PostGIS por ejemplo, entonces la extensión de Citus Data está diseñada para proporcionar escalabilidad horizontal y capacidades de fragmentación automática asociadas con las bases de datos NoSQL como MongoDB, pero con el soporte de ACID asociado con las bases de datos empresariales.

Microsoft ya ofrece un servicio administrado de PostgreSQL en Azure entonces, ¿Para que comprar una compañia que hace eso?

Como mencionan en [zdnet](https://www.zdnet.com/article/microsoft-buys-citus-data/) la estrategia de Microsoft pareciera ser doble. Primero, agrega más talentos al equipo de Microsoft, en este caso adquirir talentos en lugar de tener que desarrollar el talento en casa. Con esto a Microsoft se posiciona mejor para contribuir y tener una participación en la dirección del proyecto de código abierto de PostgreSQL. En segundo lugar, se trata de competir directamente con Amazon y su versión compatible de PostgreSQL con su oferta de [Amazon Aurora](https://aws.amazon.com/es/rds/aurora/). De hecho Microsoft siguió la misma estrategia que AWS, [cuando ellos compraron ParAccel.](https://www.informationweek.com/software/information-management/actian-acquires-paraccel-fuel-behind-amazon-redshift/d/d-id/1109699)

Esto viene a reafirmar el interés de Microsoft en el Open Source. Los servicios de datos de Microsoft Azure son un excelente ejemplo donde han invertido continuamente para ofrecer servicios de bases de datos, como BD relacionales open source totalmente administrados y basados en la versión de la comunidad, que abarcan MySQL, PostgreSQL y MariaDB. También han invertido en portar SQL Server a Linux, otro caso es  Azure Cosmos DB, base de datos NoSQL y quizá la más grande de todas, la adquisición de GitHub.

Ya no es sorpresa que Microsoft invierta en Openshift Source, y definitivamente compras cómo estas ayudan a Microsoft a argumentar que admite tecnologías de código abierto particularmente en la nube, mientras continúa ganando dinero con el software propietario popular como Windows y Office. En el negocio de la nube, Microsoft quiere usar la apertura como una forma de hacer negocios forzados por la competencia de Google,  Amazon y otros. Para saber más del tema de Microsoft en el Open Source [este sitio muestra todos los proyectos de MS abiertos.](https://opensource.microsoft.com/)

## Comparar los servicios de base de datos en nube pública

Después de investigar la nota, tuve la curiosidad de conocer y comparar las ofertas de los principales proveedores de nube publica en cuanto a servicios de base de datos.

 Dejo a modo de referencia la siguiente imagen donde se pueden comparar los servicios de Google Cloud Platform, Amazon Web Services, Microsoft Azure e IBM Cloud.

![](/uploads/Screenshot-20190124200122-1898x845.png)

La comparación la hice con la siguiente herramienta:[ ttps://www.rightscale.com/cloud-comparison-tool/](https://www.rightscale.com/cloud-comparison-tool/ "https://www.rightscale.com/cloud-comparison-tool/")

¿Que nube pública usas tú y porqué?