import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auth } from "@/lib/auth";
import { bucket, storage } from "@/lib/storage";

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json(
            { error: "Nicht angemeldet" },
            { status: 401 }
        );
    }

    const body = await request.json();

    if (
        typeof body.contentType !== "string" ||
        !["image/jpeg", "image/png", "application/pdf"].includes(
            body.contentType
        )
    ) {
        return NextResponse.json(
            { error: "Dateityp nicht erlaubt" },
            { status: 400 }
        );
    }

    // Der Server bestimmt den Speicher-Key.
    const key = `users/${session.user.id}/${randomUUID()}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: body.contentType,
    });

    const uploadUrl = await getSignedUrl(storage, command, {
        expiresIn: 60,
    });

    return NextResponse.json({
        key,
        uploadUrl,
        expiresIn: 60,
    });
}
