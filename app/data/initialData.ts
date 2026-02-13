 
// app/data/initialData.ts

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  category: 'protein' | 'vegetable' | 'dairy' | 'dry' | 'packaging' | 'other';
}

export interface SemiFinished {
  id: string;
  name: string;
  unit: string;
  recipe: { ingredientId: string; quantity: number }[];
  // قیمت این آیتم به صورت پویا بر اساس مواد اولیه محاسبه می‌شود
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'iranian' | 'foreign';
  recipe: { ingredientId: string; type: 'raw' | 'semi'; quantity: number }[];
  dorchinCost: number; // هزینه دورچین ثابت طبق اکسل
  overheadPercent: number; // سربار طبق اکسل (مثلا 50 درصد)
  currentSalesPrice: number; // قیمت فروش فعلی
}

// --- 1. مواد اولیه (Raw Materials) ---
// قیمت‌ها بر اساس فایل "شیت های مواد اولیه" استخراج شده‌اند
export const initialRawMaterials: Ingredient[] = [
  // پروتئین
  { id: 'm-1', name: 'ماهیچه گوسفندی', unit: 'kg', pricePerUnit: 17172000, category: 'protein' },
  { id: 'm-2', name: 'ران مرغ', unit: 'kg', pricePerUnit: 2040000, category: 'protein' }, // قیمت‌ها نرمال‌سازی شده به ریال
  { id: 'm-3', name: 'فیله گوساله', unit: 'kg', pricePerUnit: 15219670, category: 'protein' },
  { id: 'm-4', name: 'سینه مرغ', unit: 'kg', pricePerUnit: 4370000, category: 'protein' },
  { id: 'm-5', name: 'ماهی قزل‌آلا', unit: 'kg', pricePerUnit: 4672500, category: 'protein' },
  { id: 'm-6', name: 'گوشت چرخ‌کرده (مخلوط)', unit: 'kg', pricePerUnit: 8778000, category: 'protein' },
  
  // سبزیجات و صیفی‌جات
  { id: 'v-1', name: 'پیاز', unit: 'kg', pricePerUnit: 427900, category: 'vegetable' },
  { id: 'v-2', name: 'سیب زمینی', unit: 'kg', pricePerUnit: 200000, category: 'vegetable' },
  { id: 'v-3', name: 'گوجه فرنگی', unit: 'kg', pricePerUnit: 570000, category: 'vegetable' },
  { id: 'v-4', name: 'فلفل دلمه', unit: 'kg', pricePerUnit: 877000, category: 'vegetable' },
  { id: 'v-5', name: 'قارچ', unit: 'kg', pricePerUnit: 2100000, category: 'vegetable' },
  { id: 'v-6', name: 'سیر', unit: 'kg', pricePerUnit: 3150000, category: 'vegetable' },
  { id: 'v-7', name: 'کاهو', unit: 'kg', pricePerUnit: 350000, category: 'vegetable' },
  { id: 'v-8', name: 'ریحون/سبزی', unit: 'kg', pricePerUnit: 1200000, category: 'vegetable' },

  // لبنیات
  { id: 'd-1', name: 'پنیر پیتزا', unit: 'kg', pricePerUnit: 3500000, category: 'dairy' },
  { id: 'd-2', name: 'پنیر پارمزان', unit: 'kg', pricePerUnit: 21000000, category: 'dairy' },
  { id: 'd-3', name: 'کره گیاهی', unit: 'number', pricePerUnit: 72930, category: 'dairy' },
  { id: 'd-4', name: 'خامه', unit: 'kg', pricePerUnit: 2800000, category: 'dairy' },

  // خشکبار و ادویه
  { id: 'dry-1', name: 'برنج ایرانی', unit: 'kg', pricePerUnit: 1450000, category: 'dry' },
  { id: 'dry-2', name: 'روغن مایع', unit: 'kg', pricePerUnit: 1560000, category: 'dry' },
  { id: 'dry-3', name: 'رب گوجه', unit: 'kg', pricePerUnit: 1365000, category: 'dry' },
  { id: 'dry-4', name: 'نمک', unit: 'kg', pricePerUnit: 120200, category: 'dry' },
  { id: 'dry-5', name: 'فلفل سیاه/قرمز', unit: 'kg', pricePerUnit: 3500000, category: 'dry' },
  { id: 'dry-6', name: 'زردچوبه', unit: 'kg', pricePerUnit: 4080000, category: 'dry' },
  { id: 'dry-7', name: 'زعفران', unit: 'mesghal', pricePerUnit: 4500000, category: 'dry' },
  { id: 'dry-8', name: 'پاستا پنه', unit: 'kg', pricePerUnit: 750000, category: 'dry' },
  { id: 'dry-9', name: 'آرد', unit: 'kg', pricePerUnit: 440000, category: 'dry' },

  // بسته‌بندی و سایر
  { id: 'p-1', name: 'ظرف آلومینیوم', unit: 'number', pricePerUnit: 45000, category: 'packaging' },
  { id: 'p-2', name: 'جعبه پیتزا', unit: 'number', pricePerUnit: 85000, category: 'packaging' },
];

