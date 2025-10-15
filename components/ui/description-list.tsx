import type {ComponentPropsWithRef} from "react";
import {cn} from "@/lib/utils";

const DL = ({className, ...props}: ComponentPropsWithRef<"dl">) => {
    return (
        <dl
            className={cn(
                "grid grid-cols-1 text-base/6 sm:grid-cols-[min(50%,calc(var(--spacing)*80))_auto] sm:text-sm/6",
                className,
            )}
            {...props}
        />
    );
};

const DT = ({className, ...props}: ComponentPropsWithRef<"dt">) => {
    return (
        <dt
            className={cn(
                "col-start-1 border-t pt-3 text-muted-foreground first:border-none sm:py-3",
                className,
            )}
            {...props}
        />
    );
};

const DD = ({className, ...props}: ComponentPropsWithRef<"dd">) => {
    return (
        <dd
            className={cn(
                "pt-1 pb-3 text-foreground sm:border-t sm:nth-2:border-none sm:py-3",
                className,
            )}
            {...props}
        />
    );
};

DL.T = DT;
DL.D = DD;

export {DL};
