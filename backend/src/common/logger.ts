import pkg from "log4js";
const { configure, getLogger } = pkg;

// 設定
configure("config/log.json");
export const logger = getLogger();
