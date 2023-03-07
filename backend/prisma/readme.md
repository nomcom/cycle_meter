# Prisma によるモデル管理

- `schema.prisma`、`schema_append.prisma` ファイル

  - Prisma の対象とする schema (prisma-import から生成されることを想定。手動で編集した場合は、以下フォルダに反映)

- `parts`、`datasources` フォルダ

  - prisma-import により結合されることを想定
  - VSCode の Extension(ajmnz.prisma-import)をインストールすること
  - `datasources` フォルダ配下から接続先をコピーし、`parts` フォルダ配下の shcema ファイルが結合される
