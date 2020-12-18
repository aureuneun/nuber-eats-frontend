/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allRestaurants
// ====================================================

export interface allRestaurants_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface allRestaurants_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: allRestaurants_allCategories_categories[] | null;
}

export interface allRestaurants_allRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface allRestaurants_allRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  address: string;
  category: allRestaurants_allRestaurants_restaurants_category | null;
  isPromoted: boolean;
}

export interface allRestaurants_allRestaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: allRestaurants_allRestaurants_restaurants[] | null;
}

export interface allRestaurants {
  allCategories: allRestaurants_allCategories;
  allRestaurants: allRestaurants_allRestaurants;
}

export interface allRestaurantsVariables {
  restaurantsInput: RestaurantsInput;
}
