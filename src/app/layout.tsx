import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta-sans" });

export const metadata: Metadata = {
	title: "Warehouse Scanner",
	description: "Scan inventory and record stock transactions.",
	manifest: "/manifest.webmanifest",
	icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			className={cn(
				"light",
				"font-sans",
				jakartaSans.variable,
			)}
		>
			<body>{children}<Toaster position="top-center" /></body>
		</html>
	);
}
