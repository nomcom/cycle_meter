# frontend

## File system based routing
ファイルの配置位置に基づいた自動ルーティング設定を行っているため、
`src/pages/` 配下に配置したxxx.tsxファイルに `URLルート/xxx` としてアクセス出来る


### Deploy
```
npm run deploy -comment='20230412'
```

## Firebase

### gsutils
```
https://firebase.google.com/docs/storage/web/download-files?hl=ja
```

### Cors

```
gsutil cors set cors.json gs://<your-cloud-storage-bucket>
```