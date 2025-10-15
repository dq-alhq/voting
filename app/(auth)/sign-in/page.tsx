import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { getServerSession } from "@/lib/get-session";
import { LoginForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) redirect("/");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative flex flex-col gap-4 p-6 md:p-10">
        <Link href="/" className="flex w-fit items-center gap-2 font-medium">
          <Image
            src="/next.svg"
            style={{ width: "120px", height: "auto" }}
            width={120}
            height={80}
            alt="Logo"
          />
        </Link>
        <div className="absolute top-6 right-6 z-50 md:top-10 md:right-10">
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          width={720}
          height={1280}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
