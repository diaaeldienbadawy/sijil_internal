import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryProvider';

export const metadata: Metadata = {
  title: 'بوابة المنافسات — البحث والتحليل',
  description: 'منصة متقدمة للبحث والاستعلام وتحليل المنافسات والمشتريات الحكومية في المملكة العربية السعودية',
  keywords: 'منافسات, مشتريات حكومية, اعتماد, ترسيات, عطاءات',
};

export const viewport: Viewport = {
  themeColor: '#0c4a6e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />
      </head>
      <body><QueryProvider><AuthProvider>{children}</AuthProvider></QueryProvider></body>
    </html>
  );
}
