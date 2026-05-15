import { Montserrat, Geist } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers";
import ClientWrapper from "./ClientWrapper";
import { Suspense } from "react";
import MobileBottomNav from "./components/MobileBottomNav";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-montserrat",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "18 News Portal",
  description: "Portal Berita Terkini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${montserrat.variable} antialiased m-0 p-0`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <ClientWrapper>{children}</ClientWrapper>
          </Suspense>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
