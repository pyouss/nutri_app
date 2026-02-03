import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "nutri_app",
  description: "Learning-first nutrition tracking webapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
