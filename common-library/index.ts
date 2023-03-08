import axios from "axios";

export * as api from "./src/rest/api.js";
export * as model from "./src/rest/model/index.js";
export * as util from "./src/util/index.js";

/**
 * 自動生成したRESTクライアントが対象とするサーバのベースURL(http://xxxx/のような)を設定する
 * @param baseurl ベースURL
 */
export const setApiServer = (baseurl: string) => {
  axios.defaults.baseURL = baseurl;
};
