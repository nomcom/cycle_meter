# 初回

https://docs.expo.dev/guides/typescript/#starting-from-scratch-using-a-typescript-template

1. Android Studio インストール
2. SDK Component Installer (Virtual Device インストール) → 起動
   https://docs.expo.dev/workflow/android-studio-emulator/

3. プロジェクト作成

```
npx create-expo-app -t expo-template-blank-typescript

cd 【プロジェクト名】
npm install react-native-maps
```

4. プロジェクト起動

```
npm run android
```

# 開発時

1. Android Studio 起動

   1. Virtual Device Manager 起動
   2. 対象の Device 起動

2. プロジェクト起動

```
npm run android
```

## Expo build

https://takagimeow.hatenablog.com/entry/2022/07/31/121000

1. Expo-cli install

```
npm install -g expo-cli eas-cli
```

2. build

```
npx eas login
npx eas build:configure
npx eas build -p android --profile preview --local
```

npm install -g sharp-cli

## Firebase

※ TODO: 現状は未使用

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
