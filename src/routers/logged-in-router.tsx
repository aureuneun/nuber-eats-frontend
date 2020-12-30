import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { Order } from '../pages/order';
import { AddDish } from '../pages/owner/add-dish';
import { AddRestaurant } from '../pages/owner/add-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { UserRole } from '../__generated__/globalTypes';

const commonRoutes = [
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
  {
    path: '/order/:id',
    component: <Order />,
  },
];

const clientRoutes = [
  {
    path: '/',
    component: <Restaurants />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurant/:id',
    component: <Restaurant />,
  },
];

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants />,
  },
  {
    path: '/add-restaurant',
    component: <AddRestaurant />,
  },
  {
    path: '/restaurant/:id',
    component: <MyRestaurant />,
  },
  {
    path: '/restaurant/:id/add-dish',
    component: <AddDish />,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  return !data || loading || error ? (
    <div className="h-screen flex justify-center items-center">
      <span className="font-medium text-xl tracking-wide">Loading...</span>
    </div>
  ) : (
    <Router>
      <Header />
      <Switch>
        {data?.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data?.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
