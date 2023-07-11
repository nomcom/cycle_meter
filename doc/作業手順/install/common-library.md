# common-library Install

インストール後の最終的なディレクトリ構成
```
TOP/
└─【プロジェクト名】/
    ├─dist/                     ...(npm run build時に作成)ビルド先&デプロイ元
    ├─openapi/
    │ └─openapi.yml             ...Rest API仕様定義(あらかじめ用意しておく)
    ├─src/
    │ └─rest/
    │   └─api.ts                ...Orvalから(Rest APIクライアント自動生成コード)
    └─orval.config.ts           ...Orvalから
```

## Node, TypeScript

Node, TypeScriptをインストールして、npmのパスを通す。※省略

## Rest API系

### swagger-merger

複数ファイルに分割したAPI仕様(yaml)を1つにまとめる
https://github.com/WindomZ/swagger-merger

1. インストール
```
npm i -D swagger-merger
```

2. 仕様書生成
```
npx swagger-merger -i openapi/【分割したファイルのbase】 -o openapi/openapi.yml
```

### Redocly

API仕様(yaml)からAPI仕様書(html)生成
https://redocly.com/docs/cli/installation/

1. インストール
```
npm i -D @redocly/cli@latest 
```

2. 仕様書生成
```
npx redocly build-docs openapi/openapi.yml --output ../doc/api/API仕様書.html
```


### Orval

API仕様(yaml)からコード自動生成
https://orval.dev/installation

1. インストール
```
npm i orval axios -D
```

2. 生成条件の設定ファイル作成

https://orval.dev/reference/configuration/overview

プロジェクト直下に以下のような、`orval.config.ts`を作成
```
import { defineConfig } from 'orval';

export default defineConfig({
  restapi: {
    input: "./openapi/openapi.yml",
    output: "./src/rest/api.ts",
  },
});
```

3. コード自動生成
```
npx orval
```


## ライブラリとして別Nodeプロジェクトから参照する設定

1. 以下のような`index.ts`をsrc配下に配置

```
import axios from "axios";

export * as api from "./rest/api.js";
...

export const setApiServer = (baseurl: string) => {
  axios.defaults.baseURL = baseurl;
};
```

2. ビルド
```
npx tsc
```