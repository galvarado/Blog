+++
comments = "true"
date = 2020-07-24T05:00:00Z
draft = true
image = ""
tags = ["devops", "cloud", "containers"]
title = "despliegue continuo con spinnaker"

+++
1\.- Crear provider de GCR

2\.- Corregir los pasos del kubeconfig, primero hay que crear la cuenta de servicio y luego generar el kubeconfig. Ese se copia y se configura como provider-

    spinnaker-sa.yaml

[https://github.com/galvarado/kubernetes-scripts/blob/master/create-kubeconfig](https://github.com/galvarado/kubernetes-scripts/blob/master/create-kubeconfig "https://github.com/galvarado/kubernetes-scripts/blob/master/create-kubeconfig")  
  
[https://spinnaker.io/setup/install/providers/kubernetes-v2/](https://spinnaker.io/setup/install/providers/kubernetes-v2/ "https://spinnaker.io/setup/install/providers/kubernetes-v2/")