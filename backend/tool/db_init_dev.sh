
#!/usr/bin/env bash
# exit on error
set -o errexit

ROOT_PATH=./prisma
PARTS_PATH=$ROOT_PATH/parts
DATASOURCES_PATH=$ROOT_PATH/datasources

# 静的型チェックなど用に本番と同じClientのみ生成
npx cpx $DATASOURCES_PATH/base/datasource.prisma $PARTS_PATH/base/ignore/
npx prisma-import -s $PARTS_PATH/base/**/*.prisma -o $ROOT_PATH/schema.prisma -f
npx prisma generate --schema=$ROOT_PATH/schema.prisma

npx cpx $DATASOURCES_PATH/append/datasource.prisma $PARTS_PATH/append/ignore/
npx prisma-import -s $PARTS_PATH/append/**/*.prisma -o $ROOT_PATH/schema_append.prisma -f
npx prisma generate --schema=$ROOT_PATH/schema_append.prisma

# デバッグ接続用のSQLite DB
npx cpx  $DATASOURCES_PATH/base/dev/datasource.prisma $PARTS_PATH/base/ignore/
npx prisma-import -s $PARTS_PATH/base/**/*.prisma -o $ROOT_PATH/dev/schema.prisma -f
npx prisma db push --schema=$ROOT_PATH/dev/schema.prisma

npx cpx  $DATASOURCES_PATH/append/dev/datasource.prisma $PARTS_PATH/append/ignore/
npx prisma-import -s $PARTS_PATH/append/**/*.prisma -o $ROOT_PATH/dev/schema_append.prisma -f
npx prisma db push --schema=$ROOT_PATH/dev/schema_append.prisma
