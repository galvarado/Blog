+++
comments = "true"
date = 2026-10-22T10:00:00Z
image = "/uploads/capa-semantica-llms.jpg"
tags = ["ai", "llm", "data"]
title = "Capa semántica para LLMs: evita que tu modelo malinterprete los datos"
+++

**¿De qué sirve que un LLM genere SQL perfectamente válido si termina respondiendo algo que no preguntamos?**

Conectar un Large Language Model (LLM) a una base de datos ya no es particularmente complicado. Le damos acceso al esquema, habilitamos alguna herramienta para ejecutar consultas y dejamos que el usuario haga preguntas en lenguaje natural.

El modelo encuentra las tablas, construye una consulta SQL y devuelve una respuesta.

Hasta ahí, todo parece funcionar.

El problema aparece cuando empezamos a hacer preguntas que requieren entender cómo opera realmente el negocio. Porque una cosa es saber dónde están almacenados los datos y otra muy distinta es entender qué significan.

Y ahí es donde las cosas se ponen interesantes.

## Tener inventario no significa poder venderlo

Pensemos en un asistente de IA conectado al ERP de una empresa.

Alguien del equipo comercial le pregunta:

**¿Cuántas unidades del producto X tenemos disponibles para vender?**

El modelo revisa las tablas y genera algo parecido a esto:

```sql
SELECT SUM(quantity)
FROM stock
WHERE product_id = 150;
```

La consulta se ejecuta sin errores y devuelve 850 unidades.

Perfecto, ¿no?

No necesariamente.

Resulta que de esas 850 unidades:

* 200 ya están reservadas para pedidos confirmados.
* 50 están bloqueadas por control de calidad.
* 100 están en un almacén que no atiende ese canal de venta.

Suponiendo que esos grupos no se superponen, realmente tenemos 500 unidades disponibles para vender.

El modelo respondió 850. La respuesta correcta para esa operación comercial era 500.

Y lo curioso es que **el modelo no necesariamente cometió un error de SQL**. Hizo una consulta válida, obtuvo datos reales y respondió de acuerdo con ellos.

Lo que no conocía era la definición de *disponible para venta* que utiliza la empresa.

Ese es el problema que quiero abordar.

## No es un problema exclusivo del inventario

Podemos encontrar situaciones similares prácticamente en cualquier módulo de un ERP.

### ¿Cuántos pedidos tenemos pendientes de entregar?

Un modelo podría buscar todos los pedidos cuyo estado sea distinto de `delivered`.

```sql
SELECT COUNT(*)
FROM orders
WHERE status <> 'delivered';
```

Pero ¿qué pasa con los borradores? ¿Los pedidos cancelados? ¿Las entregas parciales?

Dependiendo de cómo esté diseñado el ERP, esa consulta podría contar documentos que ni siquiera deberían considerarse pedidos pendientes.

Y si queremos conocer las unidades pendientes de surtir, contar pedidos tampoco es suficiente.

### ¿Qué porcentaje de entregas hicimos a tiempo?

Parece una pregunta sencilla, hasta que empezamos a discutir qué significa *a tiempo*.

¿Contra qué fecha medimos? ¿La fecha originalmente prometida al cliente o una nueva fecha que se acordó posteriormente?

¿Consideramos una entrega puntual cuando el producto sale del almacén o cuando lo recibe el cliente?

¿Y qué hacemos con las entregas parciales?

Podríamos construir varias consultas técnicamente correctas y obtener resultados completamente distintos.

Ninguno de esos resultados sería necesariamente inventado. Simplemente responderían a definiciones diferentes.

**El esquema de una base de datos nos dice cómo están organizados los datos, pero no siempre nos explica cómo interpreta esos datos el negocio.**

## Aquí entra la capa semántica

Una capa semántica es, esencialmente, una forma de definir y centralizar el significado de los datos que consumen nuestras aplicaciones.

En lugar de permitir que cada reporte, aplicación o agente de IA decida por su cuenta cómo calcular un indicador, establecemos una definición común.

Volvamos al ejemplo del ERP.

Podríamos definir conceptos como:

* **Existencia física:** unidades registradas en determinadas ubicaciones de inventario.
* **Inventario reservado:** unidades que ya están comprometidas para operaciones pendientes.
* **Disponible para venta:** unidades que efectivamente podemos ofrecer, considerando reservas, bloqueos, almacenes y canales.
* **Unidades pendientes de entrega:** cantidades confirmadas que todavía no han sido entregadas, considerando las reglas aplicables de cancelación o devolución.

