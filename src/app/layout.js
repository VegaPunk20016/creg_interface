import { Inter, Inter_Tight, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
})

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

          {children}
      
        
      </body>
    </html>
  );
}