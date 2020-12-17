import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h2 className="text-5xl font-bold">404</h2>
      <h4 className="text-2xl font-normal my-5">
        This is not the web page you are looking for
      </h4>
      <Link to="/" className="text-lime-600 hover:underline">
        &larr; Go back home
      </Link>
    </div>
  );
};
