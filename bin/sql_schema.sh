#!/usr/bin/env bash

# Dumps MySQL schema from mysql to ./backup
docker-compose exec db bash -c 'mysqldump -uroot -p --no-data clog > /backup/clog_sql_schema.sql' 