 import { useState, useMemo } from 'react';

// --- اینترفیس‌ها ---
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  basePrice: number;       // در اینجا قیمت نهایی با پرت را وارد می‌کنیم تا محاسبات دقیق باشد
  wastePercentage: number; // چون قیمت نهایی را وارد کردیم، پرت را صفر در نظر می‌گیریم یا نمایشی نگه می‌داریم
  finalPricePerUnit: number; 
}

export interface SemiFinishedProduct {
  id: string;
  name: string;
  unit: string;
  recipe: { type: 'raw'; id: string; quantity: number }[];
  costPerUnit: number;
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  category: 'ایرانی' | 'فرنگی';
  recipe: { type: 'raw' | 'semi'; id: string; quantity: number }[];
  manualCost?: number;     // هزینه دستی دقیق طبق اکسل برای مواردی که رسپی کامل ندارند
  rawMaterialCost: number; // هزینه مواد
  fixedOverhead: number;   // سربار ثابت (ریال)
  variableOverheadPercent: number; // سربار متغیر (درصد)
  totalCost: number;       // بهای تمام شده کل
  salePrice: number;       // قیمت فروش
  profit: number;          // سود ریالی
  profitMargin: number;    // حاشیه سود درصدی
}

export const useCostCalculator = () => {
  
  // 1. لیست مواد اولیه (قیمت‌ها دقیقاً برابر ستون "قیمت نهایی با پرت" در فایل ورد)
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    // --- پروتئین (قیمت نهایی با پرت) ---
    { id: 'ing_veal_fillet', name: 'فیله گوساله (با پرت)', unit: 'کیلوگرم', basePrice: 15120000, wastePercentage: 0, finalPricePerUnit: 15120000 },
    { id: 'ing_veal_sardast', name: 'سردست گوساله (با پرت)', unit: 'کیلوگرم', basePrice: 12075000, wastePercentage: 0, finalPricePerUnit: 12075000 },
    { id: 'ing_veal_muscle', name: 'ماهیچه (با پرت)', unit: 'کیلوگرم', basePrice: 17172000, wastePercentage: 0, finalPricePerUnit: 17172000 }, // دقیق طبق فایل ورد
    { id: 'ing_veal_leg', name: 'ران گوساله (با پرت)', unit: 'کیلوگرم', basePrice: 16428000, wastePercentage: 0, finalPricePerUnit: 16428000 },
    { id: 'ing_chicken_small', name: 'مرغ ریز (با پرت)', unit: 'کیلوگرم', basePrice: 2880000, wastePercentage: 0, finalPricePerUnit: 2880000 },
    { id: 'ing_chicken_breast', name: 'سینه مرغ (با پرت)', unit: 'کیلوگرم', basePrice: 3727500, wastePercentage: 0, finalPricePerUnit: 3727500 },
    { id: 'ing_chicken_leg', name: 'ران مرغ (با پرت)', unit: 'کیلوگرم', basePrice: 2040000, wastePercentage: 0, finalPricePerUnit: 2040000 },
    { id: 'ing_trout', name: 'ماهی قزل آلا (با پرت)', unit: 'کیلوگرم', basePrice: 4672500, wastePercentage: 0, finalPricePerUnit: 4672500 },
    
    // --- ادویه‌جات و افزودنی‌های ریز (محاسبه شده از روی هزینه مصرفی در رسپی باقالی پلو با ماهیچه) ---
    // قیمت‌ها مهندسی معکوس شده‌اند تا با مقدار مصرف، هزینه دقیق فایل ورد را بسازند
    { id: 'ing_turmeric', name: 'زردچوبه', unit: 'کیلوگرم', basePrice: 4080000, wastePercentage: 0, finalPricePerUnit: 4080000 }, // 20400 / 0.005
    { id: 'ing_garlic_fresh', name: 'سیر تازه', unit: 'کیلوگرم', basePrice: 3150000, wastePercentage: 0, finalPricePerUnit: 3150000 }, // 15750 / 0.005
    { id: 'ing_garlic_powder', name: 'پودر سیر', unit: 'کیلوگرم', basePrice: 6630000, wastePercentage: 0, finalPricePerUnit: 6630000 }, // 33150 / 0.005
    { id: 'ing_salt', name: 'نمک', unit: 'کیلوگرم', basePrice: 120200, wastePercentage: 0, finalPricePerUnit: 120200 }, // 601 / 0.005
    { id: 'ing_pepper_red', name: 'فلفل قرمز', unit: 'کیلوگرم', basePrice: 3570000, wastePercentage: 0, finalPricePerUnit: 3570000 }, // 17850 / 0.005
    { id: 'ing_spices_general', name: 'ادویه جات کلی', unit: 'کیلوگرم', basePrice: 5304000, wastePercentage: 0, finalPricePerUnit: 5304000 }, // طبق اکبر جوجه

    // --- سایر اقلام ---
    { id: 'ing_oil', name: 'روغن', unit: 'کیلوگرم', basePrice: 1563680, wastePercentage: 0, finalPricePerUnit: 1563680 }, // محاسبه شده از رسپی
    { id: 'ing_paste', name: 'رب گوجه', unit: 'کیلوگرم', basePrice: 1365000, wastePercentage: 0, finalPricePerUnit: 1365000 },
    { id: 'ing_pomegranate_paste', name: 'رب انار', unit: 'کیلوگرم', basePrice: 3675000, wastePercentage: 0, finalPricePerUnit: 3675000 }, // طبق رسپی اکبر جوجه
    { id: 'ing_onion', name: 'پیاز', unit: 'کیلوگرم', basePrice: 427900, wastePercentage: 0, finalPricePerUnit: 427900 },
    { id: 'ing_eggplant', name: 'بادمجان', unit: 'کیلوگرم', basePrice: 802700, wastePercentage: 0, finalPricePerUnit: 802700 },
    { id: 'ing_walnut', name: 'گردو', unit: 'کیلوگرم', basePrice: 8400000, wastePercentage: 0, finalPricePerUnit: 8400000 },
    { id: 'ing_kashk', name: 'کشک', unit: 'کیلوگرم', basePrice: 1995000, wastePercentage: 0, finalPricePerUnit: 1995000 },
    { id: 'ing_lentil', name: 'عدس', unit: 'کیلوگرم', basePrice: 2520000, wastePercentage: 0, finalPricePerUnit: 2520000 },
    { id: 'ing_beans_green', name: 'لوبیا سبز', unit: 'کیلوگرم', basePrice: 1942000, wastePercentage: 0, finalPricePerUnit: 1942000 },
    { id: 'ing_raisin', name: 'کشمش', unit: 'کیلوگرم', basePrice: 4400000, wastePercentage: 0, finalPricePerUnit: 4400000 },
    { id: 'ing_macaroni', name: 'ماکارونی', unit: 'کیلوگرم', basePrice: 700000, wastePercentage: 0, finalPricePerUnit: 700000 },
    { id: 'ing_tomato', name: 'گوجه فرنگی', unit: 'کیلوگرم', basePrice: 500000, wastePercentage: 0, finalPricePerUnit: 500000 },
    { id: 'ing_mushroom', name: 'قارچ', unit: 'کیلوگرم', basePrice: 2100000, wastePercentage: 0, finalPricePerUnit: 2100000 },
    { id: 'ing_gouda', name: 'پنیر گودا', unit: 'عدد', basePrice: 91350, wastePercentage: 0, finalPricePerUnit: 91350 },
    { id: 'ing_toast', name: 'نان تست', unit: 'عدد', basePrice: 52500, wastePercentage: 0, finalPricePerUnit: 52500 },
  ]);

  // 2. محصولات نیمه آماده
  // نکته مهم: قیمت واحد طوری تنظیم شده که 0.18 کیلوگرم آن دقیقاً هزینه فایل ورد را بسازد
  const [semiFinished, setSemiFinished] = useState<SemiFinishedProduct[]>([
    {
      id: 'semi_chelo', name: 'چلو آماده', unit: 'کیلوگرم',
      recipe: [],
      costPerUnit: 3849566 // چون 0.18 کیلوگرم آن باید بشود 692922 (طبق رسپی اکبر جوجه)
    },
    {
      id: 'semi_baghali', name: 'باقالی پلو آماده', unit: 'کیلوگرم',
      recipe: [],
      costPerUnit: 4140100 // چون 0.18 کیلوگرم آن باید بشود 745218 (طبق رسپی ماهیچه)
    }
  ]);

  // بدون تغییر در لاجیک چون قیمت‌های بالا نهایی هستند
  const processedIngredients = useMemo(() => ingredients, [ingredients]);

  // 3. منوی کامل غذاها (۷۴ آیتم) با رسپی‌های دقیق برای موارد موجود در فایل ورد
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // ================== منوی ایرانی (۳۴ مورد) ==================
    {
      id: 'ir_1', code: '1', name: 'باقالی پلو با ماهیچه', category: 'ایرانی',
      // رسپی دقیق طبق فایل ورد (جمع کل مواد: ۸،۶۱۷،۳۸۹ ریال)
      recipe: [
        { type: 'raw', id: 'ing_veal_muscle', quantity: 0.45 }, // ماهیچه: 7,727,400
        { type: 'semi', id: 'semi_baghali', quantity: 0.18 },   // باقالی پلو: 745,218
        { type: 'raw', id: 'ing_onion', quantity: 0.01 },       // پیاز: 4,279
        { type: 'raw', id: 'ing_paste', quantity: 0.01 },       // رب: 13,650
        { type: 'raw', id: 'ing_turmeric', quantity: 0.005 },   // زردچوبه: 20,400
        { type: 'raw', id: 'ing_garlic_fresh', quantity: 0.005 },// سیر: 15,750
        { type: 'raw', id: 'ing_garlic_powder', quantity: 0.005 },// پودر سیر: 33,150
        { type: 'raw', id: 'ing_salt', quantity: 0.005 },       // نمک: 601
        { type: 'raw', id: 'ing_oil', quantity: 0.025 },        // روغن: 39,092
        { type: 'raw', id: 'ing_pepper_red', quantity: 0.005 }, // فلفل قرمز: 17,850
      ],
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 13000000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_2', code: '2', name: 'کباب سلطانی', category: 'ایرانی',
      recipe: [], manualCost: 4147728, // طبق اکسل
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 8900000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_3', code: '3', name: 'کباب برگ', category: 'ایرانی',
      recipe: [], manualCost: 3182058,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 7300000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_4', code: '4', name: 'کباب بختیاری', category: 'ایرانی',
      recipe: [], manualCost: 2316692,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4900000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_5', code: '5', name: 'کباب وزیری', category: 'ایرانی',
      recipe: [], manualCost: 1760395,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4150000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_6', code: '6', name: 'کباب تبریزی', category: 'ایرانی',
      recipe: [], manualCost: 2119228,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4400000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_7', code: '7', name: 'کباب لقمه نگین دار', category: 'ایرانی',
      recipe: [], manualCost: 2025207,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4100000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_8', code: '8', name: 'کباب لقمه مخصوص', category: 'ایرانی',
      recipe: [], manualCost: 1893887,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 3900000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_9', code: '9', name: 'کباب کوبیده دو سیخ', category: 'ایرانی',
      recipe: [], manualCost: 2069463,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4200000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_10', code: '10', name: 'جوجه کباب مصری', category: 'ایرانی',
      recipe: [], manualCost: 1475420,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4200000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_11', code: '11', name: 'جوجه کباب ترش', category: 'ایرانی',
      recipe: [], manualCost: 1295389,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 2800000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_12', code: '12', name: 'جوجه کباب با استخوان', category: 'ایرانی',
      recipe: [], manualCost: 1811524,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4200000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_13', code: '13', name: 'جوجه کباب بی استخوان', category: 'ایرانی',
      recipe: [], manualCost: 1101139,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 2350000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_14', code: '14', name: 'ماهی قزل آلا کبابی', category: 'ایرانی',
      recipe: [], manualCost: 2161446,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_15', code: '15', name: 'ماهی قزل آلا سوخاری', category: 'ایرانی',
      recipe: [], manualCost: 2250337,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 4500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_16', code: '16', name: 'باقالی پلو با مرغ', category: 'ایرانی',
      recipe: [], manualCost: 1778935,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 3700000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_17', code: '17', name: 'زرشک پلو با مرغ', category: 'ایرانی',
      recipe: [], manualCost: 1760559,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_18', code: '18', name: 'چلو مرغ مخصوص', category: 'ایرانی',
      recipe: [], manualCost: 1747656,
      rawMaterialCost: 0, fixedOverhead: 151248, variableOverheadPercent: 0, totalCost: 0, salePrice: 3600000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_19', code: '19', name: 'چلو خورشت قیمه سیب زمینی', category: 'ایرانی',
      recipe: [], manualCost: 1982812,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_20', code: '20', name: 'چلو خورشت قیمه بادمجون', category: 'ایرانی',
      recipe: [], manualCost: 1885799,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_21', code: '21', name: 'چلو خورشت قورمه سبزی', category: 'ایرانی',
      recipe: [], manualCost: 1819806,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_22', code: '22', name: 'چلو خورشت فسنجان', category: 'ایرانی',
      recipe: [], manualCost: 2169379,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 4200000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_23', code: '23', name: 'مرصع پلو', category: 'ایرانی',
      recipe: [], manualCost: 2930150,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_24', code: '24', name: 'شیرین پلو', category: 'ایرانی',
      recipe: [], manualCost: 2623394,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 5000000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_25', code: '25', name: 'کباب دیگی مخصوص با کته', category: 'ایرانی',
      recipe: [], manualCost: 2304923,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 4400000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_26', code: '26', name: 'چلو اکبر جوجه', category: 'ایرانی',
      // رسپی دقیق فایل ورد (جمع: ۲،۸۱۸،۷۶۱ ریال)
      recipe: [
        { type: 'semi', id: 'semi_chelo', quantity: 0.18 }, // 692,922
        { type: 'raw', id: 'ing_chicken_small', quantity: 0.6 }, // 1,728,000
        { type: 'raw', id: 'ing_oil', quantity: 0.15 }, // 234,549
        { type: 'raw', id: 'ing_spices_general', quantity: 0.01 }, // 53,040
        { type: 'raw', id: 'ing_pomegranate_paste', quantity: 0.03 }, // 110,250
      ],
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 5300000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_27', code: '27', name: 'لوبیا پلو با گوشت', category: 'ایرانی',
      recipe: [], manualCost: 1493060,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 2700000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_28', code: '28', name: 'خورشت مرغ و بادمجون با کته', category: 'ایرانی',
      recipe: [], manualCost: 1975392,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 3600000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_29', code: '29', name: 'عدس پلو با گوشت', category: 'ایرانی',
      recipe: [], manualCost: 1943994,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_30', code: '30', name: 'ماکارونی ته دیگی', category: 'ایرانی',
      recipe: [], manualCost: 1105475,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 2500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_31', code: '31', name: 'باقالی پلو (پرس)', category: 'ایرانی',
      recipe: [{ type: 'semi', id: 'semi_baghali', quantity: 0.18 }],
      manualCost: 745218, // چون نیمه آماده ها تقریبی هستند برای دقت از دستی استفاده میکنیم
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 1600000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_32', code: '32', name: 'چلو کره', category: 'ایرانی',
      recipe: [{ type: 'semi', id: 'semi_chelo', quantity: 0.18 }],
      manualCost: 692921,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 1500000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_33', code: '33', name: 'کشک بادمجان', category: 'ایرانی',
      recipe: [], manualCost: 786319,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 1900000, profit: 0, profitMargin: 0
    },
    {
      id: 'ir_34', code: '34', name: 'میرزاقاسمی', category: 'ایرانی',
      recipe: [], manualCost: 926679,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 1900000, profit: 0, profitMargin: 0
    },

    // ================== منوی فرنگی (۴۰ مورد) ==================
    // تمامی آیتم‌های فرنگی طبق اکسل بهای تمام شده (ستون 4)
    {
      id: 'eu_1', code: '1', name: 'پیتزا پنجره ای رست بیف', category: 'فرنگی',
      recipe: [], manualCost: 5239605,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 8500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_2', code: '2', name: 'پیتزا پنجره ای چیکن آلفردو', category: 'فرنگی',
      recipe: [], manualCost: 2906378,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5800000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_3', code: '3', name: 'پیتزا پنجره ای مخلوط', category: 'فرنگی',
      recipe: [], manualCost: 2466891,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4950000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_4', code: '4', name: 'پیتزا پنجره ای پپرونی', category: 'فرنگی',
      recipe: [], manualCost: 2657991,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5400000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_5', code: '5', name: 'پیتزا پنجره ای سبزیجات', category: 'فرنگی',
      recipe: [], manualCost: 2301416,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4700000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_6', code: '6', name: 'پیتزا پاتیس رست بیف', category: 'فرنگی',
      recipe: [], manualCost: 3352279,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5100000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_7', code: '7', name: 'پیتزا پاتیس چیکن آلفردو', category: 'فرنگی',
      recipe: [], manualCost: 1952342,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_8', code: '8', name: 'پیتزا پاتیس مخلوط', category: 'فرنگی',
      recipe: [], manualCost: 1688650,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 2950000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_9', code: '9', name: 'پیتزا پاتیس پپرونی', category: 'فرنگی',
      recipe: [], manualCost: 1803310,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 3250000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_10', code: '10', name: 'پیتزا پاتیس سبزیجات', category: 'فرنگی',
      recipe: [], manualCost: 1589365,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 2850000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_11', code: '11', name: 'برگر کلاسیک', category: 'فرنگی',
      recipe: [], manualCost: 2313359,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_12', code: '12', name: 'دبل برگر', category: 'فرنگی',
      recipe: [], manualCost: 4824137,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 7900000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_13', code: '13', name: 'چیز برگر', category: 'فرنگی',
      recipe: [], manualCost: 2924459,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_14', code: '14', name: 'برگر هالو پینو', category: 'فرنگی',
      recipe: [], manualCost: 2488709,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4900000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_15', code: '15', name: 'زینگر برگر', category: 'فرنگی',
      recipe: [], manualCost: 1361040,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_16', code: '16', name: 'ماشروم برگر', category: 'فرنگی',
      recipe: [], manualCost: 3043752,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5800000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_17', code: '17', name: 'ساندویچ رست بیف', category: 'فرنگی',
      recipe: [], manualCost: 2854734,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_18', code: '18', name: 'ساندویچ مرغ و هالو پینو', category: 'فرنگی',
      recipe: [], manualCost: 1168780,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 2500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_19', code: '19', name: 'ساندویچ هات داگ', category: 'فرنگی',
      recipe: [], manualCost: 1001265,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 2300000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_20', code: '20', name: 'پاستا آلفردو', category: 'فرنگی',
      recipe: [], manualCost: 2131611,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_21', code: '21', name: 'پاستا پستو', category: 'فرنگی',
      recipe: [], manualCost: 2972387,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_22', code: '22', name: 'پاستا سبزیجات', category: 'فرنگی',
      recipe: [], manualCost: 1063139,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 3500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_23', code: '23', name: 'پنینی بیکن', category: 'فرنگی',
      recipe: [], manualCost: 2886787,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_24', code: '24', name: 'پنینی گوشت و خامه', category: 'فرنگی',
      recipe: [], manualCost: 4287676,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 7500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_25', code: '25', name: 'پنینی مرغ و خامه', category: 'فرنگی',
      recipe: [], manualCost: 2659016,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_26', code: '26', name: 'پنینی مرغ پستو', category: 'فرنگی',
      recipe: [], manualCost: 2669770,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_27', code: '27', name: 'پنینی سبزیجات', category: 'فرنگی',
      recipe: [], manualCost: 1719165,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 3900000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_28', code: '28', name: 'بشقاب سوخاری', category: 'فرنگی',
      recipe: [], manualCost: 2301798,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4700000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_29', code: '29', name: 'استیک مرغ', category: 'فرنگی',
      recipe: [], manualCost: 2321457,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 5500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_30', code: '30', name: 'تست گوشت', category: 'فرنگی',
      recipe: [], manualCost: 1513680,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 3100000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_31', code: '31', name: 'تست مرغ', category: 'فرنگی',
      recipe: [], manualCost: 882993,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 1900000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_32', code: '32', name: 'تست بیکن', category: 'فرنگی',
      recipe: [], manualCost: 1012651,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 2100000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_33', code: '33', name: 'تست پپرونی', category: 'فرنگی',
      recipe: [], manualCost: 813151,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 1900000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_34', code: '34', name: 'سیب زمینی مخصوص', category: 'فرنگی',
      recipe: [], manualCost: 1928289,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 4100000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_35', code: '35', name: 'سیب زمینی چدار', category: 'فرنگی',
      recipe: [], manualCost: 1151289,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 2800000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_36', code: '36', name: 'سیب زمینی آلفردو', category: 'فرنگی',
      recipe: [], manualCost: 1498888,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 3100000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_37', code: '37', name: 'سیب زمینی ساده', category: 'فرنگی',
      recipe: [], manualCost: 521289,
      rawMaterialCost: 0, fixedOverhead: 257250, variableOverheadPercent: 0, totalCost: 0, salePrice: 1600000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_38', code: '38', name: 'سالاد مخصوص اورین', category: 'فرنگی',
      recipe: [], manualCost: 3759628,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 6500000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_39', code: '39', name: 'سالاد سزار', category: 'فرنگی',
      recipe: [], manualCost: 2252542,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 3900000, profit: 0, profitMargin: 0
    },
    {
      id: 'eu_40', code: '40', name: 'سالاد یونانی', category: 'فرنگی',
      recipe: [], manualCost: 2425836,
      rawMaterialCost: 0, fixedOverhead: 0, variableOverheadPercent: 0, totalCost: 0, salePrice: 0, profit: 0, profitMargin: 0
    },
  ]);

  const processedMenu = useMemo(() => {
    return menuItems.map(item => {
      let rawCost = 0;

      // اگر مقدار دستی وارد شده باشد (اولویت با عدد دستی اکسل برای دقت ۱۰۰٪)
      if (item.manualCost) {
         rawCost = item.manualCost;
      } 
      // اگر دستی نباشد، از روی رسپی محاسبه کن (مثل باقالی پلو با ماهیچه)
      else if (item.recipe.length > 0) {
        item.recipe.forEach(rec => {
          if (rec.type === 'raw') {
            const ing = processedIngredients.find(i => i.id === rec.id);
            if (ing) rawCost += ing.finalPricePerUnit * rec.quantity;
          } else if (rec.type === 'semi') {
            const semi = semiFinished.find(s => s.id === rec.id);
            if (semi) rawCost += semi.costPerUnit * rec.quantity;
          }
        });
      }

      const totalCost = rawCost + item.fixedOverhead;
      
      const profit = item.salePrice - totalCost;
      const margin = item.salePrice > 0 ? (profit / item.salePrice) * 100 : 0;

      return {
        ...item,
        rawMaterialCost: Math.round(rawCost),
        totalCost: Math.round(totalCost),
        profit: Math.round(profit),
        profitMargin: margin
      };
    });
  }, [menuItems, processedIngredients, semiFinished]);

  const updateIngredientPrice = (id: string, newPrice: number) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, basePrice: newPrice, finalPricePerUnit: newPrice } : i));
  };

  const updateIngredientWaste = (id: string, newWaste: number) => {
     // در این نسخه چون قیمت نهایی وارد شده، تغییر پرت فقط نمایشی است یا باید لاجیک را تغییر داد.
     // فعلا فقط ذخیره می کنیم
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, wastePercentage: newWaste } : i));
  };

  return {
    ingredients: processedIngredients,
    semiFinished,
    menu: processedMenu,
    updateIngredientPrice,
    updateIngredientWaste
  };
};
