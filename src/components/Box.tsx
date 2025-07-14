import { useRouter } from "next/navigation";
import React from "react";

type BoxProps = {
  title?: string;
  description?: string;
  icon1?: React.ReactNode;
  bgColor?: string;
  circleColor?: string;
  textColor?: string;
  goTo: string;
};

export function Box({
  title = "Our Memories",
  description = "Every precious moment we've shared together",
  icon1,
  bgColor = "#fff0f6",
  circleColor = "#ffc8dd",
  textColor = "#ffafcc",
  goTo,
}: BoxProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => { router.push(goTo); }}
      className="w-full aspect-[2/1] flex flex-col justify-center space-y-5 items-center rounded-xl p-5 shadow-md"
      style={{ backgroundColor: bgColor, boxShadow: `0 4px 6px ${circleColor}40` }}
    >
      <span
        className=" w-[100px] aspect-square rounded-full shadow-lg ring-1 ring-white/30 bg-opacity-80 backdrop-blur-md flex items-center justify-center transition"
        // style={{ backgroundColor: circleColor }}
      >
        {icon1}
      </span>
      <h1 className="text-3xl font-bold tracking-wide" style={{ color: textColor }}>
        {title}
      </h1>

      <span className="flex space-x-2 items-center text-center text-sm text-gray-600">
        {icon1}
        <p>{description}</p>
        {icon1 ? null : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="size-5">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        )}
        {icon1}
      </span>

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-rose-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </div>
  );
}