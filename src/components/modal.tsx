import React, { ChangeEvent, useState } from 'react';

interface IModalProps {
  onClick: (address: string) => void;
}

export const Modal: React.FC<IModalProps> = ({ onClick }) => {
  const [address, setAddress] = useState('');
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.currentTarget.value);
  };
  return (
    <div className="h-screen w-full bg-gray-500 bg-opacity-80 fixed top-0 left-0 flex justify-center items-center z-10">
      <div className="p-6 bg-white flex flex-col w-96 h-56 justify-between">
        <h3 className="text-2xl font-medium">Please enter your address</h3>
        <input
          onChange={onChange}
          className="input"
          name="address"
          type="address"
          placeholder="Address"
        />
        <button onClick={() => onClick(address)} className="btn">
          Submit
        </button>
      </div>
    </div>
  );
};
