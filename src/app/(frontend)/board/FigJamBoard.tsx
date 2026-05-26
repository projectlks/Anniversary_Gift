"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Pusher from "pusher-js";
import {
  createShortNote,
  updateNoteColor,
  updateNoteContent,
  updateNotePosition,
  deleteShortNote,
  bringNoteToFront,
  addNoteReaction, // 🌟 ပါဝင်ပါသည်
} from "./actions";

export interface NoteData {
  id: string;
  coupleId: string;
  content: string;
  color: string;
  x: number;
  y: number;
  createdAt: string | Date;
  reactions?: string; // 🌟 ပါဝင်ပါသည်
}

const NOTE_COLORS = [
  { name: "Yellow", class: "bg-[#FFF3A3]" },
  { name: "Pink", class: "bg-[#FFC4E1]" },
  { name: "Blue", class: "bg-[#A3E5FF]" },
  { name: "Green", class: "bg-[#B4FFA3]" },
  { name: "Orange", class: "bg-[#FFD1A3]" },
];

const EMOJIS = ["❤️", "😂", "🥺", "🔥", "👍", "✨"];

export default function FigJamBoard({
  coupleId,
  initialNotes,
}: {
  coupleId: string;
  initialNotes: NoteData[];
}) {
  const [notes, setNotes] = useState<NoteData[]>(initialNotes || []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotes(initialNotes || []);
  }, [initialNotes]);

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusherClient.subscribe(`board-${coupleId}`);

    channel.bind(
      "note-moved",
      (data: { noteId: string; x: number; y: number }) => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === data.noteId ? { ...n, x: data.x, y: data.y } : n,
          ),
        );
      },
    );

    channel.bind(
      "note-color-changed",
      (data: { noteId: string; color: string }) => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === data.noteId ? { ...n, color: data.color } : n,
          ),
        );
      },
    );

    channel.bind(
      "note-content-changed",
      (data: { noteId: string; content: string }) => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === data.noteId ? { ...n, content: data.content } : n,
          ),
        );
      },
    );

    channel.bind("note-created", (newNote: NoteData) => {
      setNotes((prev) =>
        prev.some((n) => n.id === newNote.id) ? prev : [...prev, newNote],
      );
    });

    channel.bind("note-deleted", (data: { noteId: string }) => {
      setNotes((prev) => prev.filter((n) => n.id !== data.noteId));
    });

    channel.bind("note-front", (data: { noteId: string }) => {
      setNotes((prev) => {
        const note = prev.find((n) => n.id === data.noteId);
        if (!note) return prev;
        return [...prev.filter((n) => n.id !== data.noteId), note];
      });
    });

    // 🌟 တစ်ဖက်လူ Reaction ပေးသည်ကို ဖမ်းမည်
    channel.bind(
      "note-reacted",
      (data: { noteId: string; reactions: string }) => {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === data.noteId ? { ...n, reactions: data.reactions } : n,
          ),
        );
      },
    );

    return () => pusherClient.unsubscribe(`board-${coupleId}`);
  }, [coupleId]);

  const handleAddNote = async () => {
    let spawnX = 100,
      spawnY = 100;
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      spawnX = window.innerWidth / 2 - 130 - rect.left;
      spawnY = Math.max(20, window.innerHeight - 350 - rect.top);
    }
    const tempId = `temp-${Date.now()}`;
    const newNote = {
      id: tempId,
      coupleId,
      content: "",
      color: "bg-[#FFF3A3]",
      x: spawnX,
      y: spawnY,
      createdAt: new Date(),
      reactions: "",
    };

    setNotes((prev) => [...prev, newNote]);
    setSelectedNoteId(tempId);
    await createShortNote(coupleId, newNote.x, newNote.y);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setNotes((prev) => {
      const note = prev.find((n) => n.id === noteId);
      if (!note) return prev;
      return [...prev.filter((n) => n.id !== noteId), note];
    });
    if (!noteId.startsWith("temp-")) bringNoteToFront(noteId, coupleId);
  };

  const requestDeleteNote = (noteId: string) => {
    setDeletingNoteId(noteId);
  };

  const confirmDeleteNote = async () => {
    if (!deletingNoteId) return;
    const noteId = deletingNoteId;
    setDeletingNoteId(null);
    setSelectedNoteId(null);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    if (!noteId.startsWith("temp-")) {
      await deleteShortNote(noteId, coupleId);
    }
  };

  const handleColorChange = async (noteId: string, newColor: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, color: newColor } : n)),
    );
    if (!noteId.startsWith("temp-"))
      await updateNoteColor(noteId, newColor, coupleId);
  };

  const handleContentChange = async (noteId: string, newContent: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, content: newContent } : n)),
    );
    if (!noteId.startsWith("temp-")) {
      await updateNoteContent(noteId, newContent, coupleId);
    }
  };

  // 🌟 Emoji React ပေးရန်
  const handleReact = async (noteId: string, emoji: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          const current = n.reactions ? n.reactions.split(",") : [];
          if (current.length >= 7) current.shift();
          current.push(emoji);
          return { ...n, reactions: current.join(",") };
        }
        return n;
      }),
    );

    if (!noteId.startsWith("temp-")) {
      await addNoteReaction(noteId, emoji, coupleId);
    }
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 w-screen h-screen bg-[#F5F5F5] overflow-hidden touch-none"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelectedNoteId(null);
      }}>
      {/* Custom Delete Confirm Modal */}
      <AnimatePresence>
        {deletingNoteId && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
            onPointerDown={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ဖျက်ပစ်မှာ သေချာပြီလား?
              </h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                ဒီမှတ်စုကို ဖျက်လိုက်ပါက ပြန်လည်ရယူ၍ ရမည်မဟုတ်ပါ။ တကယ်
                ဖျက်ပစ်ချင်တာ သေချာပါသလား?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeletingNoteId(null)}
                  className="flex-1 py-3 rounded-2xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  မဖျက်တော့ပါ
                </button>
                <button
                  onClick={confirmDeleteNote}
                  className="flex-1 py-3 rounded-2xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                  ဖျက်မည်
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={handleAddNote}
        className="fixed bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-[#0d99ff] text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg hover:bg-blue-600 transition font-medium whitespace-nowrap text-sm md:text-base">
        + New Note
      </button>

      <motion.div
        ref={canvasRef}
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        className="absolute top-0 left-0 cursor-grab active:cursor-grabbing touch-none"
        style={{
          width: "4000px",
          height: "4000px",
          backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelectedNoteId(null);
        }}>
        {notes?.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={() => handleSelectNote(note.id)}
            onColorChange={(color) => handleColorChange(note.id, color)}
            onContentChange={(newContent) =>
              handleContentChange(note.id, newContent)
            }
            onDelete={() => requestDeleteNote(note.id)}
            onReact={(emoji) => handleReact(note.id, emoji)} // 🌟 Prop အသစ်
          />
        ))}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------
