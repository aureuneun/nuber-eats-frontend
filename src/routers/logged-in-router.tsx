import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { UserRole } from '../__generated__/globalTypes';
import { meQuery } from '../__generated__/meQuery';

const clientRoutes = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
];

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
    <Router>
      <Switch>
        {data?.me.role === UserRole.Client && clientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
