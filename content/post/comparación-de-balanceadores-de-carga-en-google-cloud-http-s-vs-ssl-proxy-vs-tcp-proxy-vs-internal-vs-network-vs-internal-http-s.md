+++
comments = "true"
date = "2019-10-09T05:00:00+00:00"
draft = true
image = "/uploads/GoogleCloudLoadBalancers.png"
tags = ["architecture", "cloud", "GCP"]
title = "Comparación de Balanceadores de carga en Google Cloud: HTTP(s) vs SSL Proxy vs TCP Proxy vs Internal vs Network vs Internal HTTP(S)"

+++
¿Qué tecnologías apoya el balanceo de carga de GCP?

Google Front Ends (GFE) = sistemas distribuidos definidos por software que se encuentran en los POP de Google y realizan un equilibrio de carga global junto con otros sistemas y planos de control

Andromeda = pila de virtualización de red definida por software de Google Cloud

Maglev: sistemas distribuidos para el equilibrio de carga de red