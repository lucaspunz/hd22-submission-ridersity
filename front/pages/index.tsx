import Link from "next/link";
import CustomHead from "data/customHead";
import HomeLayout from "layouts/HomeLayout";
import { authState, authEnum, userState } from "data/atoms";
import { useRecoilValue } from "recoil";
import CarSvg from "modules/icons/car";
import { Accordion, AccordionFolder } from "modules/accordion";

export default function Home() {
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  return (
    <>
      <CustomHead
        HTMLTitle="Rideshare platform for college students | Ridersity"
        Title="Rideshare marketplace for college students | Ridersity"
        Description="Ridersity is simple platform for college students to find and provide rides at affordable prices while levering the environmental benefits of carpool."
      />
      <div
        className="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 items-center mb-0 gap-4"
        id="welcome"
        style={{ minHeight: "80vh" }}
      >
        <div className="container rounded-lg">
          <h1 className="font-light text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-left">
            Get from <b className="text-green-500 font-semibold">Point A to B</b> without breaking the bank
          </h1>
          <p className="font-light text-left leading-snug mt-5 text-lg md:text-xl lg:text-2xl">
            Ridersity is simple platform for college students to find and provide rides at affordable prices while
            levering the environmental benefits of carpool.
          </p>
          <div className="flex items-center justify-center my-4 w-full">
            {auth === authEnum.in ? (
              <Link href="/app">
                <a>
                  <div className="p-3 bg-white text-black border-2 border-slate-700 rounded-lg text-center text-xl cursor-pointer shadow-2xl hover:bg-gray-300 transition-colors duration-500">
                    Continue to Ridersity
                  </div>
                </a>
              </Link>
            ) : (
              <>
                <a href={`${process.env.NEXT_PUBLIC_API}auth/google`}>
                  <div className="p-3 bg-white text-black border-2 border-slate-700 rounded-lg text-center text-xl cursor-pointer shadow-2xl hover:bg-gray-300 transition-colors duration-500">
                    Continue with University Google Account
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center rounded-lg px-3 pb-4 md:pb-0 w-full">
          <CarSvg />
        </div>
      </div>
      <hr className="border border-neutral-700 dark:border-neutral-200 mb-6" />
      <div className="" id="faq">
        <h1 className="text-2xl">FAQ</h1>
        <AccordionFolder>
          <Accordion Question={"Why Ridersity?"}>
            Whether going home for winter break, to that concert in San Francisco, or HackDavis, college students need
            rides. We were inspired to create Ridersity knowing that a large number of University students need to get
            places but don{"'"}t all have cars. Oftentimes platforms such as Facebook Ride-Share groups are too crowded
            with posts and are overall unorganized. With Ridersity, we are centralizing the college ride-share process
            as drivers drive to recoup their costs and riders ride with those going in the same direction as them
            without paying outrageous prices.
          </Accordion>
          <Accordion Question={"How does Ridersity work?"}>
            Ridersity simplifies the process of finding carpool opportunities. Riders fill out where they{"'"}re going
            and when, and get a list of drivers available to give them a ride. Drivers fill out where they{"'"}re going
            and when and get notified when riders join them.
          </Accordion>
          <Accordion Question={"Still have a question/concern?"} HTMLID="contact">
            Drop us a message at:{" "}
            <a href={`mailto:support@ridersity.tech`} className="text-blue-400 hover:underline">
              support@ridersity.tech
            </a>
          </Accordion>
        </AccordionFolder>
      </div>
    </>
  );
}
Home.Layout = HomeLayout;
