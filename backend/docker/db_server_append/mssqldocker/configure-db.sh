#!/bin/bash

# For Japanese
locale-gen ja_JP.UTF-8
echo "export LANG=ja_JP.UTF-8" >> ~/.bashrc

# wait for MSSQL server to start
export STATUS=1
i=0

while [[ $STATUS -ne 0 ]] && [[ $i -lt 30 ]]; do
	i=$i+1
	/opt/mssql-tools/bin/sqlcmd -t 1 -U sa -P $SA_PASSWORD -Q "select 1" >> /dev/null
	STATUS=$?
done

if [ $STATUS -ne 0 ]; then 
	echo "Error: MSSQL SERVER took more than thirty seconds to start up."
	exit 1
fi

echo "CREATE DB[${MSSQL_DB}] FOR USER[${MSSQL_USER}]" >> ./config.log


echo "======= MSSQL SERVER STARTED ========" | tee -a ./config.log
# Run the setup script to create the DB and the schema in the DB
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -d master -i setup.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -d "$MSSQL_DB" -i DDL_基幹DB.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -d "$MSSQL_DB" -i INSERT_サンプルデータ_基幹DB.sql

echo "======= MSSQL CONFIG COMPLETE =======" | tee -a ./config.log