// --- 2. مواد نیمه‌آماده (Semi-Finished) ---
// موادی که در رستوران ساخته می‌شوند و در غذاهای دیگر استفاده می‌شوند
export const initialSemiFinished: SemiFinished[] = [
  {
    id: 'semi-1',
    name: 'مایه کباب کوبیده',
    unit: 'kg',
    recipe: [
      { ingredientId: 'm-6', quantity: 0.8 }, // 800 گرم گوشت
      { ingredientId: 'v-1', quantity: 0.2 }, // 200 گرم پیاز
      { ingredientId: 'dry-4', quantity: 0.01 }, // نمک
      { ingredientId: 'dry-5', quantity: 0.005 }, // فلفل
    ]
  },
  {
    id: 'semi-2',
    name: 'سس آلفردو (پایه)',
    unit: 'kg',
    recipe: [
      { ingredientId: 'd-4', quantity: 0.7 }, // خامه
      { ingredientId: 'd-2', quantity: 0.1 }, // پنیر
      { ingredientId: 'v-6', quantity: 0.05 }, // سیر
      { ingredientId: 'dry-4', quantity: 0.01 },
    ]
  },
  {
    id: 'semi-3',
    name: 'برنج آبکش شده (پایه)',
    unit: 'kg',
    recipe: [
      { ingredientId: 'dry-1', quantity: 1 }, // 1 کیلو برنج خشک
      { ingredientId: 'dry-2', quantity: 0.05 }, // روغن
      { ingredientId: 'dry-4', quantity: 0.02 }, // نمک
    ]
  },
  {
    id: 'semi-4',
    name: 'خمیر پیتزا',
    unit: 'kg',
    recipe: [
      { ingredientId: 'dry-9', quantity: 1 },
      { ingredientId: 'dry-2', quantity: 0.1 },
      { ingredientId: 'd-3', quantity: 0.05 }, // مخمر و ...
    ]
  }
];

// --- 3. منوی غذاها (Menu Items) ---
export const initialMenu: MenuItem[] = [
  // --- ایرانی ---
  {
    id: 'menu-ir-1',
    name: 'باقالی پلو با ماهیچه',
    category: 'iranian',
    dorchinCost: 151248, // طبق اکسل
    overheadPercent: 50,
    currentSalesPrice: 13000000,
    recipe: [
      { ingredientId: 'm-1', type: 'raw', quantity: 0.45 }, // 450 گرم ماهیچه
      { ingredientId: 'semi-3', type: 'semi', quantity: 0.35 }, // برنج آماده
      { ingredientId: 'dry-2', type: 'raw', quantity: 0.025 }, // روغن اضافه
      { ingredientId: 'dry-7', type: 'raw', quantity: 0.001 }, // زعفران
    ]
  },
  {
    id: 'menu-ir-2',
    name: 'کباب سلطانی',
    category: 'iranian',
    dorchinCost: 151248,
    overheadPercent: 50,
    currentSalesPrice: 8900000,
    recipe: [
      { ingredientId: 'm-3', type: 'raw', quantity: 0.2 }, // فیله (برگ)
      { ingredientId: 'semi-1', type: 'semi', quantity: 0.11 }, // کوبیده
      { ingredientId: 'v-3', type: 'raw', quantity: 0.07 }, // گوجه
      { ingredientId: 'd-3', type: 'raw', quantity: 1 }, // کره گیاهی
    ]
  },
  {
    id: 'menu-ir-3',
    name: 'زرشک پلو با مرغ',
    category: 'iranian',
    dorchinCost: 151248,
    overheadPercent: 50,
    currentSalesPrice: 3500000,
    recipe: [
      { ingredientId: 'm-2', type: 'raw', quantity: 0.4 }, // ران مرغ
      { ingredientId: 'semi-3', type: 'semi', quantity: 0.35 }, // برنج
      { ingredientId: 'dry-3', type: 'raw', quantity: 0.01 }, // رب
      { ingredientId: 'v-1', type: 'raw', quantity: 0.015 }, // پیاز
    ]
  },

  // --- فرنگی ---
  {
    id: 'menu-fr-1',
    name: 'پیتزا پنجره ای رست بیف',
    category: 'foreign',
    dorchinCost: 257250, // سس و جعبه
    overheadPercent: 50,
    currentSalesPrice: 8500000,
    recipe: [
      { ingredientId: 'semi-4', type: 'semi', quantity: 0.2 }, // خمیر
      { ingredientId: 'm-3', type: 'raw', quantity: 0.15 }, // گوشت رست بیف
      { ingredientId: 'd-1', type: 'raw', quantity: 0.18 }, // پنیر
      { ingredientId: 'v-5', type: 'raw', quantity: 0.05 }, // قارچ
    ]
  },
  {
    id: 'menu-fr-2',
    name: 'پاستا چیکن آلفردو',
    category: 'foreign',
    dorchinCost: 257250,
    overheadPercent: 50,
    currentSalesPrice: 4500000,
    recipe: [
      { ingredientId: 'dry-8', type: 'raw', quantity: 0.15 }, // پنه خشک
      { ingredientId: 'semi-2', type: 'semi', quantity: 0.25 }, // سس آلفردو
      { ingredientId: 'm-4', type: 'raw', quantity: 0.15 }, // سینه مرغ
      { ingredientId: 'v-5', type: 'raw', quantity: 0.1 }, // قارچ
    ]
  },
  {
    id: 'menu-fr-3',
    name: 'برگر کلاسیک',
    category: 'foreign',
    dorchinCost: 257250,
    overheadPercent: 50,
    currentSalesPrice: 4500000,
    recipe: [
      { ingredientId: 'm-6', type: 'raw', quantity: 0.16 }, // گوشت برگر
      { ingredientId: 'p-1', type: 'raw', quantity: 1 }, // نان (فرض شده در مواد)
      { ingredientId: 'v-7', type: 'raw', quantity: 0.02 }, // کاهو
      { ingredientId: 'v-3', type: 'raw', quantity: 0.03 }, // گوجه
    ]
  }
];