// Sticky Note Component
// ---------------------------------------------------------
function StickyNote({
  note,
  isSelected,
  onSelect,
  onColorChange,
  onContentChange,
  onDelete,
  onReact,
}: {
  note: NoteData;
  isSelected: boolean;
  onSelect: () => void;
  onColorChange: (color: string) => void;
  onContentChange: (content: string) => void;
  onDelete: () => void;
  onReact: (emoji: string) => void;
}) {
  const [text, setText] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const x = useMotionValue(note.x);
  const y = useMotionValue(note.y);

  const reactionsList = note.reactions ? note.reactions.split(",") : [];

  useEffect(() => {
    x.set(note.x);
    y.set(note.y);
  }, [note.x, note.y, x, y]);

  useEffect(() => {
    if (!isEditing) setText(note.content);
  }, [note.content, isEditing]);

  useEffect(() => {
    if (!isSelected) {
      setIsEditing(false);
      setShowEmojiPicker(false);
    }
  }, [isSelected]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleDragEnd = async () => {
    const finalX = x.get(),
      finalY = y.get();
    if (!note.id.startsWith("temp-"))
      await updateNotePosition(note.id, finalX, finalY, note.coupleId);
  };

  const handleSaveText = () => {
    setIsEditing(false);
    if (text !== note.content) onContentChange(text);
  };

  useEffect(() => {
    const updateTime = () => {
      if (note.createdAt)
        setTimeAgo(
          formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }),
        );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [note.createdAt]);

  return (
    <motion.div
      style={{ x, y }}
      drag={!isEditing}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
        setShowEmojiPicker(false);
      }}
      className={`absolute w-64 h-64 md:w-80 md:h-80 flex flex-col transition-[filter] duration-200 ${
        isEditing
          ? "z-50 drop-shadow-2xl cursor-text"
          : isSelected
            ? "z-40 drop-shadow-xl cursor-grab active:cursor-grabbing"
            : "z-10 drop-shadow-md cursor-pointer"
      }`}>
      {isSelected && !isEditing && (
        <div
          className="absolute -top-16 md:-top-14 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 md:gap-2 z-[60]"
          onPointerDown={(e) => e.stopPropagation()}>
          {/* Colors */}
          {NOTE_COLORS.map((color) => (
            <button
              key={color.class}
              onClick={() => onColorChange(color.class)}
              className={`w-8 h-8 md:w-6 md:h-6 rounded-full border border-black/10 transition-transform hover:scale-110 active:scale-95 ${color.class} ${note.color === color.class ? "ring-2 ring-[#0d99ff] ring-offset-2" : ""}`}
            />
          ))}

          <div className="w-[1px] h-6 bg-gray-200 mx-1" />

          {/* Emoji React Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-8 h-8 md:w-7 md:h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
              title="React">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-2 py-1.5 rounded-full shadow-lg border border-gray-100 flex gap-1 z-[70]">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReact(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:scale-125 transition-transform px-1">
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[1px] h-6 bg-gray-200 mx-1" />

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="w-8 h-8 md:w-7 md:h-7 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete Note">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </div>
      )}

      {/* Note Design Layers */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${note.color} ${isEditing || isSelected ? "ring-2 ring-[#0d99ff]" : "border border-black/5"}`}
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 48px), calc(100% - 48px) 100%, 0 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none z-20"
        style={{ filter: "drop-shadow(-3px -3px 5px rgba(0,0,0,0.3))" }}>
        <div
          className="w-full h-full rounded-tl-sm"
          style={{
            background:
              "linear-gradient(315deg, transparent 48%, rgba(255,255,255,0.9) 48%, rgba(255,255,255,0.2) 58%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      <textarea
        ref={textareaRef}
        readOnly={!isEditing}
        maxLength={150}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSaveText}
        placeholder={isEditing ? "မှတ်စုလေး ရေးပါ..." : ""}
        className={`relative z-30 w-full h-full p-4 md:p-5 bg-transparent outline-none resize-none text-gray-800 text-base md:text-lg leading-relaxed ${!isEditing ? "pointer-events-none" : "pointer-events-auto"}`}
      />

      {/* 🌟 Reaction Emoji Display 🌟 */}
      {reactionsList.length > 0 && (
        <div className="absolute -bottom-3 right-8 flex -space-x-2 z-[60] pointer-events-none">
          {reactionsList.map((emoji, idx) => (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              key={`${emoji}-${idx}`}
              className="w-7 h-7 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-xs">
              {emoji}
            </motion.div>
          ))}
        </div>
      )}

      <div className="absolute bottom-2 md:bottom-3 left-3 md:left-4 text-xs md:text-sm font-medium text-gray-800/40 pointer-events-none z-40">
        * {timeAgo}
      </div>
    </motion.div>
  );
}
