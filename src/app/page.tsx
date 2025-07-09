"use client"
import { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import heart from "../components/animations/heart.json";
import { Dancing_Script } from 'next/font/google';
import { Albert_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';

const dancingScript = Dancing_Script({ subsets: ['latin'] });
const albertSans = Albert_Sans({ subsets: ['latin'] });

export default function Page() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
 const router = useRouter();
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3); // 0.5x speed = 2x duration
    }
  }, []);

  return (
    <section className="w-full h-screen flex overflow-hidden justify-center items-center bg-[radial-gradient(circle,_#FFC8DD,_#ffffff)]">

      {/* heart animation  */}
      <div className="h-[65%] aspect-square">
        <Lottie lottieRef={lottieRef} animationData={heart} loop={true} />
      </div>

      {/* text div */}
      <div className="absolute flex flex-col space-y-5 justify-center items-center top-1/2 left-1/2 transform  text-center font-bold -translate-x-1/2 -translate-y-1/2">


        {/* head line  */}
        <h1 className={` text-7xl w-full whitespace-nowrap mx-auto text-gray-900  ${dancingScript.className}`}>
          Happy 3<sup>rd</sup> year Anniversary
        </h1>


        <span className="flex items-center space-x-2 ">

          {/* gift icon  */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <p className={`${albertSans.className}`}>
            Special gift for you
          </p>

          {/* gift icon  */}

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </span>

        {/* start button  */}
        <button onClick={()=>{router.push('/lock')}} className={` px-3 py-2  rounded bg-[#BDE0FE]  w-[100px] cursor-pointer transition-all hover:tracking-widest hover:w-[120px]  duration-300  `} >
          Start
        </button>
      </div>
    </section>
  );
}