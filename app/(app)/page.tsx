import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ClientPage from "@/app/(app)/client-page";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Aplikasi Voting",
};

export default async function Page() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  return <ClientPage></ClientPage>;
}
