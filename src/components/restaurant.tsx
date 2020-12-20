import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: number;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurant/${id}`}>
      <div className="group cursor-pointer">
        <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className="bg-red-400 h-60 w-80 bg-cover bg-center"
        ></div>
        <h5 className="group-hover:text-gray-400 my-2">{name}</h5>
        <h5 className="text-xs text-gray-400 border-t-2 border-gray-200 pt-2">
          {categoryName}
        </h5>
      </div>
    </Link>
  );
};
