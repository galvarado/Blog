+++
comments = "true"
date = 2022-03-01T06:00:00Z
draft = true
image = ""
tags = ["devops", "architecture", "cloud", "development", "best practices", "containers", "GCP", "azure", "aws", "CloudOps"]
title = "Compartir y promover imagenes de contenedor de Amazon ECR entre cuentas de AWS"

+++
cumplir prerequisitos de clis

en la cuenta principal seguir los siguientes pasos para crear un repositorio y una imagen, hacer build y push

[https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html "https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html")

En la segunda cuenta, hacer login al repo de la cuenta principal e intentar el pull: dará un error.

Agregar politica en la cuenta principal e intentar el pull de nuevo, debe funcionar

    {
      "Statement": [
        {
          "Action": [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchCheckLayerAvailability",
            "ecr:BatchGetImage"
          ],
          "Principal": {
    
            "AWS": [
              "arn:aws:iam::335582020948:user/developer"
            ]
          },
          "Effect": "Allow",
          "Sid": "AllowCrossAccountPull"
        }
      ],
      "Version": "2008-10-17"
    }

get identity [https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html](https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html "https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html")