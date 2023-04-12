# rest_server_client


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
