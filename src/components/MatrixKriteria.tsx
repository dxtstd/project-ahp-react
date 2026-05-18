// src/components/MatrixKriteria.tsx
import { Component } from "react";
import { RotateCcw } from "lucide-react"; // <-- Import icon
import { KRITERIA, type MatrixKriteriaProps } from "../types"; 

export default class MatrixKriteria extends Component<MatrixKriteriaProps> {
  render() {
    // Ambil onResetMatrix dari props
    const { matrixKriteria, crKriteria, onMatrixChange, onResetMatrix } = this.props;
    
    return (
      <div className="bg-gray-100 p-4 sm:p-6 md:p-10 rounded-xl mb-8 shadow-sm border border-gray-200">
        
        {/* BAGIAN HEADER (JUDUL & TOMBOL) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">cMatriks Kriteria (1-9)</h1>
          
          {/* GRUP TOMBOL & STATUS CR */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={onResetMatrix} 
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
            >
              <RotateCcw size={18} /> Reset
            </button>
            <div className={`px-4 py-2 rounded-lg font-bold border-2 w-full md:w-auto text-center ${crKriteria <= 0.1 ? 'border-green-400 bg-green-100 text-green-700' : 'border-red-400 bg-red-100 text-red-700'}`}>
              CR: {crKriteria.toFixed(3)} {crKriteria <= 0.1 ? '(Aman)' : '(Perbaiki!)'}
            </div>
          </div>
        </div>

        {/* LEGENDA SKALA AHP */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
          <h3 className="font-bold mb-3 text-gray-900">Legenda Skala Kepentingan (Skala Saaty):</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            <li><span className="font-bold text-blue-600">1</span> = Sama penting</li>
            <li><span className="font-bold text-blue-600">3</span> = Sedikit lebih penting</li>
            <li><span className="font-bold text-blue-600">5</span> = Jelas lebih penting</li>
            <li><span className="font-bold text-blue-600">7</span> = Sangat lebih penting</li>
            <li><span className="font-bold text-blue-600">9</span> = Mutlak lebih penting</li>
            <li><span className="font-bold text-blue-600">2, 4, 6, 8</span> = Nilai tengah (kompromi)</li>
          </ul>
        </div>
        {/* AKHIR LEGENDA */}
        
        {/* TABEL MATRIKS (Tetap Sama) */}
        <div className="p-4 sm:p-6 md:p-8 border border-gray-300 rounded-xl shadow-md bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 table-fixed border-separate border-spacing-2 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="bg-gray-300 rounded-lg p-3 text-center w-32 font-bold text-gray-800">Kriteria</th>
                  {KRITERIA.map(k => <th key={k} className="bg-gray-300 rounded-lg p-3 text-center w-24 font-bold text-gray-800">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {KRITERIA.map((rowName, i) => (
                  <tr key={rowName}>
                    <td className="bg-gray-200 rounded-lg font-bold p-3 text-gray-800 text-center">{rowName}</td>
                    {KRITERIA.map((colName, j) => {
                      const isDiagonal = i === j;
                      const val = matrixKriteria[i][j];
                      return (
                        <td key={colName} className="p-0">
                          <input
                            type="number" step="any" min="0.1" max="9" disabled={isDiagonal}
                            value={Number.isInteger(val) ? val : val.toFixed(2)}
                            onChange={(e) => onMatrixChange(i, j, e.target.value)}
                            className={`w-full p-2.5 text-center outline-none rounded-lg border focus:ring-2 focus:ring-blue-400 transition-all font-semibold ${isDiagonal ? "bg-gray-100 border-transparent cursor-not-allowed text-gray-400" : "bg-white border-gray-300 text-blue-700 shadow-sm hover:border-blue-400"}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}