// src/AhpDashboard.tsx
import { Component } from "react";
import { Trophy, Download } from "lucide-react";
import { KRITERIA, type TKantinMatrix, type AhpDashboardState } from "./types";
import { hitungAHP } from "./utils/ahpCalc";
import { exportRankingCSV } from "./utils/csvHelper";
import InputKantin from "./components/InputKantin";
import MatrixKriteria from "./components/MatrixKriteria";

interface State {
  dataKantin: TKantinMatrix[];
  matrixKriteria: number[][];
  hasilRanking: TKantinMatrix[];
  crKriteria: number;
}

export default class App extends Component<object, AhpDashboardState> {
  constructor(props: object) {
    super(props);
    const n = KRITERIA.length;
    const savedKantin = localStorage.getItem("dataKantin");
    const savedMatrix = localStorage.getItem("matrixKriteria");
    const savedRanking = sessionStorage.getItem("hasilRanking");

    this.state = {
      dataKantin: savedKantin ? JSON.parse(savedKantin) : [],
      matrixKriteria: savedMatrix ? JSON.parse(savedMatrix) : Array(n).fill(null).map(() => Array(n).fill(1)),
      hasilRanking: savedRanking ? JSON.parse(savedRanking) : [],
      crKriteria: 0
    };
  }

  componentDidUpdate(_prevProps: object, prevState: State) {
    
    if (prevState.dataKantin !== this.state.dataKantin || prevState.matrixKriteria !== this.state.matrixKriteria) {
      const hasil = hitungAHP(this.state.dataKantin, this.state.matrixKriteria);
      this.setState({ hasilRanking: hasil.hasilRanking, crKriteria: hasil.crKriteria }, () => {
        localStorage.setItem("dataKantin", JSON.stringify(this.state.dataKantin));
        localStorage.setItem("matrixKriteria", JSON.stringify(this.state.matrixKriteria));
        sessionStorage.setItem("hasilRanking", JSON.stringify(this.state.hasilRanking));
      });
    }
  }

  componentDidMount() {
    const hasil = hitungAHP(this.state.dataKantin, this.state.matrixKriteria);
    this.setState({ crKriteria: hasil.crKriteria });
  }

  handleAddKantin = () => {
    const kantinBaru: TKantinMatrix = {
      id: Date.now().toString(), nama: `Kantin ${this.state.dataKantin.length + 1}`,
      harga: 1, kebersihan: 1, fasilitas: 1, varian_menu: 1, pelayanan: 1,
    };
    this.setState({ dataKantin: [...this.state.dataKantin, kantinBaru] });
  };

  handleDeleteKantin = (id: string) => {
    this.setState({ dataKantin: this.state.dataKantin.filter(k => k.id !== id) });
  };

  handleDeleteAllKantin = () => {
    if (window.confirm("Apakah kamu yakin ingin menghapus semua data Kantin?")) {
      this.setState({ dataKantin: [] });
    }
  };

  handleUpdateKantin = (id: string, field: keyof TKantinMatrix, newVal: string | number) => {
    const parsedVal = field === "nama" ? String(newVal) : Number(newVal);
    this.setState({ dataKantin: this.state.dataKantin.map(k => k.id === id ? { ...k, [field]: parsedVal } : k) });
  };

  handleImportKantin = (newData: TKantinMatrix[]) => { this.setState({ dataKantin: newData }); };

  handleMatrixChange = (row: number, col: number, value: string) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue) || numValue === 0) numValue = 1;
    const newMatrix = [...this.state.matrixKriteria];
    newMatrix[row] = [...this.state.matrixKriteria[row]];
    newMatrix[col] = [...this.state.matrixKriteria[col]];
    newMatrix[row][col] = numValue;
    newMatrix[col][row] = 1 / numValue;
    this.setState({ matrixKriteria: newMatrix });
  };

  handleResetMatrix = () => {
    if (window.confirm("Apakah kamu yakin ingin mereset semua nilai matriks ke angka 1?")) {
      const n = KRITERIA.length;
      const resetMatrix = Array(n).fill(null).map(() => Array(n).fill(1));
      this.setState({ matrixKriteria: resetMatrix });
    }
  };

  render() {
    const { dataKantin, matrixKriteria, hasilRanking, crKriteria } = this.state;

    return (
      <div className="min-h-screen py-6 md:py-10 px-3 sm:px-6 md:px-10 font-sans">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">Sistem Pendukung Keputusan</h1>
            <p className="text-lg sm:text-xl text-gray-600 mt-3 font-medium">Pemilihan Kantin Terbaik - Metode AHP</p>
          </div>

          <InputKantin
            dataKantin={dataKantin}
            onAdd={this.handleAddKantin}
            onDelete={this.handleDeleteKantin}
            onDeleteAll={this.handleDeleteAllKantin} 
            onUpdate={this.handleUpdateKantin}
            onImport={this.handleImportKantin}
          />
          <MatrixKriteria
            matrixKriteria={matrixKriteria}
            crKriteria={crKriteria}
            onMatrixChange={this.handleMatrixChange}
            onResetMatrix={this.handleResetMatrix} 
          />

          {/* TABEL HASIL RANKING PRESISI */}
          <div className="bg-gray-100 p-4 sm:p-6 md:p-10 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Trophy size={32} className="text-yellow-500" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Tahap 3: Hasil Ranking (Live)</h1>
              </div>
              <button onClick={() => exportRankingCSV(hasilRanking)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all w-full sm:w-auto justify-center">
                <Download size={18} /> Export Ranking
              </button>
            </div>

            <div className="p-4 md:p-8 border border-gray-300 rounded-xl shadow-md bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-125 table-fixed border-separate border-spacing-2 text-sm md:text-base">
                  <thead>
                    <tr>
                      <th className="bg-gray-300 rounded-lg p-3 text-center w-24 font-bold text-gray-800">Peringkat</th>
                      <th className="bg-gray-300 rounded-lg p-3 text-center font-bold text-gray-800">Nama Kantin</th>
                      <th className="bg-gray-300 rounded-lg p-3 text-center w-40 font-bold text-gray-800">Skor Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hasilRanking.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          Belum menampilkan data.
                        </td>
                      </tr>
                    ) : (
                      hasilRanking.map((kantin, index) => (
                        <tr key={kantin.id}>
                          <td className={`font-bold text-center rounded-lg p-3 text-lg ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            #{kantin.peringkat}
                          </td>
                          <td className="bg-white border border-gray-300 rounded-lg font-semibold text-gray-800 px-6 py-3 text-lg text-center">
                            {kantin.nama}
                          </td>
                          <td className="bg-white border border-gray-300 rounded-lg text-center font-black text-blue-600 text-xl py-3">
                            {(kantin.skorAkhir! * 100).toFixed(2)} %
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}