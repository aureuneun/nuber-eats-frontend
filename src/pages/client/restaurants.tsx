import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragment';
import {
  allRestaurants,
  allRestaurantsVariables,
} from '../../__generated__/allRestaurants';

const ALL_RESTAURANTS_QUERY = gql`
  query allRestaurants($restaurantsInput: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    allRestaurants(input: $restaurantsInput) {
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

interface IFormProps {
  term: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { loading, data } = useQuery<allRestaurants, allRestaurantsVariables>(
    ALL_RESTAURANTS_QUERY,
    {
      variables: {
        restaurantsInput: {
          page,
        },
      },
    }
  );
  const history = useHistory();
  const { register, handleSubmit, getValues } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const onVaild = () => {
    const { term } = getValues();
    history.push({
      pathname: '/search',
      search: `term=${term}`,
    });
  };
  return (
    <div>
      <Helmet>
        <title>Nuber eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onVaild)}
        className="bg-gray-800  w-screen py-32 flex items-center justify-center"
      >
        <input
          ref={register({
            required: true,
            pattern: /[A-Za-z]/,
            minLength: 3,
          })}
          name="term"
          type="search"
          className="input w-3/12"
          placeholder="Search"
        />
      </form>
      {!loading && (
        <div className="px-8 flex flex-col items-center">
          <div className="grid grid-flow-col auto-cols-fr gap-10 my-10">
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className="group flex flex-col items-center justify-center cursor-pointer"
              >
                <img
                  src={category.coverImg || ''}
                  alt="category"
                  className="w-16 h-16 rounded-full bg-red-200"
                />
                <h5 className="text-sm group-hover:text-gray-400 mt-2">
                  {category.name}
                </h5>
              </div>
            ))}
          </div>
          <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
            {data?.allRestaurants.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="max-w-xs grid grid-cols-3 text-center py-1 m-5">
            {page > 1 ? (
              <button
                className="focus:outline-none"
                onClick={() => setPage((page) => page - 1)}
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>{`Page ${page} of ${data?.allRestaurants.totalPages}`}</span>
            {page !== data?.allRestaurants.totalPages ? (
              <button
                className="focus:outline-none"
                onClick={() => setPage((page) => page + 1)}
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
