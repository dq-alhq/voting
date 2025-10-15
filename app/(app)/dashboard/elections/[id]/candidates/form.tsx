"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {IconBrandInstagram} from "@tabler/icons-react";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {z} from "zod";
import {createCandidate, updateCandidate} from "@/actions/candidate";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import {Textarea} from "@/components/ui/textarea";
import {UploadImage} from "@/components/upload-image";
import type {Candidate} from "@/prisma/generated";

const candidateSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    visi: z.string().min(10, "Minimal 10 karakter"),
    misi: z.string().min(10, "Minimal 10 karakter"),
    photo: z.string(),
    instagram: z.string(),
});

type CandidateSchema = z.infer<typeof candidateSchema>;

export function CandidateForm({candidate}: { candidate?: Candidate }) {
    const {id} = useParams();

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CandidateSchema>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            name: candidate?.name || "",
            visi: candidate?.visi || "",
            misi: candidate?.misi || "",
            photo: candidate?.photo || "",
            instagram: candidate?.instagram || "",
        },
    });

    function onSubmit(values: CandidateSchema) {
        startTransition(async () => {
            if (candidate?.id) {
                await updateCandidate(candidate.id, values);
                toast("Pemilihan berhasil diupdate");
            } else {
                await createCandidate(values, id?.toString() || "");
                toast("Pemilihan berhasil dibuat");
            }
            router.push("/dashboard/elections");
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 grid-cols-1 lg:grid-cols-4"
            >
                <FormField
                    control={form.control}
                    name="photo"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="sr-only">Foto</FormLabel>
                            <FormControl>
                                <UploadImage
                                    {...field}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="space-y-4 lg:col-span-3">
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nama Kandidat</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="visi"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Visi</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Visi" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="misi"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Misi</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Misi" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="instagram"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <div className="relative">
                                    <div
                                        className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-2 peer-disabled:opacity-50">
                                        <IconBrandInstagram className="size-5"/>
                                        <span className="sr-only">Instagram</span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="@akun_instagram"
                                            {...field}
                                            className="peer pl-9"
                                        />
                                    </FormControl>
                                </div>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <LoadingButton
                    className="w-full col-span-full"
                    type="submit"
                    disabled={isPending}
                    loading={isPending}
                >
                    {isPending ? "Menyimpan..." : "Simpan"}
                </LoadingButton>
            </form>
        </Form>
    );
}
