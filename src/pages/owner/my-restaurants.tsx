import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragment';
import { myRestaurants } from '../../__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);
  return (
    <div>
      <Helmet>
        <title>My Restaurants</title>
      </Helmet>
      <div className="h-screen flex flex-col items-center mt-8 md:mt-24">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants?.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
            {data?.myRestaurants.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
