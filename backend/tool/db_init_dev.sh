
#!/usr/bin/env bash
# exit on error
set -o errexit

ROOT_PATH=./prisma
npx prisma db push --schema=$ROOT_PATH/schema.prisma
npx prisma db push --schema=$ROOT_PATH/schema_append.prisma
