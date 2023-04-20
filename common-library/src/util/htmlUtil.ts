import * as dateUtil from "./dateUtil.js";

/**
 * 引数の文字列をテキストとしてダウンロードする
 * @param val 対象
 * @param name ダウンロードファイル名
 */
export const downloadText = (
  val: string,
  name: string | undefined = undefined
) => {
  const blob = new Blob([val], { type: "text/plain" });
  downloadUrl(window.URL.createObjectURL(blob), name);
};

/**
 * 引数のURLの対象をダウンロードする
 * @param val 対象
 * @param name ダウンロードファイル名
 */
export const downloadUrl = (
  val: string,
  name: string | undefined = undefined
) => {
  const a = document.createElement("a");
  a.href = val;
  if (name) {
    a.download = name;
  }
  document.getElementsByTagName("body")[0].appendChild(a);
  a.click();
  document.getElementsByTagName("body")[0].removeChild(a);
};

/**
 * Input(type=date/time)の値を読み取る。
 * @param input 対象
 * @param instead 読み取れなかった場合に返却する文字列
 */
export const getDateTimeValue = (input: HTMLInputElement, instead = "") => {
  if (input.type.toLowerCase() == "date") {
    if (dateUtil.toUnixMilliSec(input.value)) {
      return input.value;
    }
  }
  if (input.type.toLowerCase() == "time") {
    if (dateUtil.toUnixMilliSec(`2000/01/01 ${input.value}`)) {
      return input.value;
    }
  }
  return instead;
};
