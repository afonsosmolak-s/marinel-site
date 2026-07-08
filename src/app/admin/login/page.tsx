import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm px-6">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-10">
        <p className="font-heading text-2xl text-foreground italic">
          Marinel
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Panel de administración
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
