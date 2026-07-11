import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import { WashiProvider } from '../context/WashiContext';
import './globals.css'; // Global styles

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'وشى — نظام إدارة البوث',
  description: 'نظام تشغيل وإدارة بوثات المعارض والمبيعات والمخزون لبراند وشى الفاخر',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable}`}>
      <body className="font-sans antialiased bg-[var(--color-wusha-ivory)] text-[var(--color-wusha-ink)]" suppressHydrationWarning>
        <WashiProvider>
          {children}
        </WashiProvider>
      </body>
    </html>
  );
}

