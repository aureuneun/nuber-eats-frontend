import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragment';
import { useQueries } from '../../hooks/useQueries';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [query] = useQueries(['term']);
  const history = useHistory();
  const [searchRestaurantQuery, { data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    if (!query) {
      return history.replace('/');
    }
    searchRestaurantQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, query, searchRestaurantQuery]);
  return (
    <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
      <Helmet>
        <title>Search</title>
      </Helmet>
      {data?.searchRestaurant.restaurants?.map((restaurant) => (
        <Restaurant
          key={restaurant.id}
          id={restaurant.id}
          coverImg={restaurant.coverImg}
          name={restaurant.name}
          categoryName={restaurant.category?.name}
        />
      ))}
    </div>
  );
};
