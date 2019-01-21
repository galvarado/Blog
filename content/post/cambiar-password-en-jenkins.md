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
La intención de escribir en el blog es también formar una bitácora sobre algunos procedimientos que me parecen importantes compartir. Este es el caso del post de hoy, tuve la necesidad de cambiar el password de [Jenkins](https://jenkins.io/), un servidor de integración continua. No es un procedimiento que se pueda hacer como un usuario común, en la mayoría de los sistemas  existe un modo de recuperación de password, que te envía un correo. En este caso no es así, para el procedimiento debes tener acceso al servidor dónde se encuentra instalado Jenkins.

Como no es un procedimiento común y existen algunas alternativas me pareció buena idea hacer un script que haga el proceso de cambiar el password, este script lo guardé como un gist en Github, [lo comparto en este link](lhttps://gist.github.com/galvarado/d6ee84fe738f641ad486491a7ef6099d.js)

También dejo aqui el script para referencia:

    username="myusername"
    hash="$(echo -n 'thenewpass{s4lt}' | sha256sum | awk '{print $1;}')"
    
    echo "Changing password for $username"
    echo "Password encrypted with SHA-256"
    sed -i -E "s/(<passwordHash>.+)/<passwordHash>s4lt:$hash<\/passwordHash>/" /var/lib/jenkins/users/$username/config.xml
    
    echo "Replaced succesfully, restarting jenkins service..."
    service jenkins restart
    
    echo "Jenkins restarted"
    service jenkins status

## Explicación del script

Es bastante sencillo pero igual me gustaría compartir a explicación de lo que hace el script:

    username="myusername"
    hash="$(echo -n 'thenewpass{s4lt}' | sha256sum | awk '{print $1;}')"

Se establecen 2 variables, la primera es "username"  y es el usuario al cual se le hará el cambio de contraseña.  La segunda es  "hash" y contiene la contraseña ya cifrada con SHA-256.

Para usar el scirpt hay que sustituir el valor de la variable username por nuestro usuario, al cual cambiaremos el password.

También hay que reemplazar la cadena  "thenewpass" por el la contraseña que vamos a establecer. Si no es reemplazada esa será la contraseña que se establezca.

    echo "Changing password for $username"
    echo "Password encrypted with SHA-256"
    sed -i -E "s/(<passwordHash>.+)/<passwordHash>s4lt:$hash<\/passwordHash>/" /var/lib/jenkins/users/$username/config.xml

En la siguiente parte del script sencillamente se imprime en pantalla el usuario que tendrá el cambio de contraseña y posteriormente se usa el comando sed para cambiar el valor de

     <passwordHash> 

con la contraseña ya cifrada. Este valor se reemplaza en el archvo :

    /var/lib/jenkins/users/$username/config.xml

Finalmente se reinicia el servicio de Jenkins para que el cambio sea tomado en cuenta.

    echo "Replaced succesfully, restarting jenkins service..."
    service jenkins restart
    
    echo "Jenkins restarted"
    service jenkins status

Un script sencillo pero si tuvieramos que realizar este procedimiento continuamente por ser parte del equipo de soporte entonces podríamos automatizarlo a partir de estos pasos y combinarlo con ansible para reliazarlo en multiples servidores. Esto finalmente es comenzar a realiazar tareas de DevOps. Si algun procedimiento se tiene que realizar más de 2 veces, entonces se debe automatizar.

¿Que te parece?