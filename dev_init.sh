
#!/usr/bin/env bash
# exit on error
set -o errexit

# COMMON
cd common-library
npm install
npm run build
cd ..

# FE
cd frontend
npm install
npm run build
npm run deploy
cd ..

# BE
cd backend
npm install
npm run build

# 静的型チェックなど用に本番と同じClientのみ生成
npx prisma generate --schema=$ROOT_PATH/schema.prisma
npx prisma generate --schema=$ROOT_PATH/schema_append.prisma

ROOT_PATH=./prisma
npx prisma db push --schema=$ROOT_PATH/dev/schema.prisma
npx prisma db push --schema=$ROOT_PATH/dev/schema_append.prisma
