#!/bin/sh

CONTAINER_NAME=gitlab
while true
do
  STATUS=$(docker ps | grep $CONTAINER_NAME)
  echo $STATUS | grep "healthy"
  if [ $? -eq 0 ]
    then echo "$CONTAINER_NAME started!"
    break
  fi
  echo $STATUS
  sleep 3s
done
