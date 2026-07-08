"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button
        type="submit"
        disabled={isPending}
        className="h-auto rounded-full bg-foreground py-3 text-primary-foreground hover:bg-foreground/85"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
