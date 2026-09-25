"use client";

import { useState } from "react";
import { MapPin, Minus, PackagePlus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TransactionType } from "@/lib/stock";

export type Product = { id: string; name: string; sku: string; currentStock: number; rak: string; brand: string };
type Props = { product: Product; onClose: () => void; onSubmit: (data: { type: TransactionType; qty: number; operator: string; notes: string }) => Promise<void> };

export function ProductSheet({ product, onClose, onSubmit }: Props) {
  const [type, setType] = useState<TransactionType>("IN");
  const [qty, setQty] = useState(1);
  const [operator, setOperator] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (!operator.trim()) return;
    setSaving(true);
    try { await onSubmit({ type, qty, operator: operator.trim(), notes: notes.trim() }); } finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-20 flex items-end bg-slate-950/70" role="dialog" aria-modal="true" aria-labelledby="product-title">
    <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border-t border-slate-700 bg-slate-950 p-5 pb-8 shadow-2xl">
      <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-600" />
      <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-2 text-slate-400" aria-label="Close product details"><X /></button>
      <p className="text-sm font-bold text-emerald-400">{product.brand}</p>
      <h2 id="product-title" className="pr-10 text-2xl font-bold">{product.name}</h2>
      <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-lg bg-slate-800 px-3 py-1 font-mono text-sm">{product.sku}</span><span className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1 text-sm"><MapPin className="size-4 text-emerald-400" />Rak {product.rak}</span></div>
      <div className="my-5 rounded-2xl bg-slate-900 p-5 text-center"><p className="text-sm text-slate-400">Stok Saat Ini</p><p className="mt-1 text-5xl font-black text-white">{product.currentStock}<span className="ml-2 text-lg font-medium text-slate-400">Pcs</span></p></div>
      <div className="grid grid-cols-2 gap-3"><Button variant={type === "IN" ? "primary" : "secondary"} onClick={() => setType("IN")}><PackagePlus className="mr-1 inline size-5" />Barang Masuk</Button><Button variant={type === "OUT" ? "danger" : "secondary"} onClick={() => setType("OUT")}><Minus className="mr-1 inline size-5" />Barang Keluar</Button></div>
      <label className="mt-5 block text-sm font-semibold">Jumlah<Input className="mt-2" type="number" min="1" inputMode="numeric" value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))} /></label>
      <div className="mt-2 grid grid-cols-3 gap-2">{[1, 5, 10].map((value) => <Button key={value} variant="secondary" onClick={() => setQty((current) => current + value)}><Plus className="mr-1 inline size-4" />{value}</Button>)}</div>
      <label className="mt-5 block text-sm font-semibold">Nama operator<Input className="mt-2" placeholder="Contoh: Budi" value={operator} onChange={(event) => setOperator(event.target.value)} /></label>
      <label className="mt-4 block text-sm font-semibold">Catatan <span className="font-normal text-slate-500">(opsional)</span><textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 outline-none focus:border-emerald-400" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      <Button className="mt-5 w-full text-base" onClick={() => void submit()} disabled={saving || !operator.trim()}>{saving ? "Menyimpan..." : "SIMPAN TRANSAKSI"}</Button>
    </div>
  </div>;
}
