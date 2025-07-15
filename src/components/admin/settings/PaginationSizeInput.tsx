import { TextInput, Chip } from "@mantine/core";
import { useState } from "react";

interface Props {
  values: number[];
  onChange: (newValues: number[]) => void;
}

export const PaginationSizeInput = ({ values, onChange }: Props) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const num = Number(input);
    if (!isNaN(num) && num > 0 && num <= 200 && !values.includes(num)) {
      onChange([...values, num]);
    }
    setInput("");
  };

  const handleRemove = (val: number) => {
    onChange(values.filter((v) => v !== val));
  };

  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        Kích thước phân trang *
      </label>
      <div className="flex gap-2 mb-2 flex-wrap">
        {values.map((val) => (
          <Chip
            key={val}
            checked
            onChange={() => handleRemove(val)}
            variant="light"
            color="blue"
          >
            {val}
          </Chip>
        ))}
      </div>
      <TextInput
        placeholder="Nhập số và nhấn Enter"
        value={input}
        type="number"
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
    </div>
  );
};
