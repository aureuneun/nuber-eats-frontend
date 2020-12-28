import React from 'react';

interface IDishProps {
  name: string;
  price: number;
  description: string;
}

export const Dish: React.FC<IDishProps> = ({ name, price, description }) => {
  return (
    <div className="border-gray-300 border w-full py-5 px-3 hover:border-gray-500 transition-colors duration-500">
      <h2 className="text-lg font-medium">{name}</h2>
      <h4 className="font-medium mb-4">{description}</h4>
      <span className="font-light">{`$ ${price}`}</span>
    </div>
  );
};
