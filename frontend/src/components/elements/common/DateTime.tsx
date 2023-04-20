import { ReactElement, useRef } from "react";
import { util } from "common-library";

/**
 * 日時コンポーネント
 */
export const DateTime = (props: {
  title: string;
  unixmilli: number | null;
  onChange?: (unixmilli: number | null) => void;
}): ReactElement => {
  // HTML要素
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  // 処理登録
  const setTime = (unixmilli: number | null) => {
    if (dateRef.current) {
      dateRef.current.value = util.dateUtil.toDateString(unixmilli);
    }
    if (timeRef.current) {
      timeRef.current.value = util.dateUtil.toTimeString(unixmilli);
    }
  };

  const getTime = () => {
    if (!props.onChange || !dateRef.current || !timeRef.current) {
      return;
    }

    const unixmilli = util.dateUtil.toUnixMilliSec(
      dateRef.current.value +
        " " +
        // 時間がなければ日付だけで変換
        util.htmlUtil.getDateTimeValue(timeRef.current)
    );
    // コールバックを呼び出し
    props.onChange(unixmilli);
  };

  // 日時設定
  setTime(props.unixmilli);
  return (
    <>
      <label className="label">
        <span className="label-text">{props.title}</span>
      </label>
      <label className="input-group">
        <input
          ref={dateRef}
          className="input"
          type="date"
          step="1"
          onChange={() => getTime()}
        />
        <input
          ref={timeRef}
          className="input"
          type="time"
          step="1"
          onChange={() => getTime()}
        />
        <button className="btn">
          <span
            className="material-symbols-outlined bg-transparent px-0"
            onClick={() => setTime(null)}
          >
            cancel
          </span>
        </button>
      </label>
    </>
  );
};
