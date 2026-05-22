import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new NextResponse("Missing file ID", { status: 400 });
    }

    // Google Drive ရဲ့ မူရင်း Download လင့်ခ်
    const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;

    // 🌟 Audio Player မှ ရှေ့တိုး/နောက်ဆုတ် (Seek) လုပ်ပါက အဆင်ပြေစေရန် Range ကို ဖမ်းယူပါမည်
    const range = request.headers.get("range");
    const fetchHeaders: HeadersInit = {};
    if (range) {
        fetchHeaders["Range"] = range;
    }

    try {
        // Backend မှ Google Drive သို့ လှမ်းယူပါမည်
        const response = await fetch(driveUrl, { headers: fetchHeaders });

        if (!response.ok) {
            return new NextResponse("Failed to fetch audio", { status: response.status });
        }

        // 🌟 အရေးကြီးဆုံးအဆင့်: Browser က သီချင်းအဖြစ် သိစေရန် Headers များကို ပြင်ဆင်ပါမည်
        const headers = new Headers(response.headers);
        headers.set("Content-Type", "audio/mpeg"); // သီချင်းဖိုင်အဖြစ် သတ်မှတ်သည်
        headers.set("Accept-Ranges", "bytes"); // Seek လုပ်ခွင့် ပေးသည်
        headers.delete("Content-Disposition"); // Download အတင်းဆွဲခိုင်းသည့် Header ကို ဖြုတ်ချလိုက်သည်

        return new NextResponse(response.body, {
            status: response.status, // 206 Partial Content ကိုပါ အလိုလို Handle လုပ်ပေးသွားပါမည်
            headers,
        });
    } catch (error) {
        console.error("Audio stream error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}