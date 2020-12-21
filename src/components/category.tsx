import React from 'react';
import { Link } from 'react-router-dom';

interface ICatogoryProps {
  id: number;
  slug: string;
  coverImg: string;
  name: string;
}

export const Category: React.FC<ICatogoryProps> = ({
  id,
  slug,
  coverImg,
  name,
}) => {
  return (
    <Link to={`/category/${slug}`}>
      <div className="group flex flex-col items-center justify-center cursor-pointer">
        <img
          src={coverImg}
          alt="category"
          className="w-16 h-16 rounded-full bg-red-200"
        />
        <h5 className="text-sm group-hover:text-gray-400 mt-2">{name}</h5>
      </div>
    </Link>
  );
};
