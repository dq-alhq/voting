import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

export default function ElectionLoading() {
    return (
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold tracking-tight">
                    Daftar Pemilihan
                </h3>
                <p className="text-muted-foreground">
                    Berikut adalah daftar pemilihan yang telah dibuat
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-6 w-full"/>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-14 w-full"/>
                        <Skeleton className="h-14 w-full"/>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-6 w-full"/>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-6 w-full"/>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-14 w-full"/>
                        <Skeleton className="h-14 w-full"/>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-6 w-full"/>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-6 w-full"/>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-14 w-full"/>
                        <Skeleton className="h-14 w-full"/>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-6 w-full"/>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-full"/>
                        <Skeleton className="h-6 w-full"/>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-14 w-full"/>
                        <Skeleton className="h-14 w-full"/>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-6 w-full"/>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
