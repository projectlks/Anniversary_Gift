import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { auth } from '@/libs/auth';

export async function POST(request: Request): Promise<NextResponse> {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (


            ) => ({
                allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
            }),
            onUploadCompleted: async () => {

            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, // The webhook will retry 5 times waiting for a 200
        );
    }
}
