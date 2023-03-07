import app from "./app.js";
import { config } from "./config.js";
import { initialize } from "./common/init.js";
import { logger } from "./common/logger.js";

logger.debug(`@@@CONFIG=${JSON.stringify(config)}`);

// 待ち受け開始
app.listen(config.port, () => {
  logger.info(`ポート${config.port} で待ち受け開始`);
  // サーバ起動
  initialize();
});
