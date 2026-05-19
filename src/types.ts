// src/types.ts

// 1. Konstanta Paten
export const KRITERIA = ["Harga", "Kebersihan", "Fasilitas", "Varian Menu", "Pelayanan"];
export const RI_TABLE = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

// 2. Tipe Data Utama Kantin
export type TKantinMatrix = {
  id: string;
  nama: string;
  harga: number;
  kebersihan: number;
  fasilitas: number;
  varian_menu: number;
  pelayanan: number;
  skorAkhir?: number; 
  peringkat?: number; 
};

// 3. Tipe State untuk AhpDashboard
export interface AhpDashboardState {
  dataKantin: TKantinMatrix[];
  matrixKriteria: number[][];
  hasilRanking: TKantinMatrix[];
  crKriteria: number;
  bobotKriteria: number[];
}

// 4. Tipe Props untuk InputKantin
export interface InputKantinProps {
  dataKantin: TKantinMatrix[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onUpdate: (id: string, field: keyof TKantinMatrix, val: string | number) => void;
  onImport: (newData: TKantinMatrix[]) => void;
}

// 5. Tipe Props untuk MatrixKriteria
export interface MatrixKriteriaProps {
  matrixKriteria: number[][];
  crKriteria: number;
  onMatrixChange: (row: number, col: number, value: string) => void;
  onResetMatrix: () => void;
}