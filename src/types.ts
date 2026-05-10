// src/types.ts

// Daftar Kriteria Paten
export const KRITERIA = ["Harga", "Kebersihan", "Fasilitas", "Varian Menu", "Pelayanan"];

// Tabel Random Index (RI) untuk hitung Konsistensi
export const RI_TABLE = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

// Tipe Data Utama Kantin
export type TKantinMatrix = {
  id: string;
  nama: string;
  harga: number;
  kebersihan: number;
  fasilitas: number;
  varian_menu: number;
  pelayanan: number;
  skorAkhir?: number; // Opsional, diisi setelah kalkulasi
  peringkat?: number; // Opsional, diisi setelah kalkulasi
};