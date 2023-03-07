import axios from "axios";

export * from "./src/rest/api";
export * from "./src/rest/model";

export const setApiServer = (baseurl: string) => {
  axios.defaults.baseURL = baseurl;
};
