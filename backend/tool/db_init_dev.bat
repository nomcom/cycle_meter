REM @echo off
REM UTF-8
chcp 65001
REM package.jsonと同じフォルダから実行されることを想定している
REM callで実行しないとnpx実行終了後にbatも終了してしまう
setlocal
set ROOT_PATH=./prisma
set PARTS_PATH=%ROOT_PATH%/parts
set DATASOURCES_PATH=%ROOT_PATH%/datasources

REM 静的型チェックなど用に本番と同じClientのみ生成
call npx cpx %DATASOURCES_PATH%/base/datasource.prisma %PARTS_PATH%/base/ignore/
call npx prisma-import -s %PARTS_PATH%/base/**/*.prisma -o %ROOT_PATH%/schema.prisma -f
call npx prisma generate --schema=%ROOT_PATH%/schema.prisma

call npx cpx %DATASOURCES_PATH%/append/datasource.prisma %PARTS_PATH%/append/ignore/
call npx prisma-import -s %PARTS_PATH%/append/**/*.prisma -o %ROOT_PATH%/schema_append.prisma -f
call npx prisma generate --schema=%ROOT_PATH%/schema_append.prisma

REM デバッグ接続用のSQLite DB
call npx cpx  %DATASOURCES_PATH%/base/dev/datasource.prisma %PARTS_PATH%/base/ignore/
call npx prisma-import -s %PARTS_PATH%/base/**/*.prisma -o %ROOT_PATH%/dev/schema.prisma -f
call npx prisma db push --schema=%ROOT_PATH%/dev/schema.prisma

call npx cpx  %DATASOURCES_PATH%/append/dev/datasource.prisma %PARTS_PATH%/append/ignore/
call npx prisma-import -s %PARTS_PATH%/append/**/*.prisma -o %ROOT_PATH%/dev/schema_append.prisma -f
call npx prisma db push --schema=%ROOT_PATH%/dev/schema_append.prisma
endlocal