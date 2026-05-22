// import { Cormorant_Garamond, Inter, Great_Vibes } from "next/font/google";

// // Premium Serif Font - ခေါင်းစဉ်များအတွက်
// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   style: ["normal", "italic"],
// });

// // Clean Sans Font - စာပိုဒ်များအတွက် (ဖတ်ရအရမ်းရှင်းစေရန်)
// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["300", "400"],
// });

// // Elegant Signature Font - လက်မှတ်အတွက်
// const signatureFont = Great_Vibes({
//   subsets: ["latin"],
//   weight: ["400"],
// });

// export interface LoveNoteView {
//   dateLabel?: string;
//   title?: string;
//   greeting?: string;
//   content?: string;
//   closing?: string;
//   signature?: string;
// }

// export default function Paper({ note }: { note?: LoveNoteView | null }) {
//   // Empty State
//   if (!note || !note.content) {
//     return (
//       <div className="flex min-h-[500px] w-full flex-col items-center justify-center bg-gray-50/50 p-8 text-center">
//         <p className={`text-2xl italic text-gray-400 ${cormorant.className}`}>
//           A blank page awaits...
//         </p>
//         <p className={`mt-4 text-sm text-gray-400 ${inter.className}`}>
//           Please write a note to see it beautifully displayed here.
//         </p>
//       </div>
//     );
//   }

//   const paragraphs = note.content
//     .split("\n")
//     .map((text) => text.trim())
//     .filter(Boolean);

//   return (
//     <div className="relative mx-auto w-full max-w-3xl bg-white px-8 max-h-full h-250 overflow-auto py-16 shadow-[0_20px_50px_rgb(0,0,0,0.05)] sm:px-16 md:px-24 md:py-24">
//       {/* Top Minimal Decor Line */}
//       <div className="absolute left-1/2 top-0 h-1 w-24 -translate-x-1/2 bg-gray-200"></div>

//       {/* Date Label */}
//       <div className="mb-16 text-center">
//         <span
//           className={`tracking-[0.3em] text-xs uppercase text-gray-400 ${inter.className}`}>
//           {note.dateLabel || "A Timeless Memory"}
//         </span>
//       </div>

//       {/* Title */}
//       <div className="mb-16 text-center">
//         <h1
//           className={`text-4xl text-gray-900 sm:text-5xl md:text-6xl ${cormorant.className}`}>
//           {note.title}
//         </h1>
//         {/* Simple elegant divider */}
//         <div className="mx-auto mt-8 h-[1px] w-12 bg-gray-300"></div>
//       </div>

//       {/* Note Body */}
//       <div
//         className={`mx-auto max-w-prose space-y-8 text-center text-base leading-[2.2] tracking-wide text-gray-600 sm:text-lg sm:leading-loose ${inter.className} font-light`}>
//         <p className={`text-xl italic text-gray-800 ${cormorant.className}`}>
//           {note.greeting}
//         </p>

//         {paragraphs.map((paragraph, idx) => (
//           <p key={idx}>{paragraph}</p>
//         ))}
//       </div>

//       {/* Closing & Signature */}
//       <div className="mt-24 flex flex-col items-center justify-center text-center">
//         <p
//           className={`mb-6 text-lg italic text-gray-500 ${cormorant.className}`}>
//           {note.closing}
//         </p>
//         <p
//           className={`text-5xl text-gray-800 sm:text-6xl ${signatureFont.className}`}>
//           {note.signature}
//         </p>
//       </div>

//       {/* Bottom Minimal Decor Line */}
//       <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 bg-gray-200"></div>
//     </div>
//   );
// }

import { Cormorant_Garamond, Inter, Great_Vibes } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
});

const signatureFont = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

export interface LoveNoteView {
  dateLabel?: string;
  title?: string;
  greeting?: string;
  content?: string;
  closing?: string;
  signature?: string;
}

export default function Paper({ note }: { note?: LoveNoteView | null }) {
  if (!note || !note.content) {
    return (
      <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center bg-gray-50/50 p-8 text-center">
        <p className={`text-xl italic text-gray-400 ${cormorant.className}`}>
          A blank page awaits...
        </p>
      </div>
    );
  }

  const paragraphs = note.content
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    // ဖယ်ရှားထားသော အရာများ: h-250, max-h-full, overflow-auto
    <div className="relative mx-auto w-full min-h-full bg-white px-6 py-10 sm:px-12 md:px-16 md:py-16">
      {/* Top Minimal Decor Line */}
      <div className="absolute left-1/2 top-0 h-1 w-20 -translate-x-1/2 bg-gray-200"></div>

      {/* Date Label */}
      <div className="mb-10 text-center">
        <span
          className={`tracking-[0.2em] text-[10px] sm:text-xs uppercase text-gray-400 ${inter.className}`}>
          {note.dateLabel || "A Timeless Memory"}
        </span>
      </div>

      {/* Title */}
      <div className="mb-10 text-center">
        <h1
          className={`text-3xl text-gray-900 sm:text-4xl md:text-5xl ${cormorant.className}`}>
          {note.title}
        </h1>
        <div className="mx-auto mt-5 h-[1px] w-10 bg-gray-300"></div>
      </div>

      {/* Note Body */}
      <div
        className={`mx-auto max-w-prose space-y-6 text-center text-sm leading-[2.2] tracking-wide text-gray-600 sm:text-base sm:leading-loose ${inter.className} font-light`}>
        <p className={`text-lg italic text-gray-800 ${cormorant.className}`}>
          {note.greeting}
        </p>

        {paragraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Closing & Signature */}
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <p
          className={`mb-4 text-base italic text-gray-500 ${cormorant.className}`}>
          {note.closing}
        </p>
        <p
          className={`text-4xl text-gray-800 sm:text-5xl ${signatureFont.className}`}>
          {note.signature}
        </p>
      </div>

      {/* Bottom Minimal Decor Line */}
      <div className="absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 bg-gray-200"></div>
    </div>
  );
}