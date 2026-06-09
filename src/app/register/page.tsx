"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join KVAI for early access, saved bags and faster checkout."
      image="forest"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fn">First name</Label>
            <Input id="fn" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ln">Last name</Label>
            <Input id="ln" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required placeholder="At least 8 characters" />
        </div>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5 accent-[#1a1816]" />
          I agree to the Terms of Service and Privacy Policy.
        </label>
        <Button type="submit" size="lg" className="w-full">
          Create Account
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
