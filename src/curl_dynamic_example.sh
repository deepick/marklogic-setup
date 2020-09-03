#!/usr/bin/env bash
# example of creating a user using CMA interface with dynamic values via curl http request
# %%tokens%% contained in test_dynamic.json will be transcluded
#
# note - if there is latency or slow operation of MarkLogic cluster
#        please set the curl -m option to define max timeout.

curl --anyauth --user admin:admin         \
      -H "Content-type: application/json" \
      -d@../etc/test_dynamic.json          \
      http://localhost:8002/manage/v3

