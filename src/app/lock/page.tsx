"use client"

import Image from 'next/image'
import img1 from "../../imgs/download.png"
import c from "../../imgs/sticker.png"
import Keyboard from '@/components/Keyboard'
import { useEffect, useState } from 'react';
import { Dancing_Script, Albert_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading'


const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ["400", "700"] });
const albertSans = Albert_Sans({ subsets: ['latin'], weight: ["300", "600"] });

export default function Lock() {
  const [number, setNumber] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();





  const checkCode = async () => {

    setIsLoading(true);

    const code = number.join('');

    const response = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: code }),
    })

    const data = await response.json()

    setIsLoading(false);
    if (data.success) {
      router.push('frontend/menus') // or wherever you want
      setIsSuccess(true);
    } else {

      setIsSuccess(false);

      setTimeout(() => {
        setNumber([]);
      }, 1000);
    }
  }

  useEffect(() => {




    if (number.length === 6) {
      checkCode();
    }
  }, [number]);
  return (
    <section className="w-full h-screen flex justify-center overflow-hidden items-center bg-[radial-gradient(circle,_#FFC8DD,_#ffffff)]">
      <div className='w-[90%] max-w-7xl rounded-tl-[50px] overflow-hidden rounded-br-[50px] bg-white pr-0  md:p-3 flex h-[95%] '>
        {/* left */}
        <div className='h-full hidden relative  rounded-tl-[38px] rounded-br-[38px] bg-[#FFC8DD] w-1/2 overflow-hidden md:flex justify-center items-end '>
          <Image
            src={img1}
            alt="Lock Image"
            className="  w-[75%] "
            style={{ filter: 'drop-shadow(0 8px 12px #a2d2ff)' }}
          />

          <Image
            src={c}
            alt="Lock Image"
            className="  w-[25%] absolute bottom-0 right-0"
            style={{ filter: 'drop-shadow(0 8px 12px #a2d2ff)' }}
          />
        </div>

        {/* right */}
        <div className='flex-1 p-5  md:p-10 flex justify-end items-center  flex-col space-y-5  h-full'>
          <span className='flex items-center w-[100px] aspect-square  text-rose-500 border border-rose-500 justify-center rounded-full'>
            <svg
              viewBox="0 0 470 470"
              fill="currentColor"
              className="size-16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M397.715,246.969c7.985,1.588,15.855,2.495,23.437,2.495c5.327,0,10.517-0.443,15.504-1.402 c1.954-0.376,3.678-1.512,4.793-3.159C442.615,243.181,470,202.039,470,140.201S442.615,37.22,441.449,35.499 c-1.115-1.647-2.84-2.783-4.794-3.159C376.07,20.699,286.138,85.094,271.063,96.3h-67.791C188.2,85.093,98.267,20.689,37.68,32.34 c-1.954,0.376-3.679,1.512-4.794,3.159C31.72,37.22,4.335,78.363,4.335,140.201s27.385,102.98,28.551,104.702 c1.115,1.647,2.84,2.783,4.793,3.159c4.991,0.959,10.172,1.402,15.503,1.402c5.891,0,11.955-0.546,18.112-1.532l-70.406,131.5 c-1.178,2.199-1.185,4.841-0.018,7.047c1.167,2.205,3.354,3.687,5.835,3.951l52.207,5.565l33.577,40.363 c1.596,1.919,4.045,2.918,6.523,2.666c2.482-0.252,4.677-1.723,5.854-3.922l129.896-242.61l129.896,242.61 c1.178,2.199,3.372,3.67,5.854,3.922c0.253,0.025,0.506,0.038,0.758,0.038c2.214,0,4.332-0.981,5.765-2.704l33.577-40.363 l52.207-5.565c2.481-0.265,4.668-1.746,5.835-3.951c1.167-2.206,1.16-4.848-0.018-7.047L397.715,246.969z M401.027,384.064 l-28.401,34.142L247.285,184.103h23.778c4.907,3.648,17.746,12.93,34.931,23.397l43.14,80.574c1.352,2.524,3.941,3.961,6.618,3.961 c1.195,0,2.407-0.286,3.534-0.889c3.652-1.955,5.027-6.501,3.072-10.152l-31.915-59.609c14.811,7.785,31.105,15.164,47.485,20.404 l72.23,134.906l-44.159,4.708C404.058,381.61,402.274,382.565,401.027,384.064z M68.498,384.065 c-1.248-1.5-3.031-2.455-4.971-2.662l-44.159-4.708l71.291-133.154c18.295-5.266,36.69-13.461,53.234-22.157l-31.915,59.609 c-1.955,3.651-0.58,8.197,3.072,10.152c1.127,0.604,2.338,0.889,3.534,0.889c2.676,0,5.267-1.437,6.618-3.961l43.14-80.574 c17.185-10.468,30.024-19.749,34.931-23.397h18.967L96.899,418.206L68.498,384.065z M43.683,233.854 c-5.694-9.675-24.348-45.086-24.348-93.653c0-48.578,18.662-83.994,24.347-93.653c52.698-7.261,133.282,49.132,149.584,61.028 v14.896l-47.346-17.315c-3.889-1.419-8.197,0.577-9.62,4.468c-1.422,3.891,0.578,8.197,4.468,9.62l52.498,19.199v3.514 l-52.498,19.199c-3.89,1.423-5.89,5.729-4.468,9.62c1.112,3.04,3.985,4.926,7.044,4.926c0.855,0,1.726-0.147,2.576-0.458 l47.346-17.315v14.897C176.963,184.723,96.372,241.122,43.683,233.854z M430.652,46.548C436.346,56.222,455,91.634,455,140.201 c0,48.578-18.662,83.994-24.347,93.653c-52.696,7.284-133.284-49.128-149.585-61.027v-14.897l47.346,17.315 c0.851,0.311,1.72,0.458,2.576,0.458c3.059,0,5.933-1.886,7.044-4.926c1.422-3.891-0.578-8.197-4.468-9.62l-52.499-19.199v-3.514 l52.499-19.199c3.89-1.423,5.89-5.729,4.468-9.62c-1.423-3.89-5.731-5.889-9.62-4.468l-47.346,17.315v-14.898 C297.362,95.675,377.91,39.263,430.652,46.548z M266.068,169.103h-57.801V111.3h57.801V169.103z"></path>
                <path d="M425,140.201c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5c0-32.529-8.935-58.628-16.431-74.794 c-1.743-3.758-6.202-5.393-9.959-3.648c-3.758,1.742-5.392,6.201-3.649,9.959C416.822,86.513,425,110.406,425,140.201z"></path>
                <path d="M44.265,110.733c0.545,0.121,1.089,0.179,1.625,0.179c3.441,0,6.543-2.385,7.316-5.885 c3.217-14.562,7.849-26.151,11.168-33.31c1.742-3.758,0.108-8.217-3.649-9.959c-3.756-1.743-8.216-0.109-9.959,3.648 c-3.632,7.834-8.699,20.506-12.206,36.386C37.666,105.837,40.221,109.84,44.265,110.733z"></path>
                <path d="M49.335,140.201c0-2.153,0.048-4.346,0.146-6.704c0.173-4.138-3.042-7.633-7.181-7.806 c-4.15-0.181-7.633,3.042-7.807,7.181c-0.107,2.567-0.159,4.965-0.159,7.329c0,32.53,8.936,58.629,16.431,74.794 c1.269,2.736,3.979,4.347,6.809,4.347c1.056,0,2.129-0.225,3.15-0.698c3.758-1.742,5.391-6.201,3.649-9.959 C57.514,193.888,49.335,169.997,49.335,140.201z"></path>
              </g>
            </svg>
          </span>

          <h1 className={`${dancingScript.className} md:text-4xl text-2xl font-bold`}>Anniversary&apos;s Lock</h1>

          {isLoading && (
            <Loading />
          )}

          <div className={`w-full transition-all duration-300 relative min-h-14 md:min-h-16 ${number.length === 6 ? (isSuccess ? "bg-green-100 border-green-500 text-gray-950" : "bg-red-100 border-red-500 text-gray-950 ") : "bg-gray-950 text-gray-100"} border  rounded-md overflow-hidden `}>
            <div className='flex justify-center items-center h-full space-x-2'>
              {number.length > 0 ? (
                number.map((n, i) => (
                  <span
                    key={i}
                    className={`md:text-2xl text-xl font-semibold text-center animate-digit-entry ${albertSans.className}`}
                  >
                    {n}
                  </span>
                ))
              ) : (
                <span className={`md:text-2xl text-xl font-semibold text-gray-500 ${albertSans.className}`}>
                  Enter your number
                </span>
              )}
            </div>

            {/* lock icon */}
            <i className='absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300'>
              {isSuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              )}
            </i>
          </div>

          <Keyboard setNumber={setNumber} number={number} />
        </div>
      </div>
    </section>
  )
}