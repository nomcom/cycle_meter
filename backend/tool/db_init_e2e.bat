REM @echo off
REM UTF-8
chcp 65001
REM package.jsonと同じフォルダから実行されることを想定している
REM callで実行しないとnpx実行終了後にbatも終了してしまう
setlocal
REM Docker起動
call docker\start_docker.bat

REM 接続先
set ROOT_PATH=./prisma
call npx prisma db push --schema=%ROOT_PATH%/schema.prisma
call npx prisma db push --schema=%ROOT_PATH%/schema_append.prisma
endlocal