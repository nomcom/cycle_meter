/**
 * ローカル時間に足してUTCとなるミリ秒
 * ※getTimezoneOffset はローカルのタイムゾーンと UTC タイムゾーンの差を単位を分とした値で返す。JST(UTC+0900) は-540
 */
export const TIMEZONE_OFFSET_MILLISEC = new Date().getTimezoneOffset() * 60000;

/**
 * Unixミリ秒をyyyy-MM-mm形式文字列(ローカル時間(タイムゾーン込み))に変換する
 * 変換不能の場合は空文字を返す
 * @param val 対象
 * @param withTime 時間も付与する
 * @returns 結果
 */
export const toDateString = (val: number | null): string => {
  return toDateStringFormat(val, "yyyy-MM-dd");
};
/**
 * Unixミリ秒をhh:mm:ss形式文字列(ローカル時間(タイムゾーン込み))に変換する
 * 変換不能の場合は空文字を返す
 * @param val 対象
 * @param withTime 時間も付与する
 * @returns 結果
 */
export const toTimeString = (val: number | null): string => {
  return toDateStringFormat(val, "hh:mm:ss");
};

/**
 * Unixミリ秒を指定した形式文字列(ローカル時間(タイムゾーン込み))に変換する
 * 変換不能の場合は空文字を返す
 * @param val 対象
 * @param withTime 時間も付与する
 * @returns 結果
 */
export const toDateStringFormat = (
  val: number | null,
  format: string
): string => {
  if (!val) {
    return "";
  }

  const date = new Date(val);
  // getxxxで取得する値はローカル時間(タイムゾーン込み)
  const yyyy = String(date.getFullYear());
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return format
    .replace(/yyyy/, yyyy)
    .replace(/MM/, MM)
    .replace(/dd/, dd)
    .replace(/hh/, hh)
    .replace(/mm/, mm)
    .replace(/ss/, ss);
};

/**
 * yyyy-MM-mmまたはyyyy-MM-mm hh:mm:ss形式文字列(ローカル時間(タイムゾーン込み))をUnixミリ秒に変換する
 * 変換不能の場合はnullを返す
 * @param time 対象
 * @param isEnd その日の最後のミリ秒(23:59:59.99..)を返すか？
 * @returns 結果
 */
export const toUnixMilliSec = (
  val: string | null,
  isEnd: boolean | undefined = false
): number | null => {
  if (!val) {
    return null;
  }
  const dateMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) {
    return null;
  }
  const date = new Date(0);
  date.setFullYear(parseInt(dateMatch[1], 10));
  date.setMonth(parseInt(dateMatch[2], 10) - 1);
  date.setDate(parseInt(dateMatch[3], 10));

  const datetimeMatch = val.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
  );
  if (datetimeMatch) {
    date.setHours(parseInt(datetimeMatch[4], 10));
    date.setMinutes(parseInt(datetimeMatch[5], 10));
    date.setSeconds(parseInt(datetimeMatch[6], 10));
  }

  if (isEnd) {
    if (datetimeMatch) {
      date.setSeconds(date.getSeconds() + 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    return date.getTime() - 1;
  }
  return date.getTime();
};
