import {
  UseFormRegisterReturn,
  FieldError,
} from "react-hook-form";
import { cn } from "../lib/utils/cn";

export interface FormInputProps {
  id: string;
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
}

 const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  placeholder,
  register,
  error,
  className,
  disabled,
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <label className="text-gray-600 dark:text-gray-400" htmlFor={id}>
        {label}
      </label>
      <input
        disabled={disabled}
        id={id}
        className={`block w-80 py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100 ${
          error ? "border-red-500" : ""
        }`}
        {...register}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};


export default FormInput;