#!/usr/bin/env bash
# example of creating a trigger using RMA interface via curl http request
#
# note - if there is latency or slow operation of MarkLogic cluster
#        please set the curl -m option to define max timeout.

curl --anyauth --user admin:admin         \
      -H "Content-type: application/json" \
      -d@../etc/test_trigger.json          \
      http://localhost:8002/manage/v2/databases/kerndaten-triggers/triggers

