/**
 * 引数の文字列をテキストとしてダウンロードする
 * @param val 対象
 * @param name ダウンロードファイル名
 */
export const downloadText = (val: string, name: string | undefined = undefined) => {
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
