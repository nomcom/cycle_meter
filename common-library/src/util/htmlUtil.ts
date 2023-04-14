/**
 * 引数の文字列をテキストとしてダウンロードする
 * @param val 対象
 * @param name ダウンロードファイル名
 */
export const downloadText = (val: string, name: string | undefined) => {
  const blob = new Blob([val], { type: "text/plain" });

  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  if (name) {
    a.download = name;
  }
  document.getElementsByTagName("body")[0].appendChild(a);
  a.click();
  document.getElementsByTagName("body")[0].removeChild(a);
};
