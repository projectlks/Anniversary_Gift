"use client";
import { Box } from "@/components/Box";

export default function Menus() {
  return (
    <div className="flex flex-col space-y-5 items-center min-h-screen overflow-y-scroll scrollbar-hide pt-[100px] justify-start]">
      <h1 className="text-4xl font-bold text-[#a2d2ff] tracking-widest uppercase">Menu of Our Love</h1>

      <div className="flex items-center justify-center gap-5 text-2xl text-red-500">
        <HeartIcon />
        <p>Together Forever</p>
        <HeartIcon />
      </div>

      <div className="w-[90%] max-w-7xl p-3 h-[95%]">
        <div className="gap-5 overflow-y-scroll grid grid-cols-2 scrollbar-hide h-full">
          <Box
            title="Anniversary"
            description="A love that grows every day."
            icon1={<HeartIcon />}
            // icon2={<YourCustomSVG />}
            bgColor="#fce4ec"
            circleColor="#f8bbd0"
            textColor="#ec407a"
            goTo="memories"
          />

          <div className="w-full aspect-[2/1] bg-[#ffcdd2] rounded-xl shadow" />
          <div className="w-full aspect-[2/1] bg-[#e1bee7] rounded-xl shadow" />
          <div className="w-full aspect-[2/1] bg-[#b2dfdb] rounded-xl shadow" />
        </div>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg
      width="64px"
      height="64px"
      viewBox="-2.4 -2.4 28.80 28.80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffafcc"
      transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
        stroke="#ffaffc"
        strokeWidth="1.104"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

