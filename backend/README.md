# node_rest_server

# Install

```
npm install
npx env-cmd -f config/dev.env   npx prisma db push --schema=./prisma/schema.prisma
npx env-cmd -f config/dev.env   npx prisma db push --schema=./prisma/schema_append.prisma
```

# Prisma vs TypeORM

## TypeORM

- DataSource API (v0.3.x)
- config の仕様が未確定（公式情報少ない）
  - Entity,Migration の Path 指定がうまくいかない
- まだメジャーバージョンなしで、破壊的更新が入る（現時点でも v0.2 情報が使えない）
- Migration で作られるのは TS or JS

## Prisma

- Model クラスの他に、Schema 定義をする必要がある（Model 肥大化を防げる？）
  - Schema 定義で provider(DB 種類)が外だしできない
    - テストの時だけ SQLite を使うには、専用の Client を作成しておく？
- Migration で作られるのは SQL

- UT/(Client UT 用疑似サーバ起動)
  - schema を切り替え(SQLite), Client Generate (npx prisma db push)
  - Migration はなし
- IT/実運用環境

  - IT 環境＝.env を使用(URL ＝接続先)。実運用環境はシステム環境変数に定義。
  - Migration はあり
  - reset もあり

- コマンドごとの仕様
  - client 生成(prisma generate) にサーバは必要ない
  - 生成される client は provider(DB 種類)ごとに中身が異なるものになる

### 方針

- 開発環境の基本状態
  - provider(DB 種類)は本番と同じ(=schema ファイルも同じ)
  - 環境変数に応じて接続先を変更
    - 環境変数は git 管理下の設定ファイル(.env)にて設定
  - 本番適用用の Migration を作成
- 本番環境

  - 開発環境をそのまま使用するが、システムで環境変数を設定して接続先を変更

- UT/その他必要に応じて
  - DEBUG 環境変数などによって provider(DB 種類)を SQLite に変更
  - 基本的に毎回初期化 reset
  - データ取得処理がエラーにならないように

# Windows サービス化

```
https://github.com/coreybutler/node-windows#windows-services
```

1. Install

```
npm install node-windows
npm link node-windows
```

※アプリを移動すると異常になりそう。global インストールすればよいらしい

2. 登録

`tool\reg_service.js` には app.js の絶対パスを指定

```
node tool\reg_service.js
```
