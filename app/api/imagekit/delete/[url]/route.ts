import {NextResponse} from "next/server";

const options = {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_IK_PRIVATE_KEY}:`,
        ).toString("base64")}`,
    },
};

export async function POST(
    req: Request,
    {params}: { params: Promise<{ url: string }> },
) {
    try {
        const {url} = await params;

        const urlParts = url.split("/");
        const fileNameWithExtension = urlParts[urlParts.length - 1]; // Assuming file name is the last part
        const fileId = fileNameWithExtension.split(".")[0]; // Assuming fileId is the file name without extension

        const res = await fetch(
            `https://api.imagekit.io/v1/files/${fileId}`,
            options,
        );
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.json(error);
    }
}
