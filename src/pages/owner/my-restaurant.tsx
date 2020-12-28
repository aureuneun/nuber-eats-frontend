import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragment';
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

interface IMyRestaurantParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IMyRestaurantParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  return (
    <div>
      <Helmet>
        <title>My Restaurant</title>
      </Helmet>
      <div
        className="bg-gray-700  py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="flex flex-col items-center mt-8 md:mt-24">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <div className="max-w-lg">
          <Link
            to={`/restaurant/${id}/add-dish`}
            className="text-white bg-gray-600 py-3 px-10 mx-4"
          >
            Add Dish &rarr;
          </Link>
          <Link to={``} className="text-white bg-lime-600 py-3 px-10 mx-4">
            Buy Promotion &rarr;
          </Link>
        </div>
      </div>
      <div className="mt-10 px-8">
        {data?.myRestaurant.restaurant?.menu.length === 0 ? (
          <h4 className="text-xl mb-5">Please upload a dish!</h4>
        ) : (
          <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
            {data?.myRestaurant.restaurant?.menu.map((dish) => (
              <Dish
                key={dish.id}
                name={dish.name}
                price={dish.price}
                description={dish.descrition}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
