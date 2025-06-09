import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

export default function PasswordInput({
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}: PasswordInputProps) {
  return (
    <div className="relative w-full">
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        placeholder="Password"
      />

      <div
        onClick={toggleShowPassword}
        className="absolute top-[35px] left-3 flex items-center text-gray-700 cursor-pointer"
      >
        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
      </div>
    </div>
  );
}
