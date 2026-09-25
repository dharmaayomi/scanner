"use client";

import { useEffect } from "react";
import { Camera, Flashlight, FlashlightOff, ScanBarcode } from "lucide-react";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";
import { Button } from "@/components/ui/button";

type Props = { onDetected: (sku: string) => void; autoStart?: boolean; disabled?: boolean };

export function Scanner({ onDetected, autoStart = false, disabled = false }: Props) {
  const { start, toggleTorch, isScanning, hasTorch, torchOn, error } = useBarcodeScanner("barcode-reader", onDetected);
  useEffect(() => { if (autoStart && !disabled) void start(); }, [autoStart, disabled, start]);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div><p className="text-sm font-semibold text-emerald-400">SCANNER AKTIF</p><h2 className="text-xl font-bold">Scan barcode barang</h2></div>
        <ScanBarcode className="size-7 text-slate-400" aria-hidden="true" />
      </div>
      <div className="relative min-h-64 overflow-hidden rounded-2xl bg-slate-950">
        <div id="barcode-reader" className="min-h-64" />
        {!isScanning && <div className="absolute inset-0 grid place-items-center text-center text-slate-400"><Camera className="mx-auto mb-2 size-10" /><span>Siap untuk membuka kamera</span></div>}
      </div>
      {error && <p role="alert" className="mt-3 rounded-xl bg-rose-950/60 p-3 text-sm text-rose-200">{error}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button onClick={() => void start()} disabled={disabled || isScanning} className="text-base"><Camera className="mr-2 inline size-5" />{isScanning ? "Kamera aktif" : "Buka scanner"}</Button>
        <Button variant="secondary" onClick={() => void toggleTorch()} disabled={!isScanning || !hasTorch} aria-label="Toggle flashlight">
          {torchOn ? <FlashlightOff className="mx-auto size-5" /> : <Flashlight className="mx-auto size-5" />}
        </Button>
      </div>
    </section>
  );
}
