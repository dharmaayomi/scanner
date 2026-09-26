"use client";

import { useEffect, useState } from "react";
import { CloudOff, PackageSearch } from "lucide-react";
import { Scanner } from "@/components/scanner";
import { ProductSheet, type Product } from "@/components/product-sheet";
import type { TransactionType } from "@/lib/stock";

type Toast = { message: string; error?: boolean } | null;
const previewProduct: Product = { id: "preview", name: "Produk Contoh", sku: "1234567890123", currentStock: 24, rak: "A-03", brand: "Demo Brand" };

export default function ScannerPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [online, setOnline] = useState(true);
  const [scannerCycle, setScannerCycle] = useState(0);
  const [toast, setToast] = useState<Toast>(null);
  const restartScanner = () => { setProduct(null); setScannerCycle((value) => value + 1); };
  const notify = (message: string, error = false) => {
    setToast({ message, error });
    window.setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const updateConnection = () => { setOnline(navigator.onLine); if (!navigator.onLine) notify("Koneksi terputus. Scanner menunggu internet.", true); };
    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => { window.removeEventListener("online", updateConnection); window.removeEventListener("offline", updateConnection); };
  }, []);

  const findProduct = async (sku: string) => {
    if (!navigator.onLine) { notify("Tidak ada koneksi internet.", true); restartScanner(); return; }
    try {
      const response = await fetch(`/api/product/search?sku=${encodeURIComponent(sku)}`);
      const data = await response.json() as Product & { error?: string };
      if (!response.ok) throw new Error(data.error);
      setProduct(data);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Produk tidak dapat dicari.", true);
      restartScanner();
    }
  };

  const saveTransaction = async ({ type, qty, operator, notes }: { type: TransactionType; qty: number; operator: string; notes: string }) => {
    if (!product) return;
    const response = await fetch("/api/stock/transaction", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: product.id, sku: product.sku, type, qty, operator, notes, currentStock: product.currentStock }) });
    const data = await response.json() as { newStock?: number; error?: string };
    if (!response.ok) { notify(data.error ?? "Transaksi gagal disimpan.", true); return; }
    notify(`Stok berhasil diperbarui menjadi ${data.newStock}`);
    restartScanner();
  };

  return <main className="mx-auto min-h-dvh max-w-lg p-4 pb-8">
    <header className="mb-7 flex items-center gap-3 pt-3"><div className="rounded-2xl bg-primary p-3 text-primary-foreground"><PackageSearch className="size-7" /></div><div><h1 className="text-2xl font-black tracking-tight">Warehouse Scanner</h1><p className="text-sm text-muted-foreground">Scan • cek stok • simpan transaksi</p></div></header>
    {!online && <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-destructive bg-destructive/10 p-3 text-sm text-destructive"><CloudOff className="size-5 shrink-0" />Offline — sambungkan internet untuk mencari dan menyimpan data.</div>}
    <Scanner onDetected={findProduct} autoStart={scannerCycle > 0} disabled={!online || Boolean(product)} />
    <p className="mt-5 text-center text-xs text-muted-foreground">Arahkan kamera ke barcode produk. Kamera otomatis berhenti setelah kode terbaca.</p>
    {process.env.NODE_ENV === "development" && <button className="mt-3 w-full text-center text-xs text-muted-foreground underline" onClick={() => setProduct(previewProduct)}>Preview hasil scan</button>}
    {product && <ProductSheet product={product} onClose={restartScanner} onSubmit={saveTransaction} />}
    {toast && <div role="status" className={`fixed bottom-5 left-4 right-4 z-30 mx-auto max-w-md rounded-xl p-4 text-center font-semibold shadow-2xl ${toast.error ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}>{toast.message}</div>}
  </main>;
}
