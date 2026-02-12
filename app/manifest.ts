 
import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'بهای تمام شده رستوران اورین', // اسمی که در صفحه اسپلش (هنگام باز شدن) می‌آید
    short_name: 'بهای اورین', // اسمی که زیر آیکون در صفحه اصلی گوشی نوشته می‌شود
    description: 'سیستم محاسبه قیمت تمام شده و سود رستوران',
    start_url: '/',
    display: 'standalone', // نوار آدرس را حذف می‌کند تا شبیه اپلیکیشن شود
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon.png', // این همان عکسی است که در مرحله ۱ گفتم
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png', // برای سایزهای بزرگتر
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.ico', // حالت پیش‌فرض
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
