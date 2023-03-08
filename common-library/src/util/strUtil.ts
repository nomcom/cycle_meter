/**
 * 文字列がtrueかどうかを判定する
 * 大文字小文字、前後のスペースは無視する
 * @param str 判定対象
 * @returns 判定結果
 */
export const isTrue = (str: string | undefined): boolean => {
  if (!str) {
    return false;
  }
  return str.trim().toLowerCase() === "true";
};
