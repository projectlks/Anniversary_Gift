"use client"

import type React from "react"

import { useRouter } from "next/navigation"
// import { ImageDownIcon, HeartIcon, CalendarDaysIcon, CameraIcon } from "lucide-react" // Specific Lucide React icons

export default function AddMenuPage() {
    const router = useRouter()
    const handleNavigate = (path: string) => {
        router.push(path)
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-start pt-20 px-4 relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-100">
            {/* Romantic Background Elements - More dynamic and layered */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-slow animation-delay-0" />
                <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-medium animation-delay-2000" />
                <div className="absolute bottom-[15%] left-[20%] w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-fast animation-delay-4000" />
                <div className="absolute top-[25%] right-[30%] w-56 h-56 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-slow animation-delay-1000" />
                <div className="absolute bottom-[5%] left-[50%] w-60 h-60 bg-orange-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-medium animation-delay-3000" />
            </div>

            {/* Subtle Sparkle Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/sparkle-pattern.png')] bg-repeat opacity-50" />
            </div>

            <h1 className="text-5xl font-extrabold text-rose-800 mb-16 tracking-tight drop-shadow-lg text-center z-10 leading-tight">
                Cherish Every Moment Together
                <br />
                <span className="text-2xl font-semibold text-pink-600 block mt-2">Your Love Story, Beautifully Captured</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl z-10">

                 <AddCard
                    title="Add Anniversary Memory"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    }
                    onClick={() => handleNavigate("backend/imagesUpload")}
                />
                <AddCard
                    title="Add Puzzle Image"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    }
                    onClick={() => handleNavigate("backend/puzzle")}
                />
                <AddCard
                    title="Add Love Note"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    }
                    onClick={() => handleNavigate("/notes/add")}
                />
               
                <AddCard
                    title="Add Journey Photo"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                    }
                    onClick={() => handleNavigate("/journey/add")}
                />
            </div>
        </main>
    )
}

function AddCard({ title, onClick, icon }: { title: string; onClick: () => void; icon?: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="relative bg-white border border-rose-200 rounded-3xl p-8 text-center
                 text-xl font-semibold text-rose-600 shadow-xl hover:shadow-2xl
                 hover:border-rose-400 hover:scale-[1.02] transition-all duration-300
                 flex flex-col items-center justify-center space-y-4 overflow-hidden
                 group transform-gpu
                 before:absolute before:inset-0 before:bg-gradient-to-br before:from-rose-50/50 before:to-pink-100/50
                 before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-300
                 after:absolute after:inset-0 after:rounded-3xl after:border-2 after:border-transparent
                 after:group-hover:border-rose-500 after:transition-colors after:duration-300"
        >
            {/* Icon with enhanced styling */}
            {icon && (
                <div className="text-rose-500 group-hover:text-rose-700 transition-colors duration-300 z-10 text-4xl mb-2">
                    {icon}
                </div>
            )}
            <span className="z-10 text-2xl font-bold text-rose-700 group-hover:text-rose-800 transition-colors duration-300">
                {title}
            </span>
        </button>
    )
}
