"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your KVAI account to continue."
      image="charcoal"
      footer={
        <>
          New to KVAI?{" "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/profile");
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </button>
          </div>
          <Input id="password" type="password" required placeholder="••••••••" />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#1a1816]" /> Keep me signed in
        </label>
        <Button type="submit" size="lg" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-luxe text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <Button variant="outline" size="lg" className="w-full">
        Continue with Google
      </Button>
    </AuthShell>
  );
}
