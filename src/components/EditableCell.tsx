import React, { Component, createRef } from "react";
import { Check, X, Edit3 } from "lucide-react";
import { type TKantinMatrix } from "../types";

interface Props {
  id_row: string;
  field: keyof TKantinMatrix;
  value: string | number;
  placeholder: string;
  onUpdate: (id: string, field: keyof TKantinMatrix, val: string | number) => void;
}

interface State {
  onEditState: boolean;
  localValue: string | number;
}

export default class EditableCell extends Component<Props, State> {
  cellRef = createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = { onEditState: false, localValue: props.value };
  }

  componentDidMount() { document.addEventListener("mousedown", this.handleClickOutside); }
  componentWillUnmount() { document.removeEventListener("mousedown", this.handleClickOutside); }

  handleClickOutside = (event: MouseEvent) => {
    if (this.state.onEditState && this.cellRef.current && !this.cellRef.current.contains(event.target as Node)) {
      this.exitChanges();
    }
  };

  exitChanges = () => { this.setState({ localValue: this.props.value, onEditState: false }); };

  saveChanges = () => {
    let finalValue = this.state.localValue;
    if (String(finalValue).trim() !== "") {
      if (this.props.field !== "nama") {
        let numVal = Number(finalValue);
        if (isNaN(numVal) || numVal < 1) numVal = 1;
        else if (numVal > 9) numVal = 9;
        finalValue = numVal;
      }
      this.props.onUpdate(this.props.id_row, this.props.field, finalValue);
    } else {
      finalValue = this.props.value;
    }
    this.setState({ onEditState: false, localValue: finalValue });
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") this.saveChanges();
    if (e.key === "Escape") this.exitChanges();
  };

  render() {
    const { field, placeholder, value } = this.props;
    const { onEditState, localValue } = this.state;
    const isName = field === "nama";

    if (onEditState) {
      return (
        <div ref={this.cellRef} className="w-full flex items-center bg-white border-2 border-blue-400 rounded-lg p-0.5 shadow-inner">
          <input
            className="w-full p-1 outline-none text-center bg-transparent font-semibold text-blue-700"
            type={isName ? "text" : "number"} min={isName ? undefined : "1"} max={isName ? undefined : "9"} step="any"
            value={localValue} placeholder={placeholder}
            onChange={(e) => this.setState({ localValue: e.target.value })} onKeyDown={this.handleKeyDown} autoFocus
          />
          <div className="flex px-1 space-x-1">
            <button onClick={this.saveChanges} className="text-green-600 hover:bg-green-100 rounded-md p-0.5"><Check size={16} /></button>
            <button onClick={this.exitChanges} className="text-red-600 hover:bg-red-100 rounded-md p-0.5"><X size={16} /></button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="w-full p-2 bg-white border border-gray-300 rounded-lg cursor-pointer flex justify-center items-center group hover:border-blue-400 hover:shadow-sm transition-all"
        onClick={() => this.setState({ onEditState: true })}
      >
        <span className="truncate font-semibold text-gray-700 mr-2">{value}</span>
        <Edit3 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }
}