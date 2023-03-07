import { useLocation } from "react-router";

export const Error404 = () => {
  const location = useLocation();
  return <>{location.pathname} ページは存在しません</>;
};
