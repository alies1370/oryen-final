 
// app/components/SemiFinishedGoodsTab.tsx
"use client";
import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const SemiFinishedGoodsTab = () => {
  // اینجا ما تابع calculateSemiFinishedCost را از کانتکست می‌گیریم
  const { semiFinishedGoods, calculateSemiFinishedCost } = useRestaurant();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">محصولات نیمه آماده</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {semiFinishedGoods.map((item) => {
          // استفاده از نام صحیح تابع برای جلوگیری از ارور
          const cost = calculateSemiFinishedCost(item); 
          
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-100">
                  {item.unit}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">مواد تشکیل دهنده:</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ing, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {ing.rawMaterialId} (x{ing.amount})
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">قیمت تمام شده:</span>
                <span className="text-lg font-bold text-emerald-600">
                  {Math.round(cost).toLocaleString('fa-IR')} <span className="text-xs">ریال</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SemiFinishedGoodsTab;
