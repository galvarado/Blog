+++
comments = "true"
date = 2026-07-23T10:00:00Z
image = "/uploads/tokens-llm.png"
tags = ["ai", "llm"]
title = "Qué son los tokens en los LLMs (y por qué te cobran por ellos)"
+++

Hoy en día hablar de usar IA es hablar de los tokens. Si trabajas con LLMs -OpenAI, Claude, Gemini, lo que sea, te están cobrando por tokens, no por palabras ni por caracteres. Y si no sabes qué son, es difícil optimizar costos o entender por qué a veces tu prompt "corto" termina siendo carísimo.

## Qué es un token

Un token es simplemente un número. Es la forma en que un LLM "piensa" el texto que le mandamos. El proceso de convertir texto en esos números se llama **encoding** (codificación), y el inverso, convertir números de vuelta a texto, se llama **decoding** (decodificación).

La tokenización sucede en dos partes:

1. Un tokenizador divide el texto en fragmentos que reconoce. Esos fragnebtis son los tokens.
2. Esos fragmentos se convierten en números

El LLM nunca ve "hola mundo". Ve algo como `[15339, 1917]`.

## El flujo completo

En resumen:

1. El tokenizador codifica el texto (prompt) en tokens
2. El modelo procesa esos tokens
3. El modelo produce tokens de salida
4. Esos tokens de salida se decodifican para que sean texto legible

Esto importa porque **los tokens de entrada** incluyen más de lo que escribes tú: también cuenta el historial de la conversación y las definiciones de las tools que le damos al modelo. Todo eso es lo que se cobra. Los **tokens de salida** son la respuesta que nos devuelve el modelo, y normalmente se cobran a una tarifa distinta (más cara). Una forma real de bajar costos es diseñar prompts que generen respuestas más cortas.

## Cómo se construye un vocabulario de tokens

La tokenización comienza con un corpus amplio de texto, normalmente similar al que se utilizará para entrenar el modelo. Para simplificar, imaginemos una frase pequeña:

“El gato se sentó en la alfombra”.

Al inicio, el texto se divide en unidades mínimas, como caracteres o bytes. Cada una de estas unidades puede funcionar como un token independiente.

Después, el algoritmo analiza el corpus y busca secuencias que aparecen con frecuencia. Por ejemplo, puede detectar combinaciones como “ga”, “to”, “en” o “la”. Las combinaciones más comunes se incorporan al vocabulario como nuevos tokens.

Este proceso se repite de forma progresiva: primero se agrupan unidades pequeñas, luego fragmentos más largos y, finalmente, algunas palabras completas pueden convertirse en un solo token.

El tamaño del vocabulario influye directamente en la manera en que se divide el texto:

- Con un vocabulario de 1,000 tokens, una palabra como entendimiento podría dividirse en cinco tokens.
- Con un vocabulario de 50,000 tokens, podría necesitar tres.
- Con un vocabulario de 200,000 tokens, quizá solo dos.

Un vocabulario más grande permite representar muchas palabras con menos tokens, lo que puede reducir la longitud de las secuencias y hacer más eficiente su procesamiento.

Sin embargo, aumentar el vocabulario también tiene un costo: el modelo necesita almacenar y aprender representaciones para una mayor cantidad de tokens. Por eso, el tamaño del vocabulario se elige buscando un equilibrio entre cobertura lingüística, eficiencia y complejidad del modelo.

## Donde se rompe: palabras raras

El tokenizador sufre con palabras poco comunes. Si le das algo inventado o muy poco frecuente en el corpus de entrenamiento, lo termina partiendo en un montón de fragmentos pequeños en vez de un token limpio. Una palabra de 15 caracteres inventada puede terminar en 7 tokens o más -mucho más de lo que esperarías.

Esto explica por qué nombres propios raros, jerga muy específica, o texto en idiomas poco representados en el corpus de entrenamiento consumen más tokens (y más dinero) que texto en inglés estándar.

Los modelos especializados en programación manejan bien el código, las configuraciones y los términos habituales de DevOps. Sin embargo, la tokenización se vuelve menos eficiente cuando encuentra cadenas poco comunes, generadas dinámicamente o con alta entropía.

Esto ocurre con elementos como:

- Nombres extensos de pods y recursos.
- UUID, hashes y digests.
- Tags de imágenes.
- Hostnames internos.
- Acrónimos propios de la organización.
- Rutas y endpoints poco frecuentes.
 Identificadores generados automáticamente.

Por ejemplo:

- sentinella-hub-k8s-agent-kxxx5
- sha256:392be7cc8120f14a...

Aunque cada cadena representa una sola entidad para un ingeniero, el modelo puede procesarla como varios tokens.

Herramientas como Codex y Claude Code reducen el impacto mediante búsquedas selectivas, ejecución de comandos, subagentes y compactación del contexto. Sin embargo, los id¿?entificadores raros y los resultados extensos siguen consumiendo tokens.

En operaciones de TI, el principal problema no es una palabra técnica aislada, sino la acumulación de miles de líneas de logs, identificadores dinámicos, errores repetidos y configuraciones irrelevantes. Por eso, filtrar y estructurar la evidencia sigue siendo importante incluso cuando se utilizan agentes especializados en código.

## Verlo en acción: tiktokenizer

La mejor forma de entender esto no es leyendo, es viéndolo. [tiktokenizer](https://github.com/dqbd/tiktokenizer) es un playground open source que corre en [tiktokenizer.vercel.app](https://tiktokenizer.vercel.app/) donde escribes texto y ves en vivo cómo se parte en tokens, coloreados uno por uno, junto con sus IDs numéricos. Soporta los tokenizadores de varios modelos (GPT, Llama, etc.), así que puedes comparar cómo el mismo texto se tokeniza distinto según el modelo.

Es la herramienta más rápida para responder preguntas como:
- ¿Cuántos tokens realmente consume este prompt?
- ¿Por qué este nombre propio o esta palabra técnica me está costando tanto?
- ¿Cómo cambia el conteo de tokens entre modelos?

Si trabajas seguido con LLMs y nunca metiste tu propio texto ahí, vale la pena los dos minutos. Vas a entender por qué ciertos prompts son más caros de lo que parecen a simple vista.

Creo que es importante no solo por usar IA, sino por hacerlo de forma eficiente: mejores resultados con menos contexto, cómputo y tokens. En esta era quien optimiza mejor sus tokens, gana.