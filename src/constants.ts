export interface FoodItem {
  name: string;
  amount: string;
  carbs: number;
  exchanges: number;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: FoodItem[];
}

export const CARB_EXCHANGE_DATA: FoodCategory[] = [
  {
    id: "starches",
    name: "Kanji & Bijirin",
    icon: "Wheat",
    description: "1 pertukaran = 15g karbohidrat. Termasuk roti, bijirin, dan sayur-sayuran berkanji.",
    items: [
      { name: "Roti (putih/gandum penuh)", amount: "1 keping (1 oz)", carbs: 15, exchanges: 1 },
      { name: "Bijirin Masak/Oat", amount: "1/2 cawan", carbs: 15, exchanges: 1 },
      { name: "Nasi (putih/perang, masak)", amount: "1/3 cawan", carbs: 15, exchanges: 1 },
      { name: "Pasta (masak)", amount: "1/3 cawan", carbs: 15, exchanges: 1 },
      { name: "Jagung", amount: "1/2 cawan", carbs: 15, exchanges: 1 },
      { name: "Kentang (bakar dengan kulit)", amount: "1 kecil (3 oz)", carbs: 15, exchanges: 1 },
      { name: "Kacang Pis (hijau)", amount: "1/2 cawan", carbs: 15, exchanges: 1 },
    ],
  },
  {
    id: "fruits",
    name: "Buah-buahan",
    icon: "Apple",
    description: "1 pertukaran = 15g karbohidrat. Termasuk buah-buahan segar, sejuk beku, tin, dan kering.",
    items: [
      { name: "Epal", amount: "1 kecil (4 oz)", carbs: 15, exchanges: 1 },
      { name: "Pisang", amount: "1 sangat kecil", carbs: 15, exchanges: 1 },
      { name: "Beri Biru", amount: "3/4 cawan", carbs: 15, exchanges: 1 },
      { name: "Grepfrut", amount: "1/2 besar", carbs: 15, exchanges: 1 },
      { name: "Oren", amount: "1 kecil", carbs: 15, exchanges: 1 },
      { name: "Pic", amount: "1 sederhana", carbs: 15, exchanges: 1 },
      { name: "Kismis", amount: "2 sudu besar", carbs: 15, exchanges: 1 },
    ],
  },
  {
    id: "milk",
    name: "Susu & Yogurt",
    icon: "Milk",
    description: "1 pertukaran = 12-15g karbohidrat. Berbeza mengikut kandungan lemak.",
    items: [
      { name: "Susu (Skim, 1%, 2%, Penuh)", amount: "1 cawan (8 oz)", carbs: 12, exchanges: 1 },
      { name: "Yogurt (Kosong)", amount: "2/3 cawan (6 oz)", carbs: 12, exchanges: 1 },
      { name: "Susu Soya (Kosong)", amount: "1 cawan", carbs: 12, exchanges: 1 },
    ],
  },
  {
    id: "vegetables",
    name: "Sayur Bukan Berkanji",
    icon: "LeafyGreen",
    description: "1 pertukaran = 5g karbohidrat. Secara amnya 1/2 cawan masak atau 1 cawan mentah.",
    items: [
      { name: "Brokoli", amount: "1/2 cawan masak", carbs: 5, exchanges: 0.33 },
      { name: "Lobak Merah", amount: "1/2 cawan masak", carbs: 5, exchanges: 0.33 },
      { name: "Bayam", amount: "1 cawan mentah", carbs: 5, exchanges: 0.33 },
      { name: "Tomato", amount: "1/2 cawan masak", carbs: 5, exchanges: 0.33 },
    ],
  },
];
