/**
 * ローカル時間に足してUTCとなるミリ秒
 * ※getTimezoneOffset はローカルのタイムゾーンと UTC タイムゾーンの差を単位を分とした値で返す。JST(UTC+0900) は-540
 */
export const TIMEZONE_OFFSET_MILLISEC = new Date().getTimezoneOffset() * 60000;

/**
 * Unixミリ秒をyyyy-MM-mm形式文字列(ローカル時間(タイムゾーン込み))に変換する
 * 変換不能の場合は空文字を返す
 * @param val 対象
 * @returns 結果
 */
export const toDateString = (val: number | null): string => {
  if (!val) {
    return "";
  }
  const date = new Date(val);
  // getxxxで取得する値はローカル時間(タイムゾーン込み)
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd}`;
};

/**
 * yyyy-MM-mm形式文字列(ローカル時間(タイムゾーン込み))をUnixミリ秒に変換する
 * 変換不能の場合はnullを返す
 * @param time 対象
 * @returns 結果
 */
export const toUnixMilliSec = (val: string | null): number | null => {
  if (!val) {
    return null;
  }
  const match = val.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return null;
  }
  const date = new Date(0);
  date.setFullYear(parseInt(match[1], 10));
  date.setMonth(parseInt(match[2], 10) - 1);
  date.setDate(parseInt(match[3], 10));
  return date.getTime() + TIMEZONE_OFFSET_MILLISEC;
};
