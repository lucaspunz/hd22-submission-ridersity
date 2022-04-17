import { useRecoilState, useSetRecoilState } from "recoil";
import { userState, authState, authEnum, jwtState } from "data/atoms";
import { useRouter } from "next/router";

export const useDataActions = () => {
  const AuthHeader = "X-Auth";
  const Router = useRouter();
  const [jwt, setJWT] = useRecoilState(jwtState);
  const [auth, setAuth] = useRecoilState(authState);
  const setUser = useSetRecoilState(userState);

  const rqst = (method: string) => {
    return async (
      url: string,
      body?: object
    ): Promise<{ status: number; data: any | string | null; error: string | null }> => {
      if (url.startsWith("/")) url = url.substring(1);
      if (!url.startsWith("http")) url = `${process.env.NEXT_PUBLIC_API}api/${url}`;
      const requestOptions = {
        method,
        headers: authHeader(url),
        body: undefined,
      };
      if (body) {
        requestOptions.body = JSON.stringify(body);
        requestOptions.headers.set("Content-Type", "application/json");
      }
      if (jwt && jwt.expires - 30 <= Date.now() / 1000 && auth === authEnum.in) {
        const { token, status, error } = await refresh();
        if (error) return { status, data: null, error };
        requestOptions.headers.set(AuthHeader, token);
      }
      let response = await fetch(url, requestOptions);
      if (response.status === 401) {
        const { token, status, error } = await refresh();
        if (error) return { status, data: null, error };
        requestOptions.headers.set(AuthHeader, token);
        response = await fetch(url, requestOptions);
      }
      const contentType = response.headers.get("content-type");
      let data: any | string | null = null;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      return { status: response.status, data, error: null };
    };
  };
  const authHeader = (url: string): Headers => {
    let hdrs = new Headers();
    if (auth == authEnum.in && url.startsWith(`${process.env.NEXT_PUBLIC_API}api`)) {
      hdrs.set(AuthHeader, jwt.token);
    }
    return hdrs;
  };
  const request = {
    get: rqst("get"),
    post: rqst("post"),
    put: rqst("put"),
    delete: rqst("delete"),
  };

  const refresh = async (): Promise<{ token: string; status: number; error: string | null }> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}auth/refresh`, {
      credentials: "include",
      method: "GET",
    });
    if (response.status === 299) {
      const { token, expires, user } = await response.json();
      setUser(user);
      setJWT({ token: token, expires: expires });
      setAuth(authEnum.in);
      return { token: token, status: response.status, error: null };
    } else if (response.status === 401) {
      setAuth(authEnum.out);
      setJWT(null);
      setUser(null);
      localStorage.removeItem("auth");
      return { token: null, status: response.status, error: "refresh error" };
    } else {
      return { token: null, status: response.status, error: "refresh error" };
    }
  };
  const logout = async (): Promise<{ error: string | null }> => {
    let resp = await fetch(`${process.env.NEXT_PUBLIC_API}auth/logout`, {
      credentials: "include",
    });
    if (resp.status === 204 || resp.status === 401) {
      localStorage.removeItem("auth");
      setAuth(authEnum.out);
      setUser(null);
      setJWT(null);
      return { error: null };
    }
    return { error: "logout error" };
  };

  const createScience = async (type: String, comment?: String) => {
    await request.post(`${process.env.NEXT_PUBLIC_API}api/science`, {
      events: [
        {
          type: type,
          comment: comment,
          route: Router.route,
          track: btoa(
            JSON.stringify({
              UA: navigator.userAgent,
              referrer: document.referrer.length > 0 ? document.referrer : null,
            })
          ),
        },
      ],
    });
  };

  return {
    logout,
    refresh,
    request,
    createScience,
  };
};
