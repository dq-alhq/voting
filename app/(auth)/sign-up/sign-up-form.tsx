"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/auth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";

const signInSchema = z.object({
  name: z.string({ message: "Masukkan nama yang benar" }),
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export function RegsiterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit({ email, name, password }: SignInValues) {
    setError(null);
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    setLoading(false);

    if (error) {
      toast.error(error?.message || "Terjadi kesalahan");
      setError(error?.message || "Terjadi kesalahan");
    }

    if (!error) {
      toast.success("Berhasil Login");
      router.push(searchParams.get("redirect") || "/dashboard");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-bold text-2xl">Daftar</h1>
        <p className="text-balance text-muted-foreground text-sm">
          Silakan isikan form di bawah ini untuk mendaftar
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div role="alert" className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <LoadingButton type="submit" className="w-full" loading={loading}>
            Daftar
          </LoadingButton>
        </form>
      </Form>
      <Link
        href="/sign-in"
        className="text-center font-semibold text-sm text-primary"
      >
        Sudah punya akun? Login
      </Link>
    </div>
  );
}
