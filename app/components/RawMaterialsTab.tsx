 
// app/components/RawMaterialsTab.tsx
"use client";
import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const RawMaterialsTab = () => {
  const { rawMaterials, updateRawMaterialPrice, updateRawMaterialWaste } = useRestaurant();

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">لیست مواد اولیه</h2>
          <p className="text-sm text-gray-500 mt-1">تغییر قیمت در اینجا، هزینه تمام غذاها را به‌روز می‌کند</p>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">نام ماده</th>
              <th className="px-6 py-4 font-medium">واحد</th>
              <th className="px-6 py-4 font-medium">قیمت پایه (ریال)</th>
              <th className="px-6 py-4 font-medium">پرت (%)</th>
              <th className="px-6 py-4 font-medium">قیمت نهایی با پرت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rawMaterials.map((item) => {
              const finalPrice = item.pricePerUnit / (1 - (item.wastePercentage / 100 || 0));
              
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-gray-500">{item.unit}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      className="w-32 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={item.pricePerUnit}
                      onChange={(e) => updateRawMaterialPrice(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <input 
                      type="number"
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-emerald-500"
                      value={item.wastePercentage}
                      onChange={(e) => updateRawMaterialWaste(item.id, Number(e.target.value))}
                    />
                    <span className="text-gray-400">%</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {Math.round(finalPrice).toLocaleString('fa-IR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawMaterialsTab;
