import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Error404 } from "./components/elements/common/Error404";
import routes from "~react-pages";
import { setApiServer } from "common-library";

const App = () => {
  // 読み込み中(コンポーネントがPromiseをthrowした)場合に、ローディングを表示
  // pages配下のフォルダ構成に基づいてrouting(RouteObjectを生成)
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        {useRoutes(
          routes.concat([
            {
              // 全てのroutesに一致しなかった場合のエラー画面
              path: "*",
              element: <Error404 />,
            },
          ])
        )}
      </Suspense>
    </>
  );
};

setApiServer(import.meta.env.VITE_REST_URL_BASE);

ReactDOM.render(
  <React.StrictMode>
    <div className="w-full h-[100vh] bg-slate-400">
      <Router>
        <App />
      </Router>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
