+++
comments = "true"
date = "2019-08-21T18:00:00+00:00"
draft = true
image = ""
tags = ["devops", "best practices", "CloudOps", "circleci"]
title = "Primeros pasos en integración y despliegue continuo con Circle CI"

+++

Crear aplicación con Vue.js

Instalar vue-cli

    $ npm install -g vue-cli

Inicializar proyecto:

    $ vue init webpack my-app

   vue-cli · Generated "my-app".

Una vez generado, entrar en el directorio y ejecutar el servidor de desarrollo:

      cd my-app

    $  npm run dev

Deberiamos ver un output parecido a las siguientes lineas:

    DONE  Compiled successfully in 2296ms                                                                                                                                              

     Your application is running here: http://localhost:8080

Entonces si vamos a la URL señalada deberíamos ver una plantilla generada en HTML: