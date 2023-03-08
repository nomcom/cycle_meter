REM @echo off
REM UTF-8
chcp 65001

cd /d %~dp0
REM Docker起動
call docker\db\start_docker.bat

REM *** FRONTEND ***
setlocal
cd ..\frontend
REM ビルド
call npm run build
REM deploy
call npm run deploy
endlocal

REM *** BACKEND ***
setlocal
cd ..\backend
REM DBクライアント生成
REM callで実行しないと、各行の処理後にbatも終了してしまう
call npx env-cmd -f .env.e2e prisma db push --schema=./prisma/schema.prisma
call npx env-cmd -f .env.e2e prisma db push --schema=./prisma/schema_append.prisma

REM ビルド
call npm run build
REM DB接続先を指定してbackend起動
call npx env-cmd -f .env.e2e npm run start
endlocal

