import axios from "axios";

export * from "./src/rest/api";
export * from "./src/rest/model";

/**
 * 自動生成したRESTクライアントが対象とするサーバのベースURL(http://xxxx/のような)を設定する
 * @param baseurl ベースURL
 */
export const setApiServer = (baseurl: string) => {
  axios.defaults.baseURL = baseurl;
};
