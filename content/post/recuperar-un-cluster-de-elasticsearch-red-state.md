+++
comments = "true"
date = 2020-02-09T06:00:00Z
image = "/uploads/troubleshootingELK.png"
tags = ["cloud", "elasticsearch", "troubleshooting"]
title = "Recuperar un cluster de Elasticsearch en Red State "

+++
El estado de salud de un clúster de Elasticsearch es: verde, amarillo o rojo. El estado deseable siempre será verde y en caso de que sea amarillo o rojo debemos realizar algunas tareas. En esta ocasión quiero compartir como solucionar este tipo de problemas.

El estado del nivel de un índice está determinado por el peor estado del shard. El estado del todo clúster está determinado por el peor estado de los índices. Por lo tanto si un shard está en estado rojo (red state), todo el cluster tendrá este estado. Independientemente de que otros indices estén con estado green.

Los estados son posibles son:

* Verde: Todos los shards están asignados.
* Amarillo: odos los fragmentos primarios están asignados, pero uno o más fragmentos de réplica no están asignados. Si falla un nodo en el clúster, algunos datos podrían no estar disponibles hasta que se repare ese nodo.
* Rojo: Uno o más fragmentos primarios no están asignados, por lo que algunos datos no están disponibles.

Para conocer la salud del cluster hacemos uso de la [API de Health](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-health.html), haciendo una petición a uno de los nodos master:

    curl -X GET "192.168.100.08:9200/_cluster/health?level=indices&pretty" 
    {
      "cluster_name" : "elkcluster",
      "status" : "green",
      "timed_out" : false,
      "number_of_nodes" : 6,
      "number_of_data_nodes" : 3,
      "active_primary_shards" : 11,
      "active_shards" : 22,
      "relocating_shards" : 0,
      "initializing_shards" : 0,
      "unassigned_shards" : 0,
      "delayed_unassigned_shards" : 0,
      "number_of_pending_tasks" : 0,
      "number_of_in_flight_fetch" : 0,
      "task_max_waiting_in_queue_millis" : 0,
      "active_shards_percent_as_number" : 100.0,
      "indices" : {
        "hnginx_index" : {
          "status" : "green",
          "number_of_shards" : 1,
          "number_of_replicas" : 1,
          "active_primary_shards" : 1,
          "active_shards" : 2,
          "relocating_shards" : 0,
          "initializing_shards" : 0,
          "unassigned_shards" : 0
        }
      }
    }

Esta petición nos muestra algunas metricas interesantes ademas del estado. como el numero de shards y de replicas así como sus estados.

## Recuperar un cluster

Recientemente me ocurrió que  los datanodes de un cluster de Elaticsearch tuvieron una falla inesperada. Esto llevó a que el cluster estuviera en un estado erróneo  entonces quiero compartir como diagnosticar y recuperarse de este problema.

Pueden existir múltiples razones para que la salud de un cluster no esté ok (green). Las más comunes es un reinicio de algún nodo del clster que no volvió correctamente o algún fallo en el sistema de archivos que impide leer los datos de los indices.

Como mencionaba, los 3 data nodes que forman el cluster fallaron repentinamente, estos nodos son los que almacenan la información de los indices. Uno de los datanodes no se pudo recuperar, es decir se perdió la información que estaba almacenada en él. Para diagnosticar y recuperar los indices  realicé el siguiente procedimiento:

Listar los indices:

Consultamos la API de Elasticsearch en alguno de los nodos master:

    $ curl -X GET "192.168.100.08:9200/_cat/indices"
    red open nginx_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    red open mysql_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    red open app_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    red open .kibana_task_manager_1   oOEtt0lfQHuEmCbyCI-89Q 1 0    
    red open .apm-agent-configuration S7nw9JjOTb-otrVd1b1Yyw 1 0    
    red open .kibana_1                HKRmItRhSF2PWhBwWCdztQ 1 0    

Podemos ver que los indices están en estado **red**.

