/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myRestaurants
// ====================================================

export interface myRestaurants_myRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurants_myRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  address: string;
  category: myRestaurants_myRestaurants_restaurants_category | null;
  isPromoted: boolean;
}

export interface myRestaurants_myRestaurants {
  __typename: "MyRestaurantsOutput";
  ok: boolean;
  error: string | null;
  restaurants: myRestaurants_myRestaurants_restaurants[] | null;
}

export interface myRestaurants {
  myRestaurants: myRestaurants_myRestaurants;
}