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
      <div className="flex min-h-100 w-full flex-col items-center justify-center p-6 text-center">
        <p
          className={`text-xl sm:text-2xl italic text-rose-300 ${cormorant.className}`}>
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
    // ဖုန်းတွင် px-6, py-12 သုံးထားပြီး နေရာပိုချောင်စေပါသည်
    <div className="relative mx-auto w-full max-w-3xl px-6 py-12 sm:px-16 md:px-24 md:py-24">
      {/* Top Rose Gold Decor Line */}
      <div className="absolute left-1/2 top-0 h-0.75 w-16 sm:w-24 -translate-x-1/2 bg-rose-200 rounded-b-md"></div>

      {/* Date Label (ဖုန်းတွင် ပိုသေးမည်) */}
      <div className="mb-10 sm:mb-16 text-center">
        <span
          className={`tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] md:text-xs uppercase text-rose-400 font-medium ${inter.className}`}>
          {note.dateLabel || "A Timeless Memory"}
        </span>
      </div>

      {/* Title (ဖုန်းတွင် 3xl, Tablet တွင် 4xl, Desktop တွင် 5xl) */}
      <div className="mb-10 sm:mb-16 text-center">
        <h1
          className={`text-3xl sm:text-4xl md:text-5xl text-stone-800 ${cormorant.className}`}>
          {note.title}
        </h1>
        <div className="mx-auto mt-6 sm:mt-8 h-px w-12 sm:w-16 bg-rose-200"></div>
      </div>

      {/* Note Body (ဖုန်းတွင် စာဖတ်ရလွယ်ကူသော text-sm မှစမည်) */}
      <div
        className={`mx-auto max-w-prose space-y-6 sm:space-y-8 text-center text-sm leading-loose tracking-wide text-stone-600 sm:text-base sm:leading-[2.2] md:text-lg md:leading-loose ${inter.className} font-light`}>
        <p
          className={`text-lg sm:text-xl md:text-2xl italic text-stone-800 ${cormorant.className}`}>
          {note.greeting}
        </p>

        {paragraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Closing & Signature */}
      <div className="mt-16 sm:mt-24 flex flex-col items-center justify-center text-center">
        <p
          className={`mb-4 sm:mb-6 text-base sm:text-lg md:text-xl italic text-stone-500 ${cormorant.className}`}>
          {note.closing}
        </p>
        <p
          className={`text-5xl sm:text-6xl md:text-7xl text-rose-900/90 ${signatureFont.className}`}>
          {note.signature}
        </p>
      </div>

      {/* Bottom Rose Gold Decor Line */}
      <div className="absolute bottom-0 left-1/2 h-0.75 w-16 sm:w-24 -translate-x-1/2 bg-rose-200 rounded-t-md"></div>
    </div>
  );
}