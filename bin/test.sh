#!/usr/bin/env bash
COMMAND=${1:-test}
echo Spinning up test DB...
docker-compose up -d test_db
# Give some time for DB to setup 
sleep 5
docker-compose run --rm test_server npm run ${COMMAND}

echo Closing DB...
docker-compose rm -f test_db
