import { strUtil } from "../util/index.js";
import { logger } from "../common/logger.js";
import { PrismaClient } from "../../prisma/generated/db/index.js";
import { PrismaClient as PrismaClientAppend } from "../../prisma/generated/db_append/index.js";
import { PrismaClient as PrismaClient_DEBUG } from "../../prisma/dev/generated/db/index.js";
import { PrismaClient as PrismaClientAppend_DEBUG } from "../../prisma/dev/generated/db_append/index.js";

// デフォルト
let cCLass1 = PrismaClient;
let cClass2 = PrismaClientAppend;

// 環境変数によって変更
if (strUtil.isTrue(process.env.DEBUG)) {
  // デバッグモード
  logger.info(`デバッグ用DBで実行(${process.env.DEBUG})`);
  // ※注意:接続先DBが違うだけで、DBのschemaは(それほど)変わらないという前提で型違いのエラーを無視
  // XXXX:DB固有の処理などがあると異常となりうる
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cCLass1 = PrismaClient_DEBUG;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cClass2 = PrismaClientAppend_DEBUG;
}

// シングルトンのインスタンスとなる
export const prisma = new cCLass1({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});
export const prismaAppend = new cClass2({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

// SQLログ出力設定
prisma.$on("query", (e) => {
  logger.debug(`Query: ${e.query} (Params: ${e.params})`);
});
