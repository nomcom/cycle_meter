
#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend
npm install
chmod a+x ./tool/db_init_dev.sh
./tool/db_init_dev.sh
