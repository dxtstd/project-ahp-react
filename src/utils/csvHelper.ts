import { type TKantinMatrix } from "../types";

export const exportKantinCSV = (data: TKantinMatrix[]) => {
  if (data.length === 0) return alert("Belum menampilkan data untuk diexport.");
  const headers = ["Nama", "Harga", "Kebersihan", "Fasilitas", "Varian Menu", "Pelayanan"];
  const rows = data.map(k => [k.nama, k.harga, k.kebersihan, k.fasilitas, k.varian_menu, k.pelayanan]);
  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadCSV(csvContent, "Data_Kantin_AHP.csv");
};

export const exportRankingCSV = (data: TKantinMatrix[]) => {
  if (data.length === 0) return alert("Belum menampilkan data ranking.");
  const headers = ["Peringkat", "Nama Kantin", "Skor Akhir"];
  const rows = data.map(k => [k.peringkat, k.nama, (k.skorAkhir! * 100).toFixed(2) + "%"]);
  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadCSV(csvContent, "Hasil_Ranking_Kantin.csv");
};

export const importKantinCSV = (file: File, callback: (data: TKantinMatrix[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const lines = text.split("\n").filter(line => line.trim() !== "");
    if (lines.length <= 1) return alert("File CSV kosong atau format salah.");

    const newData: TKantinMatrix[] = lines.slice(1).map((line, index) => {
      const cols = line.split(",");
      return {
        id: Date.now().toString() + index,
        nama: cols[0] || `Kantin ${index + 1}`,
        harga: Number(cols[1]) || 1, kebersihan: Number(cols[2]) || 1,
        fasilitas: Number(cols[3]) || 1, varian_menu: Number(cols[4]) || 1, pelayanan: Number(cols[5]) || 1,
      };
    });
    callback(newData);
  };
  reader.readAsText(file);
};

const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};