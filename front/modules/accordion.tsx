import { useState, ReactNode } from "react";
export const AccordionFolder = ({ children }) => {
  return (
    <div className="grid grid-cols-1 auto-rows-auto divide-y-2 divide-neutral-200 dark:divide-neutral-700 border-2 border-slate-200 dark:border-neutral-700 rounded-md">
      {children}
    </div>
  );
};

function CheveronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      className="bi bi-chevron-down"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
      ></path>
    </svg>
  );
}
function CheveronUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      className="bi bi-chevron-up"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M7.646 4.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L8 5.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z"
      ></path>
    </svg>
  );
}

export const Accordion: React.FC<{ Question: string; HTMLID?: string; children?: ReactNode }> = (TK) => {
  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown(e) {
    e.preventDefault();
    setIsOpen((t) => !t);
  }
  return (
    <div id={TK.HTMLID}>
      <div
        className="flex items-center py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex-grow flex text-xl items-center gap-2 mx-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
            Q
          </div>
          <h3 className="text-xl">{TK.Question}</h3>
        </div>
        <div className="w-10">{isOpen ? <CheveronUp /> : <CheveronDown />}</div>
      </div>
      <div className={isOpen ? "visible pb-2" : "hidden"}>
        <p className="text-md pl-14">{TK.children}</p>
      </div>
    </div>
  );
};
