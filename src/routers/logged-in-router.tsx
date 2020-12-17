import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { meQuery } from '../__generated__/meQuery';

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  return !data || loading || error ? (
    <div className="h-screen flex justify-center items-center">
      <span className="font-medium text-xl tracking-wide">Loading...</span>
    </div>
  ) : (
    <div>
      <h1>{data?.me.role}</h1>
    </div>
  );
};
