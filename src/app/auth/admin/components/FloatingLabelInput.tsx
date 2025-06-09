// FloatingLabelInput.tsx
import React from "react";

interface FloatingLabelInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function FloatingLabelInput({
  label,
  id,
  type = "text",
  value,
  onChange,
}: FloatingLabelInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="peer w-full border rounded px-3 pt-5 pb-2 focus:outline-none"
        placeholder=" "
      />
      <label htmlFor={id} className="absolute left-3 top-2 text-gray-500 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base transition-all">
        {label}
      </label>
    </div>
  );
}
