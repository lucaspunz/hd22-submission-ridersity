import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authState, authEnum } from "data/atoms";
import { useDataActions } from "data/useDataActions";
import { useRouter } from "next/router";

let route = "";
let refreshed = false;
export default function BasicAuthCaller() {
  const Router = useRouter();
  const setIsAuth = useSetRecoilState(authState);
  const dataActions = useDataActions();

  useEffect(() => {
    if (refreshed || Router.route === route || (Router.asPath.includes("login=") && Router.query.login == null)) return;
    route = Router.route;
    if (Router.query.login) {
      if (Router.query.login === "true") {
        localStorage.setItem("auth", "ye");
        dataActions.refresh();
      } else if (Router.query.login === "false") {
        localStorage.removeItem("auth");
        setIsAuth(authEnum.out);
      } else {
        const localLoggedIn = localStorage.getItem("auth");
        if (localLoggedIn && localLoggedIn == "ye") dataActions.refresh();
        else setIsAuth(authEnum.out);
      }
      Router.replace(Router.route);
    } else {
      const localLoggedIn = localStorage.getItem("auth");
      if (localLoggedIn && localLoggedIn == "ye") dataActions.refresh();
      else setIsAuth(authEnum.out);
    }
    refreshed = true;
  }, [Router.route, Router.query.login]);
  return <></>;
}
