import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { DemoSwitcher } from "@/components/demo-switcher";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Family Development",
    template: "%s | Family Development",
  },
  description:
    "Marriage process, counselling and bereavement support from the Family Development Department.",
};

export const viewport: Viewport = {
  themeColor: "#f6f5f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${instrument.variable} antialiased`}>
      <body>
        {children}
        <DemoSwitcher />
      </body>
    </html>
  );
}
