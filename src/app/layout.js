import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald', // This creates a CSS variable
});

export const metadata = {
  title: "Cineverse",
  description: "Next Gen Movie Recommendation App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${oswald.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}