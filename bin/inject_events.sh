#!/usr/bin/env bash
COMMAND='npm start'
if [ -z $1 ] -a [ $1 == "stress" ]; then  
  COMMAND='npm run stress'  
fi
echo Executing ${COMMAND}
docker-compose run --rm injector ${COMMAND}