FROM mcr.microsoft.com/mssql/server:2017-CU28-ubuntu-16.04

ENV MSSQL_DB "DATABASE"
ENV MSSQL_USER "sa"
ENV MSSQL_PASSWORD "P@55word"
ENV ACCEPT_EULA "Y"
ENV SA_PASSWORD "P@55word"

# Create a config directory
RUN mkdir -p /usr/config
WORKDIR /usr/config

# Bundle config source
COPY mssqldocker/* /usr/config
# コンテナ起動後に実行するファイル、SQLなどをコピーしておく
# 実際の実行はentrypoint.sh（configure-db.sh）で行われる
COPY ./sampledata/*.sql /usr/config

# save env data
RUN mkdir -p /usr/config/data
RUN echo "${MSSQL_USER}" > /usr/config/data/user
RUN echo "${MSSQL_PASSWORD}" > /usr/config/data/password
RUN echo "${MSSQL_DB}" > /usr/config/data/db

# Grant permissions for to our scripts to be executable
RUN chmod +x /usr/config/entrypoint.sh
RUN chmod +x /usr/config/configure-db.sh

ENTRYPOINT ["./entrypoint.sh"]

# Tail the setup logs to trap the process
CMD ["tail -f /dev/null"]

HEALTHCHECK --interval=15s CMD /opt/mssql-tools/bin/sqlcmd -U sa -P $SA_PASSWORD -Q "select 1" && grep -q "MSSQL CONFIG COMPLETE" ./config.log
