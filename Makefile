.DEFAULT_GOAL := docker-all

##################
# define defaults
##################
docker=`which docker`
dockercompose=`which docker-compose`
src_dir=src
test_dir=tests

##################
# configure tests
##################
# use local targets
export TEST_MARKLOGIC_HOST=localhost
export TEST_CMA_CREDS=admin:admin

# use custom curl
#export TEST_CURL_PATH=/usr/bin/curl

# use this docker image with docker targets which is passed as env var to docker-copose.yml
export MARKLOGIC_DOCKER_IMAGE=store/marklogicdb/marklogic-server:10.0-4.2-dev-centos
# number of nodes to use in docker MarkLogic cluster
NUMBER_CLUSTER_NODES=2

##################
# local targets
##################
lint:
	pylint --exit-zero ${src_dir}/*.py ${test_dir}/*.py

format:
	black **/*.py

test:
	pytest -v tests/test_*.py

##################
# docker targets
##################
docker-lint:
	${docker} exec testrunner make lint

docker-format:
	${docker} exec testrunner make format

docker-test:
	${docker} exec testrunner make test

getDockerImage:
	${docker} pull ${MARKLOGIC_DOCKER_IMAGE} || true

startDocker:
	${docker} network ls | grep internal_net > /dev/null || ${docker} network create internal_net || true
	${docker} network ls | grep external_net > /dev/null || ${docker} network create external_net || true
	${dockercompose} up -d --remove-orphans --scale dnode=${NUMBER_CLUSTER_NODES}|| true

setupDocker: getDockerImage startDocker
	${docker} exec testrunner apt-get install curl
	${docker} exec testrunner pip install pytest black pylint requests

stopDocker:
	${dockercompose} down --remove-orphans || true
	${docker} network delete internal_net || true
	${docker} network delete external_net || true
	${docker} system prune -f || true

runConfigDocker: stopDocker setupDocker

##################
# entrypoints
##################
all: format lint test
docker-all: runConfigDocker docker-format docker-lint docker-test
