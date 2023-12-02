import { RecoilRoot } from "recoil";
import Router from "./router";
import Register from "Register";

function App() {
  return (
    <>
      <RecoilRoot>
        <Router />
      </RecoilRoot>
      <Register />
    </>
  );
}

export default App;
