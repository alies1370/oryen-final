 
// app/context/RestaurantContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  wastePercentage: number;
}

export interface SemiFinishedProduct {
  id: string;
  name: string;
  unit: string;
  ingredients: {
    rawMaterialId: string;
    amount: number;
  }[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string; // 'iranian' | 'foreign'
  price: number;
  recipe: {
    rawMaterialId?: string;
    semiFinishedId?: string;
    amount: number;
  }[];
}

interface RestaurantContextType {
  rawMaterials: RawMaterial[];
  semiFinishedGoods: SemiFinishedProduct[];
  menuItems: MenuItem[];
  updateRawMaterialPrice: (id: string, newPrice: number) => void;
  updateRawMaterialWaste: (id: string, newWaste: number) => void;
  calculateSemiFinishedCost: (product: SemiFinishedProduct) => number; // این تابع حیاتی است
  calculateMenuCost: (item: MenuItem) => number;
}

// داده‌های اولیه
const initialRawMaterials: RawMaterial[] = [
  { id: '1', name: 'فیله گوساله', unit: 'کیلوگرم', pricePerUnit: 15120000, wastePercentage: 0 },
  { id: '2', name: 'سردست گوساله', unit: 'کیلوگرم', pricePerUnit: 12075000, wastePercentage: 0 },
  { id: '3', name: 'ماهیچه', unit: 'کیلوگرم', pricePerUnit: 17172000, wastePercentage: 0 },
  { id: '4', name: 'ران گوساله', unit: 'کیلوگرم', pricePerUnit: 16428000, wastePercentage: 0 },
  { id: '5', name: 'سینه مرغ', unit: 'کیلوگرم', pricePerUnit: 3550000, wastePercentage: 5 },
  { id: '6', name: 'پیاز', unit: 'کیلوگرم', pricePerUnit: 389000, wastePercentage: 10 },
  // ... سایر مواد
];

const initialSemiFinished: SemiFinishedProduct[] = [
  {
    id: 'sf1',
    name: 'مایع کوبیده',
    unit: 'کیلوگرم',
    ingredients: [
      { rawMaterialId: '2', amount: 0.6 },
      { rawMaterialId: '6', amount: 0.7 },
    ]
  }
];

const initialMenu: MenuItem[] = [
  {
    id: 'm1',
    name: 'باقالی پلو با ماهیچه',
    category: 'iranian',
    price: 13000000,
    recipe: [{ rawMaterialId: '3', amount: 0.45 }]
  },
  {
    id: 'm2',
    name: 'پیتزا رست بیف',
    category: 'foreign',
    price: 8500000,
    recipe: [{ rawMaterialId: '1', amount: 0.1 }]
  }
];

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(initialRawMaterials);
  const [semiFinishedGoods, setSemiFinishedGoods] = useState<SemiFinishedProduct[]>(initialSemiFinished);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);

  const updateRawMaterialPrice = (id: string, newPrice: number) => {
    setRawMaterials(prev => prev.map(m => m.id === id ? { ...m, pricePerUnit: newPrice } : m));
  };

  const updateRawMaterialWaste = (id: string, newWaste: number) => {
    setRawMaterials(prev => prev.map(m => m.id === id ? { ...m, wastePercentage: newWaste } : m));
  };

  // رفع ارور calculateSemPrice: تابع محاسبه قیمت نیمه آماده
  const calculateSemiFinishedCost = (product: SemiFinishedProduct) => {
    return product.ingredients.reduce((total, ing) => {
      const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
      if (!rm) return total;
      const realPrice = rm.pricePerUnit / (1 - (rm.wastePercentage / 100 || 0));
      return total + (realPrice * ing.amount);
    }, 0);
  };

  const calculateMenuCost = (item: MenuItem) => {
    if (!item.recipe) return 0;
    return item.recipe.reduce((total, ing) => {
      if (ing.rawMaterialId) {
        const rm = rawMaterials.find(r => r.id === ing.rawMaterialId);
        if (rm) {
          const realPrice = rm.pricePerUnit / (1 - (rm.wastePercentage / 100 || 0));
          return total + (realPrice * ing.amount);
        }
      } else if (ing.semiFinishedId) {
        const sf = semiFinishedGoods.find(s => s.id === ing.semiFinishedId);
        if (sf) {
          return total + (calculateSemiFinishedCost(sf) * ing.amount);
        }
      }
      return total;
    }, 0);
  };

  return (
    <RestaurantContext.Provider value={{
      rawMaterials,
      semiFinishedGoods,
      menuItems,
      updateRawMaterialPrice,
      updateRawMaterialWaste,
      calculateSemiFinishedCost,
      calculateMenuCost
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within a RestaurantProvider');
  return context;
};
