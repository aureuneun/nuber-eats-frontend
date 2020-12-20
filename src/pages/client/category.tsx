import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragment';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const { slug } = useParams<ICategoryParams>();
  const { data } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug,
      },
    },
  });
  return (
    <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
      <Helmet>
        <title>Category</title>
      </Helmet>
      {data?.category.restaurants?.map((restaurant) => (
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
