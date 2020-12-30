import React from 'react';
import { useMe } from '../hooks/useMe';
import { DishParts_options } from '../__generated__/DishParts';
import { UserRole } from '../__generated__/globalTypes';

interface IDishProps {
  id?: number;
  name: string;
  price: number;
  description: string;
  options?: DishParts_options[] | null;
  isCustomer?: boolean;
  isSelected?: boolean;
  toggleItem?: (dishId: number, optionName?: string) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  description,
  options,
  isCustomer = false,
  toggleItem,
  isSelected,
  children,
}) => {
  const onClick = () => {
    if (toggleItem) {
      toggleItem(id);
    }
  };
  const { data } = useMe();
  return (
    <div
      className={`border-gray-300 border w-full p-4 mb-16 hover:border-gray-500 transition-colors duration-700 `}
    >
      <div>
        <h2 className="text-lg font-medium">{name}</h2>
        <h4 className="font-medium mb-4">{description}</h4>
        <div className="flex justify-between items-center">
          <span className="font-light">{`$ ${price}`}</span>
          {data?.me.role === UserRole.Client && (
            <button
              onClick={onClick}
              className={`${
                isSelected && 'bg-red-300 hover:bg-red-500'
              } btn p-4`}
            >
              {isSelected ? `Remove` : 'Add'}
            </button>
          )}
        </div>
      </div>
      {isCustomer && options && isSelected && (
        <div>
          <h5 className="mt-5 mb-3 font-medium">Dish Options:</h5>
          {children}
        </div>
      )}
    </div>
  );
};
