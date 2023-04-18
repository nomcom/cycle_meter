# rest_server_client

[![.github/workflows/build_android.yml](https://github.com/nomcom/cycle_meter/actions/workflows/build_android.yml/badge.svg)](https://github.com/nomcom/cycle_meter/actions/workflows/build_android.yml)

[![Deploy to Firebase Hosting on merge](https://github.com/nomcom/cycle_meter/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/nomcom/cycle_meter/actions/workflows/firebase-hosting-merge.yml)

### Realtime Database ルール
```
{
  "rules": {
    ".read": "now < 1682521200000",  // 2023-4-27
    ".write": "now < 1682521200000",  // 2023-4-27
    "marker" :{
      "create" :{
        ".indexOn": "timestamp"
      }
    }
  }
}
```

### JSON
```
開始、終了指定 ＆ 最初から10件
/marker/create.json?orderBy="timestamp"&startAt=3&endAt=1680297912074&limitToFirst=10&print=pretty
```
