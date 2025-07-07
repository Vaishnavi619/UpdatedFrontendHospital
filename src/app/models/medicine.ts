export interface Medicine {
  medicineId: number;
  name: string;
  description: string;
  price: number;
  quantityLeft: number; // ✅ Add this line
}
