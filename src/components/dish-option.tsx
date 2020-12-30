import React from 'react';

interface IDishOptionProps {
  id: number;
  name: string;
  extra?: number | null;
  isSelected: boolean;
  toggleOption: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  id,
  name,
  extra,
  isSelected,
  toggleOption,
}) => {
  const onClick = () => {
    toggleOption(id, name);
  };
  return (
    <div
      className={`mb-2 flex border justify-between border-gray-300 p-2 hover:border-gray-500 transition-colors duration-500`}
    >
      <div className="flex items-center justify-between w-28">
        <h5 className="text-sm">{name}</h5>
        <h6 className="text-sm opacity-60">{`$ ${extra}`}</h6>
      </div>
      <button
        onClick={onClick}
        className={`${isSelected && 'bg-red-300 hover:bg-red-500'} btn p-4`}
      >
        {isSelected ? `Remove` : 'Add'}
      </button>
    </div>
  );
};
