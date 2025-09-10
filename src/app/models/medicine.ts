export interface Medicine {
  medicineId: number;
  name: string;
  price: number;
  manufacturerName: string;
  type: string;
  packSizeLabel: string;
  shortComposition1: string;
  shortComposition2: string;
  discontinued: boolean;   // ✅ changed from isDiscontinued → discontinued
}
