 // app/components/MenuTab.tsx
"use client";

import React from 'react';
import { useRestaurant, MenuItem } from '../context/RestaurantContext';

const MenuTab = () => {
  const { menuItems, calculateMenuCost } = useRestaurant();

  // فرمت کردن اعداد به صورت ۳ رقم ۳ رقم (مثلاً: 1,000,000)
  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString('fa-IR');
  };

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">مدیریت منو و سودآوری</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const cost = calculateMenuCost(item); // استفاده از تابع ایمن Context
          const profit = item.price - cost;
          const profitMargin = item.price > 0 ? ((profit / item.price) * 100).toFixed(1) : 0;

          return (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-left">
                     <span className="text-xs text-gray-400">قیمت فروش</span>
                     <div className="text-lg font-bold text-blue-600">{formatPrice(item.price)} ریال</div>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">بهای تمام شده مواد:</span>
                    <span className="font-semibold text-gray-800">{formatPrice(cost)} ریال</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${Number(profitMargin) > 30 ? 'bg-green-500' : Number(profitMargin) > 15 ? 'bg-yellow-400' : 'bg-red-500'}`} 
                      style={{ width: `${Math.min(Number(profitMargin), 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">سود ناخالص:</span>
                    <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPrice(profit)} ریال
                      <span className="text-xs mr-1">({profitMargin}%)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuTab;

