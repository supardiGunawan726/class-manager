import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const geist = localFont({
  src: [
    {
      path: "../fonts/geist/Geist-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-UltraBlack.woff2",
      weight: "950",
      style: "normal",
    },
    {
      path: "../fonts/geist/Geist-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

export const metadata = {
  title: "Class Manager",
  description: "Web app untuk membantu administrasi kelas",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geist.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
