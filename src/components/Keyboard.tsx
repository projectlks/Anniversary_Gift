import { useRouter } from "next/navigation";
import type React from "react";
import { JSX, useEffect } from "react";

export default function RomanticNumberKeyboard({
  setNumber,
  number,
  setIsSuccess
}: {
  setNumber: React.Dispatch<React.SetStateAction<string[]>>;
  number: string[];
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  useEffect(() => {
    if (number.length === 6) {
      if (number.join("") === "187288") {
        // router.push("/menus");
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/menus");
        }, 1000); // Redirect after 1 second
      } else {

        setIsSuccess(false);
        setTimeout(() => {
          setNumber([]);
        }, 1000);
      }
    }
  }, [number, router, setNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (/^\d$/.test(key) && number.length < 6) {
        setNumber((prev) => [...prev, key]);
      } else if (key === "Backspace") {
        setNumber((prev) => prev.slice(0, -1));
      } else if (key === "Enter") {
        // Optional: handle enter logic here
        console.log("Enter pressed from keyboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setNumber, number]);


  const handleButtonClick = (
    value: string | { type: "delete" | "enter"; icon: JSX.Element }
  ) => {
    if (typeof value === "string") {

      if (number.length >= 6) return; // Prevent adding more than 6 digits
      setNumber((prev) => [...prev, value]);
    } else if (value.type === "delete") {
      setNumber((prev) => prev.slice(0, -1));
    } else if (value.type === "enter") {
      // Optional: handle enter logic if needed
    }
  };

  const numbers: (
    | string
    | { type: "delete"; icon: JSX.Element }
    | { type: "enter"; icon: JSX.Element }
  )[][] = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      [
        {
          type: "delete",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className=" size-4 md:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
              />
            </svg>
          ),
        },
        "0",
        {
          type: "enter",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className=" size-4 md:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          ),
        },
      ],
    ];

  const KeyButton = ({
    value,
  }: {
    value: string | { type: "delete" | "enter"; icon: JSX.Element };
  }) => (
    <button
      onClick={() => handleButtonClick(value)}
      className="bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100
        border border-pink-200/50 rounded-md md:rounded-3xl shadow-lg
        hover:from-pink-200 hover:via-rose-100 hover:to-purple-200
        hover:shadow-xl hover:scale-105 hover:border-pink-300/60
        active:scale-95 active:shadow-md
        transition-all duration-300 ease-out
        flex items-center justify-center mx-auto
        text-rose-700 font-semibold text-md md:text-2xl
        w-full aspect-[2/1]
        backdrop-blur-sm
        hover:text-rose-800
        group
        relative"
    >
      <span className="group-hover:animate-pulse">
        {typeof value === "string" ? value : value.icon}
      </span>
      <i className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={0.5}
          stroke="currentColor"
          className= "size-10 md:size-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </i>
    </button>
  );

  return (
    <div className="w-full mx-auto relative">
      <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 backdrop-blur-lg border border-pink-200/30 rounded-3xl p-4 md:p-8 relative overflow-hidden">
        {/* Decorative Bubbles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-4 right-4 w-8 h-8 bg-pink-300 rounded-full blur-sm" />
          <div className="absolute bottom-8 left-6 w-6 h-6 bg-purple-300 rounded-full blur-sm" />
          <div className="absolute top-1/2 left-4 w-4 h-4 bg-rose-300 rounded-full blur-sm" />
        </div>

        {/* Key Grid */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {numbers.flat().map((item, index) => (
            <KeyButton key={index} value={item} />
          ))}
        </div>

        <div className="text-center mt-6 relative z-10">
          <p className="text-pink-400 text-xs font-light italic">Made with ♡ for you</p>
        </div>
      </div>

      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-pink-300 text-xs animate-bounce opacity-60">♡</div>
        <div className="absolute top-3/4 right-1/4 text-rose-300 text-xs animate-pulse opacity-40">♡</div>
        <div
          className="absolute top-1/2 right-1/3 text-purple-300 text-xs animate-bounce opacity-50"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </div>
      </div>
    </div>
  );
}
