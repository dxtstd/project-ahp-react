import { Component, type ChangeEvent } from "react";
import { Trash, Plus, Download, Upload } from "lucide-react";
import { type InputKantinProps } from "../types"; 
import EditableCell from "./EditableCell";
import { exportKantinCSV, importKantinCSV } from "../utils/csvHelper";

export default class InputKantin extends Component<InputKantinProps> {
  handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) importKantinCSV(e.target.files[0], this.props.onImport);
    e.target.value = ""; 
  };

  render() {
    const { dataKantin, onAdd, onDelete, onDeleteAll, onUpdate } = this.props;
    
    return (
      <div className="bg-gray-100 p-4 sm:p-6 md:p-10 rounded-xl mb-8 shadow-sm border border-gray-200">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-900">Input Data Kantin (1-9)</h1>
        <div className="p-4 sm:p-6 md:p-8 border border-gray-300 rounded-xl shadow-md bg-white">
          <div className="overflow-x-auto w-full mb-6">
            <table className="w-full min-w-225 table-fixed border-separate border-spacing-2 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-12 font-bold">No</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-48 font-bold">Nama Kantin</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-24 font-bold">Harga</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-24 font-bold">Kebersihan</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-24 font-bold">Fasilitas</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-24 font-bold">Menu</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-24 font-bold">Pelayanan</th>
                  <th className="bg-gray-300 text-gray-800 p-3 rounded-lg text-center w-16 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataKantin.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      Belum menampilkan data. Klik "Add" atau "Import CSV".
                    </td>
                  </tr>
                ) : (
                  dataKantin.map((k, i) => (
                    <tr key={k.id} className="group">
                      <td className="bg-gray-200 text-gray-700 font-bold text-center rounded-lg">{i + 1}</td>
                      <td><EditableCell id_row={k.id} field="nama" value={k.nama} placeholder="Nama" onUpdate={onUpdate} /></td>
                      <td><EditableCell id_row={k.id} field="harga" value={k.harga} placeholder="1-9" onUpdate={onUpdate} /></td>
                      <td><EditableCell id_row={k.id} field="kebersihan" value={k.kebersihan} placeholder="1-9" onUpdate={onUpdate} /></td>
                      <td><EditableCell id_row={k.id} field="fasilitas" value={k.fasilitas} placeholder="1-9" onUpdate={onUpdate} /></td>
                      <td><EditableCell id_row={k.id} field="varian_menu" value={k.varian_menu} placeholder="1-9" onUpdate={onUpdate} /></td>
                      <td><EditableCell id_row={k.id} field="pelayanan" value={k.pelayanan} placeholder="1-9" onUpdate={onUpdate} /></td>
                      <td className="text-center">
                        <button onClick={() => onDelete(k.id)} className="p-2 text-red-500 bg-white border border-gray-300 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-lg transition-all w-full flex justify-center"><Trash size={18}/></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button onClick={onAdd} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md">
                <Plus size={18} /> Add Kantin
              </button>
              <button onClick={onDeleteAll} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md">
                <Trash size={18} /> Delete All
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button onClick={() => exportKantinCSV(dataKantin)} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md">
                <Download size={18} /> Export CSV
              </button>
              <label className="w-full sm:w-auto flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md cursor-pointer">
                <Upload size={18} /> Import CSV
                <input type="file" accept=".csv" onChange={this.handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}