Lo importante es que estas definiciones no se queden solamente en un documento.

Podemos tener un glosario perfectamente redactado y proporcionárselo al LLM como contexto. Eso ayuda, pero seguimos dependiendo de que el modelo aplique correctamente las reglas cada vez que genere una consulta.

Una capa semántica ejecutable permite llevar esas definiciones a modelos, relaciones, filtros y cálculos que pueden verificarse y reutilizarse.

Es una diferencia importante.

## ¿Y si dejamos de pedirle al LLM que construya todo el SQL?

En muchas implementaciones de Text-to-SQL el flujo es más o menos así:

**Usuario → LLM → SQL generado → Base de datos → Respuesta**

El modelo interpreta la pregunta y también decide cómo construir la consulta para responderla.

Eso significa que, en cada interacción, puede volver a interpretar las reglas del negocio.

Podemos cambiar ese enfoque.

En lugar de darle libertad completa para generar SQL, hacemos que el LLM identifique qué métrica quiere consultar el usuario y con qué parámetros.

Por ejemplo:

```json
{
  "metric": "available_to_sell",
  "filters": {
    "product_id": 150,
    "warehouse_id": 2,
    "sales_channel": "retail"
  }
}
```

Este JSON es solamente un ejemplo conceptual.

La capa semántica recibe esa solicitud, identifica la definición oficial de `available_to_sell` y construye la consulta correspondiente.

Así, el LLM se encarga principalmente de interpretar la intención del usuario, mientras que la capa semántica controla cómo se calcula el resultado.

Y esto abre una posibilidad interesante.

Podemos hacer preguntas muy diferentes:

* ¿Cuánto inventario disponible tenemos del producto X?
* ¿Qué productos tienen menos de 20 unidades disponibles en Guadalajara?
* ¿Cómo está distribuido nuestro inventario disponible por categoría y almacén?

En cada caso cambian los filtros, las dimensiones o las agrupaciones.

Pero hay algo que no debería cambiar: **lo que nuestra empresa entiende por inventario disponible para venta**.

## La parte que más me interesa: resultados reproducibles

Una de las ventajas de este enfoque es que podemos reducir la variabilidad de las consultas.

Si dos solicitudes llegan con la misma métrica, los mismos parámetros y la misma versión de las reglas, la capa semántica puede generar la misma lógica SQL.

No necesitamos que el LLM vuelva a interpretar cómo se calcula el inventario disponible cada vez que alguien haga una pregunta.

Esto no significa que siempre obtendremos el mismo número. Evidentemente, las existencias cambian conforme la empresa compra, vende y mueve productos.

Tampoco significa que el modelo sea incapaz de interpretar mal una pregunta ambigua.

Lo que conseguimos es separar dos responsabilidades:

**El LLM interpreta qué queremos consultar. La capa semántica determina cómo debe calcularse.**

Podemos mantener la flexibilidad del lenguaje natural sin permitir que el significado de nuestros indicadores cambie de una conversación a otra.

## ¿Con qué herramientas podemos construir una capa semántica?

Este concepto no apareció con los LLMs. Las capas semánticas llevan bastante tiempo utilizándose en Business Intelligence.

Lo interesante es que ahora también podemos aprovecharlas como parte de la arquitectura de nuestros agentes de IA.

Existen varias herramientas que vale la pena conocer.

### dbt Semantic Layer y MetricFlow

Si ya trabajamos con dbt, esta es una alternativa bastante natural.

MetricFlow permite definir métricas, entidades y dimensiones para después generar consultas basadas en esas definiciones.

En lugar de escribir manualmente la lógica de cada indicador, podemos modelarla de forma declarativa y consumirla desde distintas aplicaciones.

También existen posibilidades de integración con agentes mediante MCP.

### Cube

Cube es otra alternativa interesante, especialmente cuando necesitamos que diferentes aplicaciones utilicen las mismas definiciones.

Podemos centralizar medidas, dimensiones y relaciones, y exponerlas mediante APIs o interfaces SQL.

Por ejemplo, podríamos tener un dashboard comercial, un portal de clientes y un asistente de IA consultando las mismas métricas, sin que cada sistema tenga que implementar sus propias reglas.

### Looker y LookML

Si la organización ya trabaja con Looker, probablemente tenga una buena parte de sus definiciones de negocio expresadas en LookML.

