import * as React from "react";
import { util } from "common-library";

/**
 * 日時コンポーネント
 */
export const DateTime = (props: {
  title: string;
  unixmilli: number | null;
  onChange?: (unixmilli: number | null) => void;
  isEnd?: boolean;
}): React.ReactElement => {
  // HTML要素
  const dateRef = React.useRef<HTMLInputElement>(null);
  const timeRef = React.useRef<HTMLInputElement>(null);

  // 処理登録
  const setTime = React.useCallback((unixmilli: number | null) => {
    if (dateRef.current) {
      dateRef.current.value = util.dateUtil.toDateString(unixmilli);
    }
    if (timeRef.current) {
      timeRef.current.value = util.dateUtil.toTimeString(unixmilli);
    }
    onChange();
  }, []);

  const onChange = React.useCallback(() => {
    if (!props.onChange || !dateRef.current || !timeRef.current) {
      return;
    }

    const unixmilli = util.dateUtil.toUnixMilliSec(
      dateRef.current.value +
        " " +
        // 時間がなければ日付だけで変換
        util.htmlUtil.getDateTimeValue(timeRef.current),
      props.isEnd
    );
    // コールバックを呼び出し
    props.onChange(unixmilli);
  }, [props]);

  React.useEffect(() => {
    // 日時設定
    setTime(props.unixmilli);
  }, [props.unixmilli]);

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
          onChange={() => onChange()}
        />
        <input
          ref={timeRef}
          className="input"
          type="time"
          step="1"
          onChange={() => onChange()}
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
