import { Dancing_Script, Albert_Sans } from "next/font/google";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["400", "700"] });
const albertSans = Albert_Sans({ subsets: ["latin"], weight: ["300", "600"] });

export interface LoveNoteView {
  dateLabel: string;
  title: string;
  greeting: string;
  content: string;
  closing: string;
  signature: string;
}

export default function Paper({ note }: { note: LoveNoteView }) {
  const paragraphs = note.content
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <div className="bg-gradient-to-b max-h-full w-full overflow-hidden from-amber-50 to-yellow-50 shadow-2xl rounded-lg border border-amber-200 relative">
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-amber-100/20 to-yellow-100/30"></div>
      <div className="absolute left-16 top-0 bottom-0 w-px bg-red-200"></div>
      <div className="absolute left-0 right-0 top-16 h-px bg-blue-100 opacity-50"></div>
      <div className="absolute left-0 right-0 top-24 h-px bg-blue-100 opacity-30"></div>
      <div className="absolute left-0 right-0 top-32 h-px bg-blue-100 opacity-30"></div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-amber-700">
            <span className="text-sm font-medium">Written with love</span>
          </div>
          <div className="text-right text-amber-600">
            <p className={`text-sm font-medium space-y-6 text-gray-700 leading-relaxed ${albertSans.className}`}>
              {note.dateLabel || ""}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-2 font-serif">{note.title}</h1>
        </div>

        <div className={`space-y-6 text-gray-700 leading-relaxed ${dancingScript.className}`}>
          <p className="text-lg font-light">{note.greeting}</p>
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="text-lg font-light">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 text-right">
          <p className="text-lg text-rose-700 mb-4 font-medium">{note.closing}</p>
          <div className="relative">
            <p className="text-2xl font-bold text-rose-800 font-serif transform -rotate-2">{note.signature}</p>
          </div>
        </div>

        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-rose-200 rounded-lg opacity-30 pointer-events-none"></div>
      </div>

      <div className="absolute top-14 right-10 w-24 h-16 bg-gradient-to-bl from-amber-200 to-transparent transform rotate-45 translate-x-8 -translate-y-8"></div>
    </div>
  );
}
