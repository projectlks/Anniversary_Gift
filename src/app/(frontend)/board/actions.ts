"use server";
import { prisma } from "@/libs/prisma"; // 🌟 အစ်ကို့ လမ်းကြောင်းအတိုင်း ပြင်ပါ
import { pusher } from "@/libs/pusher";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ---------------------------------------------------------
// 🌟 Zod Schemas
// ---------------------------------------------------------
const noteIdSchema = z.string().min(1, "Note ID မရှိပါ။");

const createNoteSchema = z.object({
    coupleId: z.string().min(1),
    x: z.number(),
    y: z.number(),
});

const updateContentSchema = z.object({
    noteId: noteIdSchema,
    newContent: z.string().max(500, "မှတ်စုစာသား အလွန်ရှည်နေပါသည်။"),
    coupleId: z.string().min(1),
});

const updatePositionSchema = z.object({
    noteId: noteIdSchema,
    x: z.number(),
    y: z.number(),
    coupleId: z.string().min(1),
});

const updateColorSchema = z.object({
    noteId: noteIdSchema,
    newColor: z.string().startsWith("bg-", "အရောင်သတ်မှတ်ချက် မှားယွင်းနေပါသည်။"),
    coupleId: z.string().min(1),
});

const deleteNoteSchema = z.object({
    noteId: noteIdSchema,
    coupleId: z.string().min(1),
});

const addReactionSchema = z.object({
    noteId: noteIdSchema,
    emoji: z.string(),
    coupleId: z.string().min(1),
});

// ---------------------------------------------------------
// 🌟 Server Actions
// ---------------------------------------------------------

export async function createShortNote(coupleId: string, x: number, y: number) {
    const parsed = createNoteSchema.safeParse({ coupleId, x, y });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

    const newNote = await prisma.shortNote.create({
        data: {
            coupleId: parsed.data.coupleId,
            content: "",
            color: "bg-[#FFF3A3]",
            x: parsed.data.x,
            y: parsed.data.y,
        },
    });

    await pusher.trigger(`board-${coupleId}`, "note-created", newNote);
    revalidatePath("/board");
}

export async function updateNoteContent(noteId: string, newContent: string, coupleId: string) {
    const parsed = updateContentSchema.safeParse({ noteId, newContent, coupleId });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

    await prisma.shortNote.update({
        where: { id: parsed.data.noteId },
        data: { content: parsed.data.newContent },
    });

    await pusher.trigger(`board-${parsed.data.coupleId}`, "note-content-changed", {
        noteId: parsed.data.noteId,
        content: parsed.data.newContent,
    });
}

export async function updateNotePosition(noteId: string, x: number, y: number, coupleId: string) {
    const parsed = updatePositionSchema.safeParse({ noteId, x, y, coupleId });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

    await prisma.shortNote.update({
        where: { id: parsed.data.noteId },
        data: { x: parsed.data.x, y: parsed.data.y },
    });

    await pusher.trigger(`board-${parsed.data.coupleId}`, "note-moved", {
        noteId: parsed.data.noteId,
        x: parsed.data.x,
        y: parsed.data.y,
    });
}

export async function updateNoteColor(noteId: string, newColor: string, coupleId: string) {
    const parsed = updateColorSchema.safeParse({ noteId, newColor, coupleId });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

    await prisma.shortNote.update({
        where: { id: parsed.data.noteId },
        data: { color: parsed.data.newColor },
    });

    await pusher.trigger(`board-${parsed.data.coupleId}`, "note-color-changed", {
        noteId: parsed.data.noteId,
        color: parsed.data.newColor,
    });
}

export async function deleteShortNote(noteId: string, coupleId: string) {
    const parsed = deleteNoteSchema.safeParse({ noteId, coupleId });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

    await prisma.shortNote.delete({
        where: { id: parsed.data.noteId },
    });

    await pusher.trigger(`board-${parsed.data.coupleId}`, "note-deleted", {
        noteId: parsed.data.noteId,
    });

    revalidatePath("/board");
}

export async function bringNoteToFront(noteId: string, coupleId: string) {
    await pusher.trigger(`board-${coupleId}`, "note-front", { noteId });
}

// 🌟 Reaction အသစ်ထည့်မည့် Function
export async function addNoteReaction(noteId: string, emoji: string, coupleId: string) {
    const parsed = addReactionSchema.safeParse({ noteId, emoji, coupleId });
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

    const note = await prisma.shortNote.findUnique({ where: { id: parsed.data.noteId } });
    const currentReactions = note?.reactions ? note.reactions.split(",") : [];

    if (currentReactions.length >= 7) currentReactions.shift();
    currentReactions.push(parsed.data.emoji);

    const newReactionsString = currentReactions.join(",");

    await prisma.shortNote.update({
        where: { id: parsed.data.noteId },
        data: { reactions: newReactionsString },
    });

    await pusher.trigger(`board-${parsed.data.coupleId}`, "note-reacted", {
        noteId: parsed.data.noteId,
        reactions: newReactionsString,
    });
}