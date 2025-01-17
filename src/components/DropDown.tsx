import React, { useState } from "react";

type DropdownProps = {
  options: string[];
  onSelect: (selected: string) => void;
  defaultOption?: string;
  disabled?: boolean;
};

export default function Dropdown({
  options,
  onSelect,
  defaultOption,
  disabled,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption || "");
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option); // Pass selected option to parent
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <div
        onClick={toggleDropdown}
        className=" flex text-slate-700 justify-between min-w-40  px-4  py-1 text-sm font-medium  bg-white  rounded-md shadow-sm  cursor-pointer border    border-black "
      >
        {selectedOption || "Select an option"}
        <ArrowIcon isOpen={isOpen} />
      </div>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10     mt-2 bg-white border-gray-300 rounded-md shadow-lg max-h-56 overflow-y-auto">
          <ul className="py-1 text-sm text-gray-700 list-none m-0 p-0">
            {options.map((option, index) => (
              <li key={index}>
                <span
                  onClick={() => handleSelect(option)}
                  className=" text-black  inline-block px-4 w-40  py-2 text-center hover:bg-gray-100  rounded-md  "
                >
                  {option}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ArrowIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ml-2 transition-transform ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
