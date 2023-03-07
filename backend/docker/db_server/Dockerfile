FROM postgres:14.2-alpine
ENV LANG ja_JP.utf8

ENV POSTGRES_USER "postgres"
ENV POSTGRES_PASSWORD "postgres"
ENV POSTGRES_DB "postgres"
ENV PGPASSWORD "${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} ${POSTGRES_DB}"

# Create a config directory
RUN mkdir -p /usr/config
WORKDIR /usr/config

# Bundle config source
# コンテナ起動後に実行するファイル、SQLなどをコピーしておく
# 実際の実行はこのファイル最後でコピーしているentrypoint.shで行われる
COPY ./sampledata/*.sql /usr/config

# save env data
RUN mkdir -p /usr/config/data
RUN echo "${POSTGRES_USER}" > /usr/config/data/user
RUN echo "${POSTGRES_PASSWORD}" > /usr/config/data/password
RUN echo "${POSTGRES_DB}" > /usr/config/data/db

# 以下ディレクトリに配置すると、コンテナ起動時に自動的に実行される
COPY *.sh /docker-entrypoint-initdb.d/
