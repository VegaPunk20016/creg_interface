import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/dashboard/Sidebar";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata = {
  title: "CREG Data",
  description: "Panel de visualización de datos de población y finanzas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-slate-600`}
      >
        <Sidebar />
        <main className="relative h-full min-h-screen transition-all duration-200 ease-in-out xl:ml-72 p-6">
          {children}
        </main>
        
      </body>
    </html>
  );
}