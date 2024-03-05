setlocal

cd /d %~dp0
docker-compose down --rmi all --volumes --remove-orphans

endlocal