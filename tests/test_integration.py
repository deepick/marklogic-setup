"""
tests application of CMA and trigger configs using curl.

using curl (rather then python requests) keeps HTTP requests
generic

"""

import unittest
import subprocess
import json
import time

import requests
from requests.auth import HTTPDigestAuth

import pytest


def check_resource_exists(test_cma_creds, test_rma_url, path):
    """utility function to check if MarkLogic resource exists using manage/v2"""
    creds = test_cma_creds.split(":")
    response = requests.get(
        f"{test_rma_url}/{path}",
        headers={"Accept": "application/json"},
        auth=HTTPDigestAuth(creds[0], creds[1]),
    )
    return response.status_code == 200


def test_marklogic_is_accessible(test_marklogic_alive_url, test_cma_creds):
    """test for checking that marklogic is alive and accessible"""
    creds = test_cma_creds.split(":")
    response = requests.get(
        f"{test_marklogic_alive_url}",
        headers={"Accept": "application/json"},
        auth=HTTPDigestAuth(creds[0], creds[1]),
    )
    assert response.status_code == 200


def test_curl_command_is_avail_can_access_marklogic(
    command_curl, test_cma_url, test_cma_creds
):
    """curl command should be able to access test MarkLogic cluster"""
    cmd = [
        command_curl,
        "--anyauth",
        "--user",
        test_cma_creds,
        f"{test_cma_url}?format=json",
    ]
    curl_result = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    assert curl_result.stdout is not None
    assert curl_result.returncode == 0


def test_apply_cma_configuration_with_curl(
    command_curl, test_cma_url, test_rma_url, test_cma_creds
):
    """create configuration and apply using curl"""
    with open("etc/config.json", "r") as json_file:
        data = json.load(json_file)
    cmd = [
        command_curl,
        "--anyauth",
        "--user",
        test_cma_creds,
        "-v",
        "-H",
        "Content-type: application/json",
        "-d",
        json.dumps(data),
        f"{test_cma_url}?format=json",
    ]
    curl_result = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    print(curl_result.returncode)
    print(curl_result.stdout)
    assert curl_result.returncode == 0

    # we could introspect :8001/admin/v1/timestamp if cluster is quiescent
    # but this should be enough on slower environments
    time.sleep(5)

    # sanity check resources have been created
    # databases and forests exist
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "databases/kerndaten-crawler-modules"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "forests/kerndaten-crawler-modules-1"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "databases/kerndaten-schemas"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "forests/kerndaten-schemas-1"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "databases/kerndaten-triggers"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "forests/kerndaten-triggers-1"
    )
    assert check_resource_exists(test_cma_creds, test_rma_url, "databases/kerndaten")
    assert check_resource_exists(test_cma_creds, test_rma_url, "forests/kerndaten-1")
    assert check_resource_exists(test_cma_creds, test_rma_url, "forests/kerndaten-2")
    assert check_resource_exists(test_cma_creds, test_rma_url, "forests/kerndaten-3")

    # privs exists
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "privileges/kerndaten-uri?kind=uri"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "privileges/crawler-uri?kind=uri"
    )
    # user exists
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "users/kerndaten-crawler"
    )
    # roles exists
    assert check_resource_exists(test_cma_creds, test_rma_url, "roles/kerndaten-reader")
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "roles/kerndaten-rest-reader"
    )
    assert check_resource_exists(test_cma_creds, test_rma_url, "roles/kerndaten-writer")
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "roles/kerndaten-rest-writer"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "roles/kerndaten-crawler"
    )
    # servers exists
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "servers/deepick-kerndaten?group-id=Default"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "servers/deepick-kerndaten.odbc?group-id=Default"
    )
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "servers/deepick-kerndaten.rest?group-id=Default"
    )


def test_create_trigger_with_curl(command_curl, test_rma_url, test_cma_creds):
    """create configuration and apply using curl"""
    with open("etc/trigger.json", "r") as json_file:
        data = json.load(json_file)
    cmd = [
        command_curl,
        "--anyauth",
        "--user",
        test_cma_creds,
        "-v",
        "-H",
        "Content-type: application/json",
        "-d",
        json.dumps(data),
        f"{test_rma_url}/databases/kerndaten/triggers?format=json",
    ]
    curl_result = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    print(curl_result.returncode)
    print(curl_result.stdout)
    assert curl_result.returncode == 0

    # sanity check trigger has been created
    assert check_resource_exists(
        test_cma_creds, test_rma_url, "databases/kerndaten/triggers/only-one-crawler"
    )


if __name__ == "__main__":
    unittest.main()
