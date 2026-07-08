"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  getSearchText?: (row: T) => string;
  emptyState: React.ReactNode;
}

// Tabla genérica reutilizada por todas las entidades del panel (Cursos,
// Masterclass, Testimonios, Formularios) — mismo patrón de búsqueda,
// cabecera y filas en todo el panel.
export function AdminTable<T>({
  data,
  columns,
  rowKey,
  searchPlaceholder,
  getSearchText,
  emptyState,
}: AdminTableProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query || !getSearchText) return data;
    const q = query.toLowerCase();
    return data.filter((row) => getSearchText(row).toLowerCase().includes(q));
  }, [data, query, getSearchText]);

  return (
    <div>
      {getSearchText && (
        <div className="relative mb-4 max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder ?? "Buscar..."}
            className="pl-9"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        emptyState
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.header} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.header} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
