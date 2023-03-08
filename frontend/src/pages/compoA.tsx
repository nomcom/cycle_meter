import { useCallback, useState } from "react";
import { useLocation } from "react-router";
import { api } from "common-library";

function Compo() {
  const location = useLocation();
  const [title, setTitle] = useState<string>();

  const onSubmit = useCallback(async () => {
    const response = await api.markerCreate({
      datetime: new Date().getTime(),
      lat: 1.0,
      lng: 2.0,
    });
    // 成功時の処理
    const data = response.data;
    setTitle(`${data.id}`);
  }, [api.markerCreate]);

  return (
    <>
      <h2>CompoA Created:{title}</h2>
      <h3>{location.pathname}</h3>
      <button title="Submit" onClick={onSubmit} />
      <img src="/vite.svg" className="logo" alt="Vite logo" />
    </>
  );
}

export default Compo;
