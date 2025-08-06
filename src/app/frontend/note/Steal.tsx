import React from 'react'

export default function Steal() {
    return (
        <div className="relative">
            {/* Main wax seal */}
            <div className="w-[120px] aspect-square rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700    border-4 border-red-800 shadow">

                {/* Wax texture overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 via-transparent to-red-900/50" />

                {/* Inner embossed area */}
                <div className="absolute inset-3 rounded-full border-2 border-red-800/30 bg-gradient-to-br from-red-500/20 to-red-800/20 flex items-center justify-center">
                    <div className="text-center">
                        {/* <Heart className="w-8 h-8 text-red-200 fill-current mx-auto mb-1 drop-shadow-sm" /> */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-red-200 fill-current mx-auto mb-1 drop-shadow-sm"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12.1 8.64l-.1.1-.11-.1C10.14 6.83 7.3 7.03 5.6 8.93c-1.53 1.73-1.44 4.34.2 5.93l5.92 5.55c.27.25.7.25.97 0l5.91-5.54c1.65-1.6 1.74-4.21.2-5.94-1.7-1.9-4.54-2.1-6.7-.29z" />
                        </svg>
                        <div className="text-red-200 text-xs font-bold tracking-wider drop-shadow-sm">
                            LOVE
                        </div>
                        <div className="text-red-300 text-[8px] font-medium tracking-widest mt-0.5">
                            FOREVER
                        </div>
                    </div>
                </div>

                {/* Wax drips */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-red-600 to-red-700 rounded-b-full" />
                <div className="absolute -bottom-0.5 left-1/3 w-2 h-2 bg-red-700 rounded-full" />
                <div className="absolute -bottom-0.5 right-1/3 w-1.5 h-1.5 bg-red-700 rounded-full" />

                {/* 3D highlight */}
                <div className="absolute top-2 left-3 w-6 h-6 bg-gradient-to-br from-red-400/60 to-transparent rounded-full blur-sm" />
            </div>
        </div>
    )
}
