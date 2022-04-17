import Protected from "data/protected";
import HomeLayout from "layouts/HomeLayout";
import CustomHead from "data/customHead";
import { useEffect, useState } from "react";
import { useDataActions } from "data/useDataActions";
import { useRecoilState } from "recoil";
import { stepState } from "data/atoms";
import Select from "react-select";
import Cities from "data/cities";

function RenderMain() {
  const options = Cities.map((e) => {
    return {
      value: e.name.toLowerCase(),
      label: e.name,
    };
  });
  const [step, setStep] = useRecoilState(stepState);
  const [driving, setDriving] = useState(false);
  const [from, setFrom] = useState<{ value: string; label: string } | { value: string; label: string }[] | null>(null);
  const [to, setTo] = useState<{ value: string; label: string } | { value: string; label: string }[] | null>(null);

  if (step == 1)
    return (
      <div>
        <h3 className="text-green-400 text-2xl">I{"'"}m</h3>
        <div className="flex p-3 rounded border-dashed border-2 border-neutral-500 dark:border-neutral-400 gap-2">
          <div
            className="w-40 text-center text-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-green-500 dark:hover:bg-green-300 rounded-md py-2 select-none cursor-pointer"
            onClick={() => {
              setDriving(true);
              setFrom({ value: "", label: "" });
              setTo({ value: "", label: "" });
              setStep((i) => i + 1);
            }}
          >
            Driving
          </div>
          <div
            className="w-40 text-center text-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-green-500 dark:hover:bg-green-300 rounded-md py-2 select-none cursor-pointer"
            onClick={() => {
              setDriving(false);
              setFrom([]);
              setTo([]);
              setStep((i) => i + 1);
            }}
          >
            Riding
          </div>
        </div>
      </div>
    );
  if (step == 2)
    return (
      <div>
        <div className="grid grid-cols-2 p-3 rounded gap-2">
          <h3 className="text-green-400 text-2xl">From</h3>
          <h3 className="text-green-400 text-2xl">To</h3>
        </div>

        <div className="grid grid-cols-2 p-3 rounded border-dashed border-2 border-neutral-500 dark:border-neutral-400 gap-2">
          {driving ? (
            <>
              <Select options={options} className="w-80" onChange={(i) => setFrom(i)} />
              <Select options={options} className="w-80 " onChange={(i) => setTo(i)} />
            </>
          ) : (
            <>
              <Select isMulti options={options} className="w-80" />
              <Select isMulti options={options} className="w-80" />
            </>
          )}
        </div>
      </div>
    );
}
export default function App() {
  const [isDriver, setIsDriver] = useState(false);
  const [step, setStep] = useRecoilState(stepState);
  const { logout } = useDataActions();
  return (
    <>
      <CustomHead
        HTMLTitle="App | Ridersity"
        Title="App | Ridersity"
        Description="Ridersity is simple platform for college students to find and provide rides at affordable prices while levering the environmental benefits of carpool."
      />
      <div
        className="flex items-center justify-center align-middle min-h-full rounded my-4 relative"
        style={{ minHeight: "80vh" }}
      >
        {step > 1 && (
          <div
            className="w-8 h-8 text-center absolute top-0 left-0 text-xl cursor-pointer select-none py-1 bg-neutral-200 dark:bg-neutral-700 rounded-full"
            onClick={() => setStep((i) => i - 1)}
          >
            {"<"}
          </div>
        )}
        <RenderMain />
        <div className="absolute bottom-0 opacity-50 text-xs cursor-pointer select-none" onClick={() => logout()}>
          Logout
        </div>
      </div>
    </>
  );
}
App.Layout = HomeLayout;
App.Protected = Protected;
