import {type ClassValue, clsx} from "clsx";
import {formatInTimeZone} from "date-fns-tz";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
    return formatInTimeZone(date, "Asia/Jakarta", "dd-MM-yyyy");
}

export const parseWhatsapp = (value: string): string => {
    if (value.startsWith("0")) {
        return `62${value.slice(1).replace(/\D/g, "")}`;
    } else if (value.startsWith("+62")) {
        return value.replace("+62", "62").replace(/\D/g, "");
    } else {
        return value.replace(/\D/g, "");
    }
};

export function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (error) => reject(error));
        img.setAttribute("crossOrigin", "anonymous"); // supaya bisa di-draw ke canvas
        img.src = url;
    });
}

export const getCroppedImg = async (
    imageSrc: string,
    crop: any,
): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob!);
        }, "image/jpeg");
    });
};
