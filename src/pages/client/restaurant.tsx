import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragment';
import {
  restaurant,
  restaurantVariables,
} from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const { id } = useParams<IRestaurantParams>();
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });
  return (
    <div>
      <Helmet>
        <title>Restaurant</title>
      </Helmet>
      <div
        className="bg-red-200 py-36 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-52 py-6 pl-16">
          <h3 className="text-3xl">{data?.restaurant.restaurant?.name}</h3>
          <h5 className="text-sm font-light my-2">
            <Link
              to={`/category/${data?.restaurant.restaurant?.category?.name
                .trim()
                .toLowerCase()
                .replace(/ /g, '-')}`}
            >
              {data?.restaurant.restaurant?.category?.name}
            </Link>
          </h5>
          <h5 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h5>
        </div>
      </div>
    </div>
  );
};
