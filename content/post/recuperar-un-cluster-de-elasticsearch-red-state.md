+++
comments = "true"
date = 2020-02-24T06:00:00Z
draft = true
image = ""
tags = ["devops", "architecture", "cloud", "development", "best practices", "containers", "GCP", "azure", "aws", "CloudOps"]
title = "Recuperar un cluster de Elasticsearch - Red State "

+++
Listar los indices:

    [root@vas03v01director ~]# curl -X GET "10.32.237.208:9200/_cat/indices"

    red open nginx_index               T-n9kSkGQ6qGJeyzGKLrdQ 1 1    

    red open .kibana_task_manager_1   oOEtt0lfQHuEmCbyCI-89Q 1 0    

    red open .apm-agent-configuration S7nw9JjOTb-otrVd1b1Yyw 1 0    

    red open .kibana_1                HKRmItRhSF2PWhBwWCdztQ 1 0    

Podemos ver que el indice está en estado red.

Mediante la API de allocation, obtener el status:

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

    