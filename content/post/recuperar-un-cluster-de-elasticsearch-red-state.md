+++
comments = "true"
date = 2020-02-09T06:00:00Z
draft = true
image = "/uploads/troubleshootingELK.png"
tags = ["cloud", "elasticsearch", "troubleshooting"]
title = "Recuperar un cluster de Elasticsearch en Red State "

+++

    curl -X GET "192.168.100.08:9200/_cluster/health?level=indices&pretty" 

{

  "cluster_name" : "vas03v01elkcluster",

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

    "heat_rhosp_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "cinder_rhosp_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "glance_rhosp_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "ceph_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    ".kibana_task_manager_1" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    ".apm-agent-configuration" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "keystone_rhosp_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "nova_rhosp_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "horizon_rhosp_index" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    ".kibana_1" : {

      "status" : "green",

      "number_of_shards" : 1,

      "number_of_replicas" : 1,

      "active_primary_shards" : 1,

      "active_shards" : 2,

      "relocating_shards" : 0,

      "initializing_shards" : 0,

      "unassigned_shards" : 0

    },

    "neutron_rhosp_index" : {

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

## Recuperar un cluster

Pueden existir múltiples razones para que la salud de un cluster no esté ok (green).

Recientemente  los datanodes de un cluster de Elaticsearch tuvieron una falla inesperada. Esto llevó a que el cluster estuviera en un estado erróneo  y me  como diagnosticar y recuperarse de este problema.

Como mencionaba, los 3 data nodes que forman el cluster fallaron repentinamente, estos nodos son los que almacenan la información de los indices. 1 de los datanodes no se pudo recuperar. Para diagnosticar y recuperar los indices  realicé el siguiente procedimiento:

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

Podemos observar que solo están los masternodes. Vamos a encender los servidores datanode e iniciamos el servicio de elasticsearch:

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

Modifiqué los archivos de configuración de red para restaurar la IP anterior y también realicé las modificaciones pertinentes en  /etc/elasticsearch/elasticsearch.yml para colocar la IP y el nombre original del nodo data02.

Al iniciar el servicio de elasticsearch, el servicio levanta ok, pero no se une al clúster y podemos leer en los logs:

    Caused by: java.lang.IllegalArgumentException: can't add node {data02} found existing node {data01} with the same id but is a different node instance

Elasticsearch detecta que 2 nodos tienen el mismo ID. Pues el datanode02 es una copia del datanode01. Para solucionar esto, se debe eliminar el contenido de /var/lib/elasticsearch en el nodo clon.

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

Si te resulta útil, por favor comparte =)