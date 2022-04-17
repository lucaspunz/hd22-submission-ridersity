import "tailwindcss/tailwind.css";
import "styles/style.css";
import { FC, useState, useEffect } from "react";
import { NextComponentType, NextPageContext } from "next";
import { RecoilRoot } from "recoil";
import { Toaster } from "react-hot-toast";
import BasicAuthCaller from "data/basicAuthCaller";

type AppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & {
    Layout: FC<{ children: any }> | undefined;
    Protected: FC<{ children: any }> | undefined;
  };
};
function MyApp({ Component, pageProps }: AppProps) {
  const Layout = Component.Layout || EmptyLayout;
  const Protected = Component.Protected || EmptyProtected;

  // automatically update dark mode (read localStorage)
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      if (theme == "dark") {
      } else if (theme == "light") {
        document.getElementById("theme").classList.remove("dark");
      }
    } else {
      document.getElementById("theme").classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  return (
    <div className="dark" id="theme">
      <RecoilRoot>
        <Toaster />
        <BasicAuthCaller />
        <Protected>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Protected>
      </RecoilRoot>
    </div>
  );
}

export default MyApp;
const EmptyLayout = ({ children }) => <>{children}</>;
const EmptyProtected = ({ children }) => <>{children}</>;
