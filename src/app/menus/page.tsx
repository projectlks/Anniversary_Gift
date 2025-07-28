"use client";
import { Box } from "@/components/Box";
import { useRouter } from "next/navigation";

export default function Menus() {

  const router = useRouter();



  const handleLogout = async () => {
    await fetch('/api/lock', { method: 'POST' })
    router.push('/lock') // redirect to lock page after locking
  };
  return (
    <div className="flex flex-col space-y-5 items-center min-h-screen overflow-y-scroll scrollbar-hide pt-[100px] justify-start]">
      <h1 className="text-4xl font-bold text-[#a2d2ff] tracking-widest uppercase">Menu of Our Love</h1>


      <div onClick={handleLogout} className="flex items-center justify-center gap-5 text-2xl text-red-500">

        <p>
          Logout
        </p>

      </div>

      <div className="flex items-center justify-center gap-5 text-2xl text-red-500">
        <HeartIcon1 />
        <p>Together Forever</p>
        <HeartIcon1 />
      </div>

      <div className="w-[90%] max-w-7xl p-3 h-[95%]">
        <div className="gap-5  grid grid-cols-2 scrollbar-hide h-full">
          <Box
            title="Anniversary"
            description="A love that grows every day."
            icon1={<HeartIcon1 />}
            bgColor="#fce4ec"
            circleColor="#f8bbd0"
            textColor="#ec407a"
            goTo="memories"
          />

          <Box
            title="Journey"
            description="A journey of love and memories."
            icon1={<HeartIcon2 />}
            bgColor="#ffcdd2"
            circleColor="#f8bbd0"
            textColor="#ec407a"
            goTo="journey"
          />

          <Box
            title="Love Puzzle"
            description="A puzzle of our love story."
            icon1={<HeartIcon3 />}
            bgColor="#e1bee7"
            circleColor="#f8bbd0"
            textColor="#ec407a"
            goTo="puzzle"
          />

          <Box
            title="Love Notes"
            description="A collection of our sweetest memories."
            icon1={<HeartIcon4 />}
            bgColor="#ffcdd2"
            circleColor="#b2dfdb"
            textColor="#ec407a"
            goTo="journey"
          />


        </div>
      </div>
    </div>
  );
}

function HeartIcon1() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="#ffafcc" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
               4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
               14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
               3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function HeartIcon2() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ffafcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function HeartIcon3() {
  return (
    <svg width="64" height="64" viewBox="0 0 32 32" fill="#ffb3c6" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 29s-13-8.35-13-17A7 7 0 0 1 16 7a7 7 0 0 1 13 5c0 8.65-13 17-13 17Z" />
    </svg>
  );
}

function HeartIcon4() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="#ffc9de" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C-8 8 6-3 12 5c6-8 20 3 0 16z" />
    </svg>
  );
}
