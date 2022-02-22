+++
comments = "true"
date = 2022-02-20T17:53:00Z
image = "/uploads/terraformeks.png"
tags = ["devops", "terraform","aws", "cloud", "containers"]
title = "Desplegar un cluster de Amazon EKS con Terraform"

+++
Para este tutorial preparé un proyecto demo que demostrará como desplegar endpoints construidos con stacks distintos  y colocar enfrente un API Gateway con Nginx.

El código disponible tiene dos APIs listas para responder peticiones, una construida con Python usando el framework de FastAPI y otra con Go usando el framework de Gin. Durante el tutorial se explica a detalle las configuraciones de nginx necesarias para funcionar como API Gateway.

Después de realizar el tutorial, tendrás desplegados 3 contenedores con docker y una API que responde peticiones   protegida con HTTPS  usando un certifcado SSL y además autenticación basada en API Key.