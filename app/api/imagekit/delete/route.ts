import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const {fileIds} = await req.json(); // array of fileId
        if (!fileIds || fileIds.length === 0) {
            return NextResponse.json({error: "fileIds required"}, {status: 400});
        }

        const res = await fetch(
            "https://api.imagekit.io/v1/files/batch/deleteByFileIds",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.NEXT_PUBLIC_IK_PRIVATE_KEY}:`,
                    ).toString("base64")}`,
                },
                body: JSON.stringify({fileIds}),
            },
        );

        const data = await res.json();
        return NextResponse.json(data, {status: res.status});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: "Failed to delete files"},
            {status: 500},
        );
    }
}
