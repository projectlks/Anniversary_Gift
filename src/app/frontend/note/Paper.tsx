import React from 'react'
import { Dancing_Script, Albert_Sans } from 'next/font/google';


const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ["400", "700"] });
const albertSans = Albert_Sans({ subsets: ['latin'], weight: ["300", "600"] });




export default function Paper() {
  return (
     <div className="bg-gradient-to-b max-h-full w-full overflow-hidden from-amber-50 to-yellow-50 shadow-2xl rounded-lg border border-amber-200 relative ">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-amber-100/20 to-yellow-100/30"></div>
          
          {/* Notebook lines effect */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-red-200"></div>
          <div className="absolute left-0 right-0 top-16 h-px bg-blue-100 opacity-50"></div>
          <div className="absolute left-0 right-0 top-24 h-px bg-blue-100 opacity-30"></div>
          <div className="absolute left-0 right-0 top-32 h-px bg-blue-100 opacity-30"></div>
          
          {/* Letter content */}
          <div className="relative z-10 p-8 md:p-12">
            {/* Header with quill icon */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2 text-amber-700">
                {/* <Feather className="w-5 h-5" /> */}
                <span className="text-sm font-medium">Written with love</span>
              </div>
              <div className="text-right text-amber-600">
                <p className={`text-sm font-medium space-y-6 text-gray-700 leading-relaxed ${albertSans.className} `}>February 14th, 2024</p>
              </div>
            </div>
            
            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-2 font-serif">
                My Dearest Love,
              </h1>
            </div>
            
            {/* Letter body */}
            <div className={`space-y-6 text-gray-700 leading-relaxed ${dancingScript.className} `}>

              <p className="text-lg font-light">
                As I sit here with pen in hand, my heart overflows with words that seem too small 
                to capture the magnitude of my love for you. Every sunrise brings new reasons to 
                cherish you, and every sunset finds me more grateful for your presence in my life.
              </p>
              
              <p className="text-lg font-light">
                You are the melody that makes my heart sing, the light that guides me through 
                the darkest nights, and the dream I never want to wake up from. In your eyes, 
                I found my home; in your smile, I discovered my happiness; and in your love, 
                I found my purpose.
              </p>
              
              <p className="text-lg font-light">
                Every moment we share is a treasure I hold close to my heart. Your laughter 
                is my favorite symphony, your touch is my greatest comfort, and your love is 
                my most precious gift. I promise to love you not just for who you are today, 
                but for who you&apos;re yet to become.
              </p>
              
              <p className="text-lg font-light">
                Distance may separate us at times, and challenges may test us, but nothing 
                can diminish the love that burns eternally in my heart for you. You are my 
                today, my tomorrow, and my always.
              </p>
            </div>
            
            {/* Closing */}
            <div className="mt-12 text-right">
              <p className="text-lg text-rose-700 mb-4 font-medium">
                Forever and always yours,
              </p>
              <div className="relative">
                <p className="text-2xl font-bold text-rose-800 font-serif transform -rotate-2">
                  Your Beloved
                </p>
                {/* Heart signature */}
                {/* <Heart className="w-6 h-6 text-red-500 fill-current absolute -right-8 -top-2 transform rotate-12" /> */}
              </div>
            </div>
            
            {/* Decorative border */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-rose-200 rounded-lg opacity-30 pointer-events-none"></div>
          </div>
          
          {/* Paper fold effect */}
          <div className="absolute top-14 right-10 w-24 h-16 bg-gradient-to-bl from-amber-200 to-transparent transform rotate-45 translate-x-8 -translate-y-8"></div>
        </div>
  )
}
