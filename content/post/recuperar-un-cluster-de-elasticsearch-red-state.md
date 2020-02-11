+++
comments = "true"
date = 2020-02-24T06:00:00Z
draft = true
image = ""
tags = ["cloud", "elasticsearch", "troubleshooting"]
title = "Recuperar un cluster de Elasticsearch - Red State "

+++
Recientemente  los datanodes de un cluster de Elaticsearch tuvieron una falla inesperada. Esto llevó a que el cluster estuviera en un estado erróneo  y en esta ocasión explico como diagnosticar y recuperarse de este problema.

Como mencionaba, los 3 data nodes que forman el cluster fallaron repentinamente, estos nodos son los que almacenan la información de los indices. Para diagnosticar y recuperar los indices  realicé el siguiente procedimiento:

Listar los indices:

    [root@vas03v01director ~]# curl -X GET "10.32.237.208:9200/_cat/indices"
    red open nginx_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    red open mysql_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    red open app_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    
    red open .kibana_task_manager_1   oOEtt0lfQHuEmCbyCI-89Q 1 0    
    red open .apm-agent-configuration S7nw9JjOTb-otrVd1b1Yyw 1 0    
    red open .kibana_1                HKRmItRhSF2PWhBwWCdztQ 1 0    

Podemos ver que los indices están en estado **red**.

Mediante [la API de allocation](https://www.elastic.co/guide/en/elasticsearch/reference/6.6/cluster-allocation-explain.html), obtener el allocation status del cluster:

    [root@vas03v01director ~]# curl -X GET "10.32.237.208:9200/_cluster/allocation/explain?pretty=true"
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

Listamos los nodos para conocer su ID:

    $  curl -X GET "10.32.237.208:9200/_cat/nodes?v&h=id,ip,port,n"
    id   ip            port n
    B_tU 10.32.237.208 9300 vas03v01elkmaster01
    QvF3 10.32.237.210 9300 vas03v01elkmaster03
    lqGv 10.32.237.209 9300 vas03v01elkmaster02

Podemos observar que solo están los masternodes. Vamos a encender los servidores datanode e iniciamos el servicio de elasticsearch:

    systemctl start elasticsearch

    Starting elasticsearch (via systemctl):                    [  OK  ]

La ID que se menciona en node_left \[\] en el comando anterior ya no existe porque era el ID del servidor que se reinició y este  cambia después de cada reinicio.