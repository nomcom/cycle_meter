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

- Add Secret Environment by ".env" file
```
npx eas secret:push --scope project --env-file ./.env
```

npm install -g sharp-cli


## Expo Cloud Build

### credentials

```
npx eas credentials

√ What do you want to do? » Set up a new keystore
√ Assign a name to your build credentials: ... Build Credentials xxxxx
√ Generate a new Android Keystore? ... yes
Detected that you do not have keytool installed locally.
✔ Generating keystore in the cloud...
✔ Created keystore
✔ Created Android build credentials Build Credentials xxxxx
```

