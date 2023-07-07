# rest_server_client

[![.github/workflows/build_android.yml](https://github.com/nomcom/cycle_meter/actions/workflows/build_android.yml/badge.svg)](https://github.com/nomcom/cycle_meter/actions/workflows/build_android.yml)

[![Deploy to Firebase Hosting on merge](https://github.com/nomcom/cycle_meter/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/nomcom/cycle_meter/actions/workflows/firebase-hosting-merge.yml)

## Firebase

https://firebase.google.com/docs/cli?authuser=0&hl=ja#windows-npm

1. Firebase CLI のインストール

```
npm install --save-dev firebase-tools
```

2. ログイン

```
npx firebase login

# チェック
npx firebase projects:list
```

認証画面が表示される。（Firebase CLI が Google アカウントへのアクセスをリクエストしています → 「許可」）

3. 初期化
   対象 PJ フォルダ内で以下を実行

```
npx firebase init
```

4. デプロイ

```
npx firebase deploy
```

# システム構成

## Secretキー
### frontend
- BackEnd(DBデータ取得先) Rest URL
   - VITE_REST_URL_BASE
- Firebase用
   - VITE_STORAGEBUCKET
- Google Map表示用
   - VITE_GOOGLE_MAP_API_KEY

#### 取得元
##### デバッグ環境(npm run dev == vite)
1. .envに直書き
2. フレームワークviteがts内でimport.meta.env.xxxの形に使用可能となるように展開

##### 本番環境(npm run deploy)
1. .envに直書き
2. フレームワークviteがbuild時にjsに埋め込み ★要改善
3. 本番環境にjsをデプロイ

### mobile
- Firebase用
   - APIKEY
   - AUTHDOMAIN
   - DATABASEURL
   - PROJECTID
   - STORAGEBUCKET
   - APPID
- Google Map表示用
   - GOOGLEMAP_ANDROID_API_KEY
- Expoビルド用
   - EXPO_TOKEN
  
##### デバッグ環境(npm run dev == vite)
T.B.D

##### GitHub Actionsビルド
1. GitHub ActionsのSecretsに設定
2. Actionsのワークフローymlで、Expoビルド(EAS)時の環境変数に設定
3. Expoビルド時の設定(app.config.ts)で、任意の環境変数(process.env.xxx)を設定
4. ビルドされたアプリ内でConstants.expoConfig.extra.xxxの形で使用可能



## 構成図

![system](./system.drawio.svg)

