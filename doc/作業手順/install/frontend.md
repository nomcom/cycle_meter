# frontend Install

インストール後の最終的なディレクトリ構成
```
TOP/
└─【プロジェクト名】/
    ├─dist/                     ...(npm run build時に作成)ビルド先&デプロイ元
    ├─public/                   ...静的ファイル配置用
    ├─src/
    ├─postcss.config.js         ...Tailwindから
    ├─tailwind.config.js        ...Tailwindから
    ├─.firebaserc               ...Firebaseから
    ├─database.rules.json       ...Firebaseから
    ├─firebase.json             ...Firebaseから
    └─
```

## Node, TypeScript

Node, TypeScriptをインストールして、npmのパスを通す。※省略

## Vite

Frontend開発環境/ビルドツール
https://ja.vitejs.dev/guide/

1. プロジェクト作成＆初期化
```
npm create vite@latest
```

以降は、コンソール画面に従って選択肢を選ぶ。
```
√ Project name: ... 【プロジェクト名】
? Select a framework: » - Use arrow-keys. Return to submit.
    Vanilla
    Vue
>   React
```
※【プロジェクト名】のサブフォルダが生成される

```
? Select a variant: » - Use arrow-keys. Return to submit.
>   TypeScript
```
```
cd 【プロジェクト名】
npm install 
```


## CSS系

### Tailwind CSS

CSSのフレームワーク
https://tailwindcss.com/docs/guides/vite

1. インストール＆初期化
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. 設定ファイル(tailwind.config.js)修正 ※URLのインストール手順参照
3. index.css修正 ※URLのインストール手順参照

### daisyUI 

Tailwind CSS用プラグイン
https://daisyui.com/docs/install/

1. インストール
```
npm i -D daisyui@latest
```

2. 設定ファイル(tailwind.config.js)修正 ※URLのインストール手順参照


## アプリ構成によって任意

### Firebase

- ビルド後のjs/cssホスト先として使用 (Hosting)
https://firebase.google.com/docs/web/setup?hl=ja

- DBサーバとして使用 (Realtime Database)
https://firebase.google.com/docs/database/web/start?hl=ja


1. Firebase プロジェクトを作成
2. インストール
```
npm install firebase
```
3. Firebase CLI のインストール (Firebase Hosting を使用する場合)
```
npm install firebase-tools
npx firebase login
npx firebase init
```

以降は、コンソール画面に従って選択肢を選ぶ。
```
? Are you ready to proceed? Yes
? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your choices. (Press <space> to select, <a> to toggle 
all, <i> to invert selection, and <enter> to proceed)
 ( ) Frameworks: Get started with Frameworks projects.
 (*) Realtime Database: Configure a security rules file for Realtime Database and (optionally) provision default instance
 ( ) Firestore: Configure security rules and indexes files for Firestore
>( ) Functions: Configure a Cloud Functions directory and its files
 (*) Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys
 (*) Hosting: Set up GitHub Action deploys
 ( ) Storage: Configure a security rules file for Cloud Storage
(Move up and down to reveal more choices)


=== Project Setup

? Please select an option: (Use arrow keys)
> Use an existing project
  Create a new project
  Add Firebase to an existing Google Cloud Platform project
  Don't set up a default project
  
? It seems like you haven’t initialized Realtime Database in your project yet. Do you want to set it up? Yes
? Please choose the location for your default Realtime Database instance: 
  us-central1
  europe-west1
> asia-southeast1
```

publicディレクトリは、viteのビルド先(dist)。
firebase.jsonを直接書き換えても可
```
  "hosting": {
    "public": "dist",
    ...
```

4. DBサーバからの取得処理例
```
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
...
  const firebaseConfig = {
    databaseURL:
      "https://xxx.asia-southeast1.firebasedatabase.app/",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(app);
  ... set / get
```

5. deployする場合
```
npx firebase deploy
```


## その他

### NPMコマンド用

```
npm i -D cpx cross-env npm-check-updates　npm-run-all rimraf
```

