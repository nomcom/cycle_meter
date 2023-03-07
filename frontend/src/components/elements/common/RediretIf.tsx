import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

/**
 * 条件を判定して別URLにリダイレクトする
 */
export const RediretIf = (props: {
  redirectTo: string | ReactElement;
  ifFunc: Function | undefined;
  children: ReactElement[];
}): ReactElement => {
  if (!props.ifFunc || props.ifFunc()) {
    // 条件に一致した場合、リダイレクト
    if (typeof props.redirectTo === "string") {
      return (
        <div>
          <Navigate to={props.redirectTo} replace={true}></Navigate>
        </div>
      );
    } else {
      return props.redirectTo;
    }
  }
  // 上記以外は子要素をそのまま
  return <>{props.children}</>;
};
