#!/usr/bin/env bash

docker-compose exec db bash -c 'mysqldump -uroot -p clog > /backup/clog_dump.sql'