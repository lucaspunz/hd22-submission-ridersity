import { useRecoilValue } from "recoil";
import { authEnum, authState } from "data/atoms";
import { useRouter } from "next/router";

export default function protectedFilter({ children }) {
  const Router = useRouter();
  const isAuth = useRecoilValue(authState);
  switch (isAuth) {
    case authEnum.waitingOnCall:
      return <></>;

    case authEnum.out:
      Router.push("/");
      return <></>;
    case authEnum.in:
      return <>{children}</>;
  }
}
