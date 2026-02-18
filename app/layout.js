import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";

const geist = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata = {
  title: "BinSentry Dashboard",
  description: "Feed Management Dashboard with Real-time Analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
