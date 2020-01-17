+++
comments = "true"
date = 2019-08-21T18:00:00Z
draft = true
image = ""
tags = ["devops", "best practices", "CloudOps", "circleci"]
title = "Primeros pasos en integración y despliegue continuo con Circle CI"

+++
Los desarrolladores podemos realiza  manualmente tareas con respecto a construcción (build), pruebas y despliegue. Pero esto crea rápidamente un gran dolor de cabeza cuando se llega a un punto de complejidad o cuando un gran equipo de desarrolladores trabaja en conjunto en el mismo proyecto.

Para fines ilustrativos del post usaré NodeJS para construir una aplicación con [Vue.js](https://vuejs.org/) que es un framework progresivo en Javscript para construir interfaces de usuario.

Puedes elegir cualquier aplicación en Node o incluso en cualquier otro lenguaje y seguir las instrucciones para crear el pipeline con CircleCI adaptando los comandos a la tecnologías que decidas usar.

Aunque el objetivo no es hablar de Vue.js ni profundizar en sus conceptos sino simplemente crear un pipeline de CI/CD con  alguna aplicación, se puede usar [esta comparación](https://es-vuejs.github.io/vuejs.org/v2/guide/comparison.html) de Vue.js frente a React o Angular para profundizar en el tema.

## Crear aplicación con Vue.js

Instalar vue-cli

    $ npm install -g vue-cli

Inicializar proyecto:

    $ vue init webpack-simple my-app
    vue-cli · Generated "my-app".

Una vez generado, entrar en el directorio y ejecutar el servidor de desarrollo:

     cd my-app
    $ npm install
    $  npm run dev

Deberiamos ver un output parecido a las siguientes lineas:

    DONE  Compiled successfully in 2296ms                                                                                                                                              
    Your application is running here: http://localhost:8080

Entonces si vamos a la URL señalada deberíamos ver una plantilla generada en HTML:

![](/uploads/screenshot.png)

Realizamos unos cambios en el archivo

     src/App.vue 

especificamente  modificaciones en la sección <template> cambiando el HTML y en la sección <script> para mostrar  el mensaje personalizado:

![](/uploads/screenshot2.png)

## Despliegue a producción

En este momento simplemente estamos usando el comando:

     $ npm run dev 

que nos permite iniciar un servidor http para para trabajar y probar rápidamente, esto es recomendado para realizar pruebas en el entorno local pero ¿qué sucede si realmente queremos publicar la aplicación en la web? En este caso,  debemos ejecutar:

    npm run build

Esto construirá la aplicación para producción y se creará una nuevo directorio llamado _dist_ que contiene el paquete o _bundle_ compilado. Además, muchas optimizaciones se ejecutan durante el proceso de compilación, como minificación, transpiling y compresión.

[https://circleci.com/blog/what-tools-do-you-need-to-do-devops/](https://circleci.com/blog/what-tools-do-you-need-to-do-devops/ "https://circleci.com/blog/what-tools-do-you-need-to-do-devops/")

[https://circleci.com/blog/continuous-package-publishing/](https://circleci.com/blog/continuous-package-publishing/ "https://circleci.com/blog/continuous-package-publishing/")

[https://circleci.com/blog/a-brief-history-of-devops-part-iv-continuous-delivery-and-continuous-deployment/](https://circleci.com/blog/a-brief-history-of-devops-part-iv-continuous-delivery-and-continuous-deployment/ "https://circleci.com/blog/a-brief-history-of-devops-part-iv-continuous-delivery-and-continuous-deployment/")

[https://circleci.com/blog/how-to-sell-your-team-on-ci-cd/](https://circleci.com/blog/how-to-sell-your-team-on-ci-cd/ "https://circleci.com/blog/how-to-sell-your-team-on-ci-cd/")

[https://circleci.com/blog/build-test-deploy-hugo-sites/](https://circleci.com/blog/build-test-deploy-hugo-sites/ "https://circleci.com/blog/build-test-deploy-hugo-sites/")

[https://medium.com/@ayushigupta_2225/continuous-integration-and-deployment-through-circle-ci-fbe56ea316dc](https://medium.com/@ayushigupta_2225/continuous-integration-and-deployment-through-circle-ci-fbe56ea316dc "https://medium.com/@ayushigupta_2225/continuous-integration-and-deployment-through-circle-ci-fbe56ea316dc")