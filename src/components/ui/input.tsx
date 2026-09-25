import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`min-h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-lg text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 ${className}`} {...props} />;
}
