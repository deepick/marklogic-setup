"""
setup default fixtures for tests

command_curl: path to curl
test_rma_url: MarkLogic manage/v2 endpoint
test_cma_url: MarkLogic manage/v3 endpoint
test_marklogic_alive_url: MarkLogic admin/v1/timestamp endpoint
test_cma_creds: default admin user creds
"""

import os
import pytest


@pytest.fixture
def command_curl():
    """define path to curl"""
    if os.environ.get("TEST_CURL_PATH") is not None:
        return os.environ["TEST_CURL_PATH"]
    return "/usr/bin/curl"


@pytest.fixture
def test_rma_url():
    """define MarkLogic manage/v2 URL"""
    if os.environ.get("TEST_MARKLOGIC_HOST") is not None:
        return f"http://{os.environ['TEST_MARKLOGIC_HOST']}:8002/manage/v2"
    return "http://bootstrap:8002/manage/v2"


@pytest.fixture
def test_cma_url():
    """define MarkLogic manage/v3 URL"""
    if os.environ.get("TEST_MARKLOGIC_HOST") is not None:
        return f"http://{os.environ['TEST_MARKLOGIC_HOST']}:8002/manage/v3"
    return "http://bootstrap:8002/manage/v3"


@pytest.fixture
def test_marklogic_alive_url():
    """tests if marklogic cluster is accessible"""
    if os.environ.get("TEST_MARKLOGIC_HOST") is not None:
        return f"http://{os.environ['TEST_MARKLOGIC_HOST']}:8001/admin/v1/timestamp"
    return "http://bootstrap:8001/admin/v1/timestamp"


@pytest.fixture
def test_cma_creds():
    """define MarkLogic creds"""
    if os.environ.get("TEST_CMA_CREDS") is not None:
        return os.environ["TEST_CMA_CREDS"]
    return "admin:admin"
