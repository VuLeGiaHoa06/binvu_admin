"use client";

import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { X } from "lucide-react";

type MultiTextProps = {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

const MultiText: React.FC<MultiTextProps> = ({
  onChange,
  onRemove,
  value,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = (value: string) => {
    onChange(value);
    setInputValue("");
  };

  return (
    <>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addValue(inputValue);
          }
        }}
      />
      <div className="flex gap-2 flex-wrap ">
        {value.map((item, index) => (
          <Badge
            key={index}
            className="bg-grey-1 text-white flex items-center cursor-pointer"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="ml-2 hover:text-red-1"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};

export default MultiText;