Mediante [la API de allocation](https://www.elastic.co/guide/en/elasticsearch/reference/6.6/cluster-allocation-explain.html), obtener el allocation status del cluster:

    [root@vas03v01director ~]# curl -X GET "192.168.100.08:9200/_cluster/allocation/explain?pretty=true"
    {
      "index" : "nginx_index",
      "shard" : 0,
      "primary" : true,
      "current_state" : "unassigned",
      "unassigned_info" : {
        "reason" : "NODE_LEFT",
        "at" : "2020-01-02T15:00:14.362Z",
        "details" : "node_left [QBcJ8vMyQ-SbgfVoRLh3lw]",
        "last_allocation_status" : "no_valid_shard_copy"
      },
      "can_allocate" : "no_valid_shard_copy",
      "allocate_explanation" : "cannot allocate because a previous copy of the primary shard existed but can no longer be found on the nodes in the cluster"
    }

Podemos observar varios puntos:

* En el indice nginx_index, el estado del shard 0 es: "unassigned"
* La explicación en "allocate_explanation" nos dice: "No se puede asignar porque existía una copia anterior del shard  primario pero ya no se puede encontrar en los nodos de clúster"
* Esto sucedió debido a que el nodo tenía el shard  primario salió del clúster durante el reinicio.

Listamos los nodos:

    $  curl -X GET "192.168.100.08:9200/_cat/nodes?v&h=id,ip,port,n"
    id   ip            port n
    B_tU 10.32.237.208 9300 master01
    QvF3 10.32.237.210 9300 master03
    lqGv 10.32.237.209 9300 vmaster02

Podemos observar que solo están los masternodes. Vamos a encender los servidores datanode que fallaron e iniciamos el servicio de elasticsearch:

    systemctl start elasticsearch
    Starting elasticsearch (via systemctl):                    [  OK  ]

Listamos los nodos:

    curl -X GET "192.168.100.08:9200/_cat/nodes?v&h=id,ip,port,n"
    id   ip            port n
    B_tU 192.168.100.208 9300 master01
    QvF3 192.168.100.210 9300 master03
    QBcJ 192.168.100.213 9300 data03
    lqGv 192.168.100.209 9300 master02
    Ltba 192.168.100.211 9300 data01

En este caso el nodo data02 no se pudo recuperar.  Se restauró este nodo desde el volumen del data01. Por lo tanto tenía la misma información.

Modifiqué los archivos de configuración de red para restaurar la IP anterior y también realicé las modificaciones pertinentes en  _/etc/elasticsearch/elasticsearch.yml_ para colocar la IP y el nombre original del nodo data02.

Al iniciar el servicio de elasticsearch, el servicio levanta ok, pero no se une al clúster y podemos leer en los logs:

    Caused by: java.lang.IllegalArgumentException: can't add node {data02} found existing node {data01} with the same id but is a different node instance

Elasticsearch detecta que dps  nodos tienen el mismo ID. Pues el datanode02 es una copia del datanode01. Para solucionar esto, se debe eliminar el contenido de _/var/lib/elasticsearch_ en el nodo clon.

En este caso en el nodo data02:

    $  pwd
    /var/lib/elasticsearch
    $  rm -rf *
    $ service elasticsearch restart
    Restarting elasticsearch (via systemctl):                  [  OK  ]

Listamos los nodos:

    $ curl -X GET "192.168.100.08:9200/_cat/nodes?v&h=id,ip,port,n"
    id   ip            port n
    cR4P 192.168.100.212 9300 data02
    B_tU 192.168.100.208 9300 master01
    QvF3 192.168.100.210 9300 master03
    QBcJ 192.168.100.213 9300 data03
    lqGv 192.168.100.209 9300 master02
    Ltba 192.168.100.211 9300 data01

Y ya podemos ver el nodo data02 en el cluster.

Listamos los indices:

    $ curl -X GET "192.168.100.08:9200/_cat/indices"
    green open nginx_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    green open mysql_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    green open app_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    green open .kibana_task_manager_1   oOEtt0lfQHuEmCbyCI-89Q 1 0    
    green open .apm-agent-configuration S7nw9JjOTb-otrVd1b1Yyw 1 0    
    green open .kibana_1                HKRmItRhSF2PWhBwWCdztQ 1 0

Y ya todos muestran el estado en green, lo que significa que todo está bien.

De esta manera podemos recuperar un cluster de Elasticsearch de una falla masiva incluso si perdemos información de algún nodo.

## Escalabilidad y resiliencia: shards y replicas

Me gustaría mencionar dos concepros que debemos tener claros para terminos de alta disponibildiad.

**¿Qué es la fragmentación?** Elasticsearch es extremadamente escalable debido a su arquitectura distribuida. Una de las razones por las cuales  logra esto es la fragmentación.  ¿Por qué es necesario?  Supongamos que tenemos un índice que contiene muchos documentos, con un total de 1 terabyte de datos. Si tenemos dos nodos en el clúster, cada uno con 512 gigabytes disponibles para almacenar datos, el índice completo no cabrá en ninguno de los nodos, por lo que es necesario dividir los datos del índice de alguna manera, o de lo contrario estaríamos sin espacio en disco.

En escenarios como este donde el tamaño de un índice excede los límites de hardware de un solo nodo se resuelve dividiendo el índice en piezas más pequeñas llamadas fragmentos o shards. Por lo tanto, un fragmento contendrá un subconjunto de datos de un índice. Cuando un índice está fragmentado, un documento dado dentro de ese índice solo se almacenará dentro de uno de los fragmentos.

Hay dos razones principales por las que la fragmentación es importante, y la primera es que nos permite dividir y, por lo tanto, escalar volúmenes de datos. La otra razón por la que el fragmentación es importante es que las operaciones se pueden distribuir entre múltiples nodos y, por lo tanto, paralelizarse. Esto da como resultado un mayor rendimiento, ya que varias máquinas pueden trabajar potencialmente en la misma consulta.

**¿Qué es la replicación?** Ahora bien, teniendo clara la fragmentación tenemos que considerar la replicación. Cuantos más nodos  agregamos, mayor será el riesgo de que alguno deje de funcionar. Ahí es donde entra en juego la replicación.

Elasticsearch admite de forma nativa la replicación de sus fragmentos (shards), lo que significa que los fragmentos se copian.

La replicación tiene dos propósitos, el principal es proporcionar alta disponibilidad en caso de que los nodos o fragmentos fallen.  Para que la replicación sea  efectiva s los fragmentos de réplica nunca se asignan a los mismos nodos que los fragmentos primarios. El otro propósito de la replicación, o quizás un beneficio secundario, es un mayor rendimiento para las consultas de búsqueda. Este es el caso porque las búsquedas se pueden ejecutar en todas las réplicas en paralelo, lo que significa que las réplicas son en realidad parte de las capacidades de búsqueda del clúster.

**¿Entonces?** En el caso anterior que vimos, todos los indices tenian asigandos solo el shard primario y no había replicas. Para mejorar la disponibilidad y resiliencia vamos a crear  3 shards para que se distribuyan una en cada nodo, pues contamos con 3 datanodes y además crearemos una 1 réplica para tener los datos duplicados. En caso de perder un nodo, habrá otro nodo que pueda responder a las consutas con los datos necesarios gracias a la replicación.

La configuración quedaría así:

![](/uploads/elasticsearch_shards_replicas.png)

Referencias:

* [https://www.elastic.co/guide/en/elasticsearch/reference/current/glossary.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/glossary.html "https://www.elastic.co/guide/en/elasticsearch/reference/current/glossary.html")
* [https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html "https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html")
* [https://qbox.io/blog/optimizing-elasticsearch-how-many-shards-per-index](https://qbox.io/blog/optimizing-elasticsearch-how-many-shards-per-index "https://qbox.io/blog/optimizing-elasticsearch-how-many-shards-per-index")
* [https://www.siscale.com/elasticsearch-shard-optimization/](https://www.siscale.com/elasticsearch-shard-optimization/ "https://www.siscale.com/elasticsearch-shard-optimization/")

Si te resulta útil, por favor comparte =)