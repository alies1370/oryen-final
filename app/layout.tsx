 // app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google'; // فونت فارسی زیبا
import { RestaurantProvider } from './context/RestaurantContext';

const vazir = Vazirmatn({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'سیستم مدیریت رستوران',
  description: 'محاسبه بهای تمام شده و مدیریت منو',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        <RestaurantProvider>
          {children}
        </RestaurantProvider>
      </body>
    </html>
  );
}

