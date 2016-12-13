#!/usr/bin/env bash
cd ../fake_system

for i in {1..10}
do
  SERVER_HOST=localhost node server.js --connections 10 --asynchronous -n 100000 -i $i &
done
