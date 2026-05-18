// src/utils/ahpCalc.ts
import { KRITERIA, type TKantinMatrix, RI_TABLE } from "../types";

export function hitungAHP(dataKantin: TKantinMatrix[], matrixKriteria: number[][]) {
  const n = KRITERIA.length;
  
  // 1. Hitung Bobot dan CR Kriteria TERLEBIH DAHULU (Terlepas dari ada data kantin atau tidak)
  const colSums = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) colSums[j] += matrixKriteria[i][j];
  }
  
  const normalizedMatrix = matrixKriteria.map(row => row.map((val, j) => val / colSums[j]));
  const bobotKriteria = normalizedMatrix.map(row => row.reduce((sum, val) => sum + val, 0) / n);

  let lambdaMax = 0;
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) rowSum += matrixKriteria[i][j] * bobotKriteria[j];
    lambdaMax += rowSum / bobotKriteria[i];
  }
  lambdaMax = lambdaMax / n;
  
  const ci = (lambdaMax - n) / (n - 1);
  const crKriteria = ci / (RI_TABLE[n - 1] || 1.49);

  // 2. Jika data kantin kosong, kembalikan hasil crKriteria yang sudah dihitung, dengan ranking kosong
  if (dataKantin.length === 0) return { hasilRanking: [], crKriteria, bobotKriteria };

  // 3. Jika data kantin ADA, barulah lanjut menghitung skor akhir (AHP Absolute)
  const total = { harga: 0, kebersihan: 0, fasilitas: 0, varian_menu: 0, pelayanan: 0 };
  dataKantin.forEach(k => {
    total.harga += k.harga; 
    total.kebersihan += k.kebersihan; 
    total.fasilitas += k.fasilitas;
    total.varian_menu += k.varian_menu; 
    total.pelayanan += k.pelayanan;
  });

  const calculatedData = dataKantin.map(k => {
    const skorAkhir = 
      ((total.harga === 0 ? 0 : k.harga / total.harga) * bobotKriteria[0]) +
      ((total.kebersihan === 0 ? 0 : k.kebersihan / total.kebersihan) * bobotKriteria[1]) +
      ((total.fasilitas === 0 ? 0 : k.fasilitas / total.fasilitas) * bobotKriteria[2]) +
      ((total.varian_menu === 0 ? 0 : k.varian_menu / total.varian_menu) * bobotKriteria[3]) +
      ((total.pelayanan === 0 ? 0 : k.pelayanan / total.pelayanan) * bobotKriteria[4]);
      console.log(k)
    return { ...k, skorAkhir };
  });

  const hasilRanking = calculatedData
    .sort((a, b) => (b.skorAkhir || 0) - (a.skorAkhir || 0))
    .map((k, index) => ({ ...k, peringkat: index + 1 }));

  return { hasilRanking, crKriteria, bobotKriteria };
}