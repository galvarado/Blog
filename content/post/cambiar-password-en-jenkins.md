+++
categories = ["devops"]
date = "2019-01-17T00:00:00-06:00"
draft = true
metaAlignment = "center"
thumbnailImage = ""
thumbnailImagePosition = "top"
title = "Cambiar password en Jenkins"
undefined = ""

+++
Hoy tuve la necesidad de cambiar el password de [Jenkins](https://jenkins.io/), un servidor de integración continua. No es un procedimiento que se pueda hacer como un usuario común, en la mayoria de los sistemas/software existe un modo de recuperación de password, que te envía un correo. En este caso no es así, para el procedimiento debes tener acceso al servidor dónde se encuentra instalado Jenkins.

Como no es un procedimiento común, cree el siguiente script y lo guardé como un gist en Github, lo comparto por si alguien necesita realizar este proceso:

l<script src="[https://gist.github.com/galvarado/d6ee84fe738f641ad486491a7ef6099d.js](https://gist.github.com/galvarado/d6ee84fe738f641ad486491a7ef6099d.js "https://gist.github.com/galvarado/d6ee84fe738f641ad486491a7ef6099d.js")"></script>