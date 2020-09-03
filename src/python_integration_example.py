"""
TBD

example of applying CMA configuration via python requests module
"""
import json
import requests
from requests.auth import HTTPDigestAuth

with open("../etc/test_config.json", "r") as json_file:
    data = json.load(json_file)

creds = ["admin", "admin"]
response = requests.post(
    "http://localhost:8002/manage/v3",
    data=json.dumps(data),
    headers={"Accept": "application/json", "content-type": "application/json"},
    auth=HTTPDigestAuth(creds[0], creds[1]),
)
print(str(response.status_code))
