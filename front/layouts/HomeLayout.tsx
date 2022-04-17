import { useRecoilValue } from "recoil";
import { authState, authEnum, userState } from "data/atoms";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeLayout({ children }) {
  const Router = useRouter();
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const [theme, setTheme] = useState("light");
  function scrollTo(id: string | number) {
    window.scrollTo({
      top: (typeof id === "string" ? document.getElementById(`${id}`)?.offsetTop : id) - 80,
      behavior: "smooth",
    });
  }
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      if (theme == "dark") {
        setTheme("dark");
      } else if (theme == "light") {
        setTheme("light");
      }
    }
  }, []);
  useEffect(() => {
    if (theme == "dark") {
      document.getElementById("theme").classList.add("dark");
    } else {
      document.getElementById("theme").classList.remove("dark");
    }
  }, [theme]);

  function toggleTheme() {
    if (theme == "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <>
      <div className="bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 relative min-h-screen">
        <header className="min-w-full flex items-center sticky justify-start backdrop-blur-sm backdrop-opacity-60 top-0 border-b-2 border-slate-800 dark:border-slate-200 flex-wrap px-6 py-4 overflow-x-hidden">
          <div className="flex items-center justify-center flex-shrink-0 mr-6 min-w-full gap-4">
            <Link href="/" scroll={false}>
              <a>
                <h1
                  className="font-bold text-xl md:text-2xl lg:text-3xl cursor-pointer uppercase"
                  onClick={() => scrollTo(0)}
                >
                  Ridersity
                </h1>
              </a>
            </Link>
            <div className="flex flex-grow items-center w-auto text-right justify-end gap-4">
              <div className="text-sm">{auth === authEnum.in ? "SETTINGS" : "LOGIN TO GET STARTED"}</div>
              <div
                className="text-sm cursor-pointer hover:underline select-none uppercase"
                onClick={() => toggleTheme()}
              >
                {theme}
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto p-2">{children}</div>
        <footer className="border-t-2 border-neutral-700 dark:border-neutral-200 p-2 mt-6">
          <h6 className="text-sm text-center uppercase">
            ⓒ Ridersity {new Date().getFullYear()} ·{" "}
            <Link href="/" scroll={true}>
              <a className="hover:underline">Home</a>
            </Link>{" "}
            |{" "}
            <Link href="/app" scroll={true} prefetch={false}>
              <a className="hover:underline">App</a>
            </Link>{" "}
            |{" "}
            <Link href="/settings" scroll={true} prefetch={false}>
              <a className="hover:underline">Settings</a>
            </Link>
          </h6>
        </footer>
      </div>
    </>
  );
}
