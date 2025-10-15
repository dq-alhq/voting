"use client";

import {upload} from "@imagekit/next";
import {
    IconCircleCheck,
    IconCrop,
    IconRestore,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {type ChangeEvent, useRef, useState} from "react";
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Button} from "@/components/ui/button";
import {
    ImageCrop,
    ImageCropApply,
    ImageCropContent,
    ImageCropReset,
} from "@/components/ui/image-crop";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";

const authenticator = async () => {
    const res = await fetch("/api/imagekit");
    if (!res.ok) throw new Error("Auth failed");
    return res.json();
};

interface Props {
    ratio?: number;
    max?: number;
    value?: string | null;
    onChange?: (value: string | null) => void;
    isRemoving?: boolean;
}

export const UploadImage = ({
                                ratio = 3 / 4,
                                max = 1024 * 1024,
                                value,
                                onChange,
                                isRemoving,
                            }: Props) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(false);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: max / 1024 / 1024,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);

                setSelectedFile(compressedFile);
                setIsCropping(true);
                setCroppedImage(null);
            } catch (error) {
                console.error("Compression failed:", error);
            }
        }
    };
    const handleReset = () => {
        setSelectedFile(null);
        setCroppedImage(null);
    };

    const [progress, setProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [currentSize, setCurrentSize] = useState<number>(0);
    const [totalSize, setTotalSize] = useState<number>(0);
    const abortController = useRef(new AbortController());

    const applyCrop = async (image: string) => {
        try {
            setIsUploading(true);
            const {signature, expire, token, publicKey} = await authenticator();
            const res = await upload({
                file: image,
                fileName: Date.now().toString(),
                expire,
                token,
                signature,
                publicKey,
                onProgress: (evt) => {
                    setProgress((evt.loaded / evt.total) * 100);
                    setCurrentSize(evt.loaded);
                    setTotalSize(evt.total);
                },
                abortSignal: abortController.current.signal,
            });

            onChange?.(res.url || "");
        } catch (err) {
            console.error("❌ Upload failed:", err);
        } finally {
            setIsCropping(false);
            setTimeout(() => setCroppedImage(image), 300);
            setProgress(0);
            setCurrentSize(0);
            setTotalSize(0);
            setIsUploading(false);
        }
    };

    const router = useRouter();

    const handleRemove = async () => {
        onChange?.(null);
        setSelectedFile(null);
        setCroppedImage(null);
        setIsCropping(false);
        setProgress(0);
        setCurrentSize(0);
        setTotalSize(0);
        setIsUploading(false);
        await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/imagekit/delete/${value}`,
            {
                method: "POST",
            },
        )
            .then(() => {
                toast.success("Image removed");
            })
            .finally(() => {
                router.refresh();
            });
    };

    const inputRef = useRef<HTMLInputElement>(null);
    if (!selectedFile) {
        return (
            <>
                <Input
                    ref={inputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    type="file"
                />
                <AspectRatio
                    ratio={ratio}
                    className="relative size-full overflow-hidden rounded-xl border shadow-sm"
                >
                    {value ? (
                        <>
                            <Image
                                alt="Image"
                                src={value || "/placeholder.svg"}
                                width={300}
                                height={400}
                                className="size-full object-cover"
                                unoptimized
                            />
                            {isRemoving && (
                                <Button
                                    onClick={handleRemove}
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    type="button"
                                    variant="destructive"
                                >
                                    <IconTrash/>
                                    Hapus
                                </Button>
                            )}
                        </>
                    ) : (
                        <Image
                            alt="Upload Image"
                            src="/placeholder.svg"
                            width={300}
                            height={300}
                            className="size-full object-cover"
                            unoptimized
                        />
                    )}
                    <Button
                        onClick={() => inputRef.current?.click()}
                        size="sm"
                        className="absolute right-2 bottom-2"
                        type="button"
                        variant="outline"
                    >
                        Upload
                    </Button>
                </AspectRatio>
            </>
        );
    }
    if (croppedImage) {
        return (
            <AspectRatio
                ratio={ratio}
                className="relative flex size-full overflow-hidden rounded-xl border shadow-sm"
            >
                <Image
                    alt="Cropped"
                    height={400}
                    width={300}
                    className="size-full object-cover"
                    src={croppedImage}
                    unoptimized
                />
                <Button
                    onClick={handleReset}
                    size="sm"
                    className="absolute right-2 bottom-2"
                    type="button"
                    variant="destructive"
                >
                    <IconTrash/>
                    Hapus
                </Button>
            </AspectRatio>
        );
    }

    return (
        <AlertDialog open={isCropping} onOpenChange={setIsCropping}>
            <AlertDialogTrigger className="sr-only"/>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Crop Image</AlertDialogTitle>
                    <AlertDialogDescription>
                        Crop image to {ratio.toFixed(2)} ratio
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <ImageCrop
                    aspect={ratio}
                    file={selectedFile}
                    maxImageSize={max}
                    onCrop={applyCrop}
                >
                    <ImageCropContent/>
                    <div className="flex items-center gap-2">
                        <ImageCropApply asChild>
                            <Button size="sm" variant="outline" type="button">
                                <IconCrop/>
                                Apply Crop
                            </Button>
                        </ImageCropApply>
                        <ImageCropReset asChild>
                            <Button size="sm" variant="outline" type="button">
                                <IconRestore/>
                                Reset
                            </Button>
                        </ImageCropReset>
                        <Button
                            onClick={handleReset}
                            size="sm"
                            type="button"
                            variant="destructive"
                        >
                            <IconTrash/>
                            Cancel
                        </Button>
                    </div>
                    {isUploading && (
                        <ProgressUpload
                            currentSize={currentSize}
                            totalSize={totalSize}
                            progress={progress}
                            name={selectedFile?.name || ""}
                        />
                    )}
                </ImageCrop>
            </AlertDialogContent>
        </AlertDialog>
    );
};

function ProgressUpload({
                            progress,
                            name,
                            currentSize,
                            totalSize,
                        }: {
    progress: number;
    name: string;
    currentSize: number;
    totalSize: number;
}) {
    return (
        <div
            className="flex w-full justify-center self-start pt-4"
            style={{
                all: "revert",
                display: "flex",
                justifyContent: "center",
                alignSelf: "flex-start",
                paddingTop: "1.5rem",
                width: "100%",
                fontSize: "14px",
                lineHeight: "1.5",
                letterSpacing: "normal",
            }}
        >
            <div className="w-full max-w-md space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {progress < 100 ? `Uploading ${name}...` : "Upload complete!"}
            </span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full"/>
                    <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>
              {(currentSize / 1024).toFixed(2)} KB /{" "}
                {(totalSize / 1024).toFixed(2)} KB
            </span>
                        {progress < 100 ? (
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                                <IconX className="size-3"/>
                                Cancel
                            </Button>
                        ) : (
                            <IconCircleCheck className="size-4 text-green-500"/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
