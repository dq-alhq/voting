"use client";
import {IconTrash} from "@tabler/icons-react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {deleteElection} from "@/actions/elections";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";

export default function DeleteElection({id}: { id: string }) {
    const router = useRouter();

    async function confirm() {
        await deleteElection(id);
        toast("Pemilihan berhasil dihapus");
        router.push("/dashboard/elections");
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                    <IconTrash/>
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Menghapus pemilihan ini sekaligus menghapus seluruh kandidat dan
                        hasil
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <Button variant="destructive" onClick={confirm}>
                        Konfirmasi
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
