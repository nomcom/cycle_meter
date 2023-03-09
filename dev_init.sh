
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

# 静的型チェックなど用に本番と同じClientのみ生成
npx prisma generate --schema=./prisma/schema.prisma
npx prisma generate --schema=./prisma/schema_append.prisma
# 動作用
npx prisma db push --schema=./prisma/dev/schema.prisma
npx prisma db push --schema=./prisma/dev/schema_append.prisma

npm run build