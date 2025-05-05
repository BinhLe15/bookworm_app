import React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 8,
  className = "",
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Quantity
      </label>
      <div className="flex items-center h-12 bg-gray-300 rounded">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="flex items-center justify-center w-fit h-full text-gray-600 hover:text-gray-800 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <MinusIcon />
        </button>

        <input
          type="text"
          value={value}
          readOnly
          onChange={handleInputChange}
          className="w-full h-full text-center bg-gray-300 border-none focus:outline-none focus:ring-0 cursor-default"
          aria-label="Quantity"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="flex items-center justify-center w-fit h-full text-gray-600 hover:text-gray-800 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
