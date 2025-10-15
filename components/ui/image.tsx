"use client";

import {buildSrc, type IKImageProps, Image as IKImage} from "@imagekit/next";
import {useState} from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_IK_URL_ENDPOINT;

export function Image(props: IKImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <IKImage
            urlEndpoint={urlEndpoint}
            style={
                isLoading
                    ? {
                        backgroundImage: `url(${buildSrc({
                            urlEndpoint: urlEndpoint as string,
                            src: props.src,
                            transformation: [
                                {
                                    quality: 10,
                                    blur: 90,
                                },
                            ],
                        })})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }
                    : {}
            }
            onLoad={() => setIsLoading(false)}
            {...props}
        />
    );
}
