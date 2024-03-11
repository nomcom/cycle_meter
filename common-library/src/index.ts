import axios from "axios";

export * as api from "./rest/api.js";
export * as util from "./util/index.js";

/**
 * 自動生成したRESTクライアントが対象とするサーバのベースURL(http://xxxx/のような)を設定する
 * @param baseurl ベースURL
 */
export const setApiServer = (baseurl: string) => {
  axios.defaults.baseURL = baseurl;
};




