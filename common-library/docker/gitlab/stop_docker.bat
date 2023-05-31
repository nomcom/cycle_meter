@echo off
setlocal

cd /d %~dp0
REM ê›íË
set DIST=Ubuntu
set GITLAB_CONTAINER_NAME=gitlab

wsl -d %DIST% -e sudo docker stop %GITLAB_CONTAINER_NAME%
REM wsl -d %DIST% -e sudo docker rm %GITLAB_CONTAINER_NAME%

endlocal