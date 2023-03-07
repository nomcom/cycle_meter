import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Error404 } from "./components/elements/common/Error404";

import routes from "~react-pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

axios.defaults.baseURL = "http://localhost:3000";
const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </QueryClientProvider>,
  document.getElementById("root")
);
