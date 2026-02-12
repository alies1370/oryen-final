 'use client';

import React, { useState } from 'react';
import { useCostCalculator } from './hooks/useCostCalculator';

// تابع کمکی برای فرمت اعداد
const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR');
};

export default function CostManagementPage() {
  const { 
    menu, 
    ingredients, 
    semiFinished,
    updateIngredientPrice, 
    updateIngredientWaste 
  } = useCostCalculator();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'iranian' | 'farangi' | 'ingredients' | 'semi'>('iranian');

  // فیلتر کردن منوها
  const iranianMenu = menu.filter(item => item.category === 'ایرانی');
  const farangiMenu = menu.filter(item => item.category === 'فرنگی');

  // محاسبات خلاصه داشبورد
  const totalItems = menu.length;
  const avgProfitMargin = menu.reduce((acc, curr) => acc + curr.profitMargin, 0) / totalItems || 0;
  const lowProfitItems = menu.filter(item => item.profitMargin < 45).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      
      {/* هدر */}
      <header className="bg-emerald-800 text-white p-6 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">مدیریت بهای تمام شده رستوران اورین</h1>
            <p className="text-emerald-200 text-sm opacity-90">سیستم محاسبه دقیق سود و هزینه (۷۴ آیتم)</p>
          </div>
          <div className="flex gap-6 text-sm bg-emerald-900/30 p-3 rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <span className="block text-emerald-200 text-xs">تعداد غذا</span>
              <span className="font-bold text-lg">{formatPrice(totalItems)}</span>
            </div>
            <div className="w-px bg-emerald-600/50"></div>
            <div className="text-center">
              <span className="block text-emerald-200 text-xs">میانگین حاشیه سود</span>
              <span className="font-bold text-lg" dir="ltr">%{avgProfitMargin.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* تب‌ها */}
      <div className="bg-white shadow-sm sticky top-[88px] z-40">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex whitespace-nowrap gap-1 pt-2">
            <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="داشبورد" icon="📊" />
            <TabButton active={activeTab === 'iranian'} onClick={() => setActiveTab('iranian')} label="منوی ایرانی" icon="🍚" />
            <TabButton active={activeTab === 'farangi'} onClick={() => setActiveTab('farangi')} label="منوی فرنگی" icon="🍕" />
            <TabButton active={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')} label="مواد اولیه" icon="🥦" />
            <TabButton active={activeTab === 'semi'} onClick={() => setActiveTab('semi')} label="نیمه آماده" icon="🥣" />
          </div>
        </div>
      </div>

      {/* محتوا */}
      <main className="container mx-auto p-4 md:p-6 pb-20">
        
        {/* تب داشبورد */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="سودآورترین غذا" 
                value={menu.reduce((prev, current) => (prev.profit > current.profit) ? prev : current).name} 
                subValue={`${formatPrice(menu.reduce((prev, current) => (prev.profit > current.profit) ? prev : current).profit)} ریال`} 
                color="green" 
                icon="💰"
              />
              <StatCard 
                title="کمترین حاشیه سود" 
                value={menu.reduce((prev, current) => (prev.profitMargin < current.profitMargin) ? prev : current).name} 
                subValue={`${menu.reduce((prev, current) => (prev.profitMargin < current.profitMargin) ? prev : current).profitMargin.toFixed(1)}%`} 
                color="red" 
                icon="⚠️"
              />
              <StatCard 
                title="غذاهای زیر ۴۵٪ سود" 
                value={lowProfitItems} 
                subValue="نیاز به بررسی قیمت یا رسپی" 
                color="yellow" 
                icon="📉"
              />
            </div>
          </div>
        )}

        {/* تب منوی ایرانی (نمایش کارتی) */}
        {activeTab === 'iranian' && (
          <MenuGrid items={iranianMenu} title="منوی غذاهای ایرانی" />
        )}

        {/* تب منوی فرنگی (نمایش کارتی) */}
        {activeTab === 'farangi' && (
          <MenuGrid items={farangiMenu} title="منوی غذاهای فرنگی" />
        )}

        {/* تب مواد اولیه (نمایش جدول برای ویرایش راحت‌تر) */}
        {activeTab === 'ingredients' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">لیست مواد اولیه</h2>
                <p className="text-gray-500 text-sm mt-1">تغییر قیمت در اینجا، هزینه تمام غذاها را به‌روز می‌کند</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-100 text-gray-600 font-bold border-b">
                  <tr>
                    <th className="p-4 w-1/4">نام ماده</th>
                    <th className="p-4 w-1/6">واحد</th>
                    <th className="p-4 w-1/6">قیمت پایه (ریال)</th>
                    <th className="p-4 w-1/6">پرت (%)</th>
                    <th className="p-4 w-1/6">قیمت نهایی با پرت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ingredients.map((ing) => (
                    <tr key={ing.id} className="hover:bg-blue-50 transition-colors group">
                      <td className="p-4 font-medium text-gray-800">{ing.name}</td>
                      <td className="p-4 text-gray-500">{ing.unit}</td>
                      <td className="p-4">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            value={ing.basePrice}
                            onChange={(e) => updateIngredientPrice(ing.id, Number(e.target.value))}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <input 
                            type="number" 
                            className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            value={ing.wastePercentage}
                            onChange={(e) => updateIngredientWaste(ing.id, Number(e.target.value))}
                          />
                          <span className="absolute left-3 top-2 text-gray-400">%</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-gray-700 bg-gray-50/50">{formatPrice(Math.round(ing.finalPricePerUnit))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

         {/* تب نیمه آماده */}
         {activeTab === 'semi' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">محصولات نیمه آماده</h2>
              <p className="text-gray-500 text-sm mt-1">محاسبه شده بر اساس رسپی‌های داخلی</p>
            </div>
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-100 text-gray-600 font-bold border-b">
                <tr>
                  <th className="p-4">نام محصول</th>
                  <th className="p-4">واحد</th>
                  <th className="p-4">هزینه هر واحد (ریال)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {semiFinished.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 text-gray-500">{item.unit}</td>
                    <td className="p-4 font-bold text-emerald-700">{formatPrice(item.costPerUnit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}

// --- کامپوننت‌های رابط کاربری ---

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all duration-200 font-medium whitespace-nowrap ${
        active 
          ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ title, value, subValue, color, icon }: { title: string; value: string | number; subValue: string; color: 'green' | 'red' | 'yellow'; icon: string }) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorClasses[color]} shadow-sm flex items-start justify-between`}>
      <div>
        <h3 className="text-sm font-semibold opacity-80 mb-2">{title}</h3>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-xs font-medium opacity-70">{subValue}</div>
      </div>
      <div className="text-3xl opacity-20">{icon}</div>
    </div>
  );
}

// کامپوننت جدید برای نمایش گرافیکی (کارت)
function MenuGrid({ items, title }: { items: any[]; title: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800 border-r-4 border-emerald-500 pr-3">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{items.length} آیتم</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => {
           // شرط رنگ‌بندی: اگر سود کمتر از ۵۰٪ باشد قرمز، در غیر این صورت سبز
           const isLowProfit = item.profitMargin < 50;
           const statusColor = isLowProfit ? 'text-red-600 bg-red-50 border-red-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100';
           const barColor = isLowProfit ? 'bg-red-500' : 'bg-emerald-500';

           return (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Card Header */}
              <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">{item.name}</h3>
                  <span className="text-xs text-gray-400">کد: {item.id}</span>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${statusColor} flex flex-col items-center min-w-[60px]`}>
                  <span dir="ltr">{Math.round(item.profitMargin)}%</span>
                  <span className="text-[10px] opacity-80 font-normal">حاشیه سود</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-grow">
                
                {/* Sale Price */}
                <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-100">
                  <span className="text-gray-500 text-sm">قیمت فروش:</span>
                  <span className="font-bold text-gray-800 text-lg">{formatPrice(item.salePrice)} <span className="text-xs text-gray-400 font-normal">ریال</span></span>
                </div>

                {/* Cost Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">هزینه مواد:</span>
                    <span className="text-gray-700">{formatPrice(item.rawMaterialCost)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">سربار ثابت:</span>
                    <span className="text-gray-700">{formatPrice(item.fixedOverhead)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                    <span className="text-gray-600 font-medium">بهای تمام شده:</span>
                    <span className="font-bold text-gray-800">{formatPrice(item.totalCost)}</span>
                  </div>
                </div>

                {/* Profit */}
                <div className="pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 text-xs mb-1">سود خالص ریالی:</span>
                    <span className={`font-black text-xl ${isLowProfit ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatPrice(item.profit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Progress Bar */}
              <div className="h-2 w-full bg-gray-100 relative">
                <div 
                  className={`h-full absolute right-0 top-0 transition-all duration-500 ${barColor}`} 
                  style={{ width: `${Math.min(item.profitMargin, 100)}%` }}
                ></div>
              </div>

            </div>
           );
        })}
      </div>
    </div>
  );
}
