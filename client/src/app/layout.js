import { Outfit } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Solus OS",
  description: "Personal Workspace",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
