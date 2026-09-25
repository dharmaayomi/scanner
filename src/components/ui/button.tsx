import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" };

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const colors = {
    primary: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    danger: "bg-rose-500 text-white hover:bg-rose-400",
  };
  return <button className={`min-h-12 rounded-xl px-4 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${colors[variant]} ${className}`} {...props} />;
}
