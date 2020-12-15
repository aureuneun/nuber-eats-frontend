import React from 'react';
import { isLoggedInVar } from '../apollo';

export const LoggedOutRouter = () => {
  return (
    <>
      <h1>Logged out</h1>
      <button onClick={() => isLoggedInVar(true)}>Click to login</button>
    </>
  );
};