En ese escenario, tiene sentido evaluar cómo aprovecharlas desde nuevas aplicaciones en lugar de volver a desarrollar toda esa lógica para un agente.

### Microsoft Power BI Semantic Models

Algo similar ocurre con Power BI.

Muchas organizaciones ya tienen modelos semánticos con relaciones, medidas y cálculos DAX que representan sus indicadores oficiales.

Antes de crear una nueva capa desde cero, vale la pena revisar si podemos reutilizar esos modelos.

### AtScale

AtScale está más orientada a organizaciones que necesitan compartir definiciones entre diferentes herramientas de análisis.

Puede tener sentido cuando existen múltiples plataformas de BI y queremos evitar que cada una tenga una interpretación distinta de los mismos indicadores.

No todas estas herramientas hacen exactamente lo mismo ni ofrecen las mismas posibilidades de integración. La elección depende mucho de dónde viven nuestros datos, qué arquitectura utilizamos y cómo queremos consumir esas métricas.

## ¿Y qué papel juega MCP en todo esto?

Es fácil confundir ambos conceptos porque actualmente encontramos muchas integraciones de IA que mencionan MCP.

Pero MCP no es una capa semántica.

MCP permite que un agente descubra y utilice herramientas o recursos externos.

Podemos exponer una herramienta MCP que consulte directamente una base de datos y permita generar SQL libremente.

O podemos exponer una herramienta que consuma las métricas definidas en una capa semántica.

Ambos escenarios utilizan MCP, pero solo el segundo incorpora necesariamente las reglas de negocio que hemos establecido.

**MCP nos ayuda a conectar herramientas. La capa semántica nos ayuda a conservar el significado de los datos.**

Son responsabilidades distintas y pueden complementarse bastante bien.

## Tampoco es una solución mágica

Hay algo que vale la pena aclarar.

Implementar una capa semántica no significa que todas las respuestas de nuestro agente serán correctas.

El LLM todavía puede seleccionar la métrica equivocada o interpretar incorrectamente un periodo. Las definiciones de negocio pueden estar mal implementadas y los datos del ERP pueden tener problemas de calidad.

Seguimos necesitando validaciones, permisos, trazabilidad y pruebas con resultados conocidos.

También debemos tener cuidado al trabajar con ERPs que ya incorporan reglas complejas.

El inventario es un buen ejemplo: las reservas, ubicaciones, movimientos y restricciones pueden estar gobernados por lógica propia del sistema que no necesariamente podemos reproducir con unas cuantas operaciones SQL.

No tendría mucho sentido construir una capa semántica para terminar duplicando incorrectamente las reglas que el ERP ya conoce.

El objetivo debería ser aprovechar esas reglas, validarlas y exponer definiciones consistentes para los consumidores de datos.

## Para cerrar

Cada vez resulta más fácil conectar un LLM a nuestros sistemas empresariales y permitir que cualquier usuario haga preguntas en lenguaje natural.

Eso es una ventaja enorme.

Pero también nos obliga a pensar en algo que a veces pasamos por alto: que un modelo sea capaz de consultar nuestros datos no significa que entienda nuestro negocio.

Podemos tener SQL válido, datos correctos y una respuesta equivocada desde el punto de vista operativo.

Para mí, ahí está el verdadero valor de incorporar una capa semántica a este tipo de arquitecturas.

No se trata de quitarle capacidades al LLM, sino de dejar que haga aquello para lo que resulta especialmente útil: interpretar lenguaje natural y ayudar al usuario a interactuar con los sistemas.

Mientras tanto, dejamos las definiciones, los cálculos y las reglas de negocio en un lugar donde podamos revisarlos, probarlos y mantenerlos.

**Porque al final, no queremos que nuestro agente simplemente sepa consultar un ERP. Queremos que sus respuestas signifiquen lo mismo que significan para las personas que trabajan con ese ERP todos los días.**

---

### Referencias para profundizar

* [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl) y [MetricFlow](https://docs.getdbt.com/docs/build/about-metricflow)
* [Cube Semantic Layer](https://cube.dev/docs)
* [Google Looker / LookML](https://cloud.google.com/looker/docs/write-lookml-intro)
* [Microsoft Power BI Semantic Models](https://learn.microsoft.com/power-bi/connect-data/service-datasets-understand)
* [AtScale Semantic Layer](https://www.atscale.com/)
