#!/usr/bin/env bash
COMMAND=${1:-tdd}

docker-compose run --rm test_server npm run ${COMMAND}

# docker rm -f clog_test_db_1
# docker rm -f clog_test_redis_1