import { RecoilRoot } from "recoil";
import Router from "./router";
import Register from "Register";
import Update from "page/Update";
import { useRoutes } from "react-router-dom";
function App() {
  return (
    <>
      <RecoilRoot>
        <Router />
        <Update />
      </RecoilRoot>
      <Register />
    </>
  );
}

export default App;
