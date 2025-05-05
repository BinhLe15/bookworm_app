import React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  inputClassName?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 8,
  className = "",
  inputClassName = "",
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
    <div className={`${className}`}>
      <div className="flex items-center justify-between border rounded-lg bg-gray-300 border-gray-300 shadow-sm">
        <Button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="flex items-center justify-center h-full bg-gray-300 text-gray-600 !rounded-r-none hover:text-gray-800 hover:bg-gray-400 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <MinusIcon />
        </Button>

        <input
          type="text"
          value={value}
          readOnly
          onChange={handleInputChange}
          className={`${inputClassName} h-full text-center bg-gray-300 border-none focus:outline-none focus:ring-0 cursor-default`}
          aria-label="Quantity"
        />

        <Button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="flex items-center justify-center h-full bg-gray-300 text-gray-600 !rounded-l-none hover:text-gray-800 hover:bg-gray-400 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default QuantityInput;
