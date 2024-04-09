import React from 'react';
import { Label } from './ui/label';


interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange }) => {
  return (
    <div>
      <Label className="block text-sm font-medium text-gray-700">{label}</Label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="px-1 py-1 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export default InputField;