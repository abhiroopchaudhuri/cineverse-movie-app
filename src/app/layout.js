import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cineverse",
  description: "Next Gen Movie Recommendation App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 right-0 w-full h-20 bg-gray-900 z-20"></nav>
        {children}
        </body>
    </html>
  );
}
