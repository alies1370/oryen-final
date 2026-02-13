 
// app/page.tsx
"use client";

import React, { useState } from 'react';
import RawMaterialsTab from './components/RawMaterialsTab';
import SemiFinishedGoodsTab from './components/SemiFinishedGoodsTab';
import MenuTab from './components/MenuTab'; // فرض بر این است که این فایل را دارید

export default function Home() {
  const [activeTab, setActiveTab] = useState('raw_materials');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="p-10 text-center text-gray-500">داشبورد مدیریتی (به زودی)</div>;
      case 'iranian_menu':
        return <MenuTab filter="iranian" />;
      case 'foreign_menu':
        return <MenuTab filter="foreign" />;
      case 'raw_materials':
        return <RawMaterialsTab />;
      case 'semi_finished':
        return <SemiFinishedGoodsTab />;
      default:
        return <RawMaterialsTab />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* هدر سبز رنگ دقیقاً مشابه نسخه ۱ */}
      <header className="bg-[#0f5132] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">مدیریت بهای تمام شده رستوران اورین</h1>
              <p className="text-emerald-100 text-sm opacity-90">سیستم محاسبه دقیق سود و هزینه (ورژن ۲۴ بهمن)</p>
            </div>
            <div className="flex gap-4 text-left">
              <div className="bg-emerald-800/50 p-3 rounded-lg border border-emerald-600/30">
                <div className="text-xs text-emerald-200">میانگین حاشیه سود</div>
                <div className="text-2xl font-bold dir-ltr">%45.5</div>
              </div>
              <div className="bg-emerald-800/50 p-3 rounded-lg border border-emerald-600/30">
                <div className="text-xs text-emerald-200">تعداد غذا</div>
                <div className="text-2xl font-bold dir-ltr">74</div>
              </div>
            </div>
          </div>
        </div>

        {/* نوار ناوبری (Tabs) */}
        <div className="bg-white/10 backdrop-blur-sm mt-6 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto">
              <TabButton 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
                icon="📊" 
                label="داشبورد" 
              />
              <TabButton 
                active={activeTab === 'iranian_menu'} 
                onClick={() => setActiveTab('iranian_menu')} 
                icon="🥘" 
                label="منوی ایرانی" 
              />
              <TabButton 
                active={activeTab === 'foreign_menu'} 
                onClick={() => setActiveTab('foreign_menu')} 
                icon="🍕" 
                label="منوی فرنگی" 
              />
              <TabButton 
                active={activeTab === 'raw_materials'} 
                onClick={() => setActiveTab('raw_materials')} 
                icon="🥬" 
                label="مواد اولیه" 
              />
              <TabButton 
                active={activeTab === 'semi_finished'} 
                onClick={() => setActiveTab('semi_finished')} 
                icon="🥣" 
                label="نیمه آماده" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}

// کامپوننت دکمه تب
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative
        ${active ? 'text-white bg-white/20' : 'text-emerald-100 hover:bg-white/10 hover:text-white'}
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />
      )}
    </button>
  );
}
