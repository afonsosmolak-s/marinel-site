"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-warm">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background p-5 lg:flex lg:flex-col">
        <AdminNav />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-5 py-4 lg:hidden">
          <Link
            href="/admin/dashboard"
            className="font-heading text-lg text-foreground italic"
          >
            Marinel
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label="Abrir menú" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-5">
              <SheetHeader className="sr-only">
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <AdminNav onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
