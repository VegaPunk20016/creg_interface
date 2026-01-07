import { Inter, Inter_Tight } from "next/font/google"; //ofrece utilidades de google
import "./globals.css"; //importa los estilos globales

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
}); //configura la fuente Inter, aqui defino como la mando a llamar en css

const geistMono = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata = {
  title: "CREG", // Sirve a cambiar el título aquí
  description: "...",
};
// define como se ve la estructura base de la app

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

// aqui se define la estructura base de la app, el html y el body, 
// y se aplican las fuentes globales a todo el body usando las variables definidas anteriormente.
//  El {children} representa el contenido de cada página que se renderiza dentro de este layout.
// hueco o espacio para que se inserte el contenido de las páginas hijas.
// ANALOGIA:
// Marco de un cuadro (layout) donde se colocan diferentes pinturas (children que es page.js).



