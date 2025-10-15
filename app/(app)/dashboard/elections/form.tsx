"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {IconCalendar} from "@tabler/icons-react";
import {format} from "date-fns-tz";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {createElection, updateElection} from "@/actions/elections";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import type {Election} from "@/prisma/generated";

const electionSchema = z
    .object({
        title: z.string().min(3, "Judul minimal 3 karakter"),
        description: z.string().min(3, "Deskripsi minimal 3 karakter"),
        startAt: z.date(),
        endAt: z.date(),
    })
    .refine((data) => data.endAt > data.startAt, {
        message: "Tanggal selesai harus lebih dari tanggal mulai",
        path: ["endAt"], // error akan muncul di field endAt
    });

type ElectionSchema = z.infer<typeof electionSchema>;

export function ElectionForm({
                                 election,
                                 locked,
                             }: {
    election?: Election;
    locked?: boolean;
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // biar cuma bandingkan tanggal, bukan jam

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<ElectionSchema>({
        resolver: zodResolver(electionSchema),
        defaultValues: {
            title: election?.title || "",
            description: election?.description || "",
            startAt: election?.startAt || new Date(),
            endAt: election?.endAt || new Date(),
        },
    });

    function onSubmit(values: ElectionSchema) {
        startTransition(async () => {
            if (election?.id) {
                await updateElection(election.id, values);
                toast("Pemilihan berhasil diupdate");
            } else {
                await createElection(values);
                toast("Pemilihan berhasil dibuat");
            }
            router.push("/dashboard/elections");
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Judul</FormLabel>
                            <FormControl>
                                <Input readOnly={locked} placeholder="Judul" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <Textarea
                                    readOnly={locked}
                                    placeholder="Deskripsi"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Start Date */}
                    <FormField
                        control={form.control}
                        name="startAt"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Mulai</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={locked}
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground",
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd MMMM yyyy")
                                                ) : (
                                                    <span>Pilih Tanggal</span>
                                                )}
                                                <IconCalendar className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < today}
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* End Date */}
                    <FormField
                        control={form.control}
                        name="endAt"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Tanggal Selesai</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={locked}
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground",
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd MMMM yyyy")
                                                ) : (
                                                    <span>Pilih Tanggal</span>
                                                )}
                                                <IconCalendar className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < form.watch("startAt")
                                            }
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <LoadingButton
                    className="w-full"
                    type="submit"
                    disabled={isPending || locked}
                    loading={isPending}
                >
                    {isPending ? "Menyimpan..." : "Simpan"}
                </LoadingButton>
            </form>
        </Form>
    );
}
