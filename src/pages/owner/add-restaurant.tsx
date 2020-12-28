import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const [imageUrl, setImageUrl] = useState('');
  const history = useHistory();
  const client = useApolloClient();
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState, getValues } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      setUploading(false);
      const { name, address, categoryName } = getValues();
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                id: restaurantId,
                name,
                address,
                coverImg: imageUrl,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                },
                __typename: 'Restaurant',
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push('/');
    }
  };
  const [createRestaurant, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted });
  const onValid = async () => {
    try {
      setUploading(true);
      const { file, name, address, categoryName } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      createRestaurant({
        variables: {
          input: {
            coverImg,
            name,
            address,
            categoryName,
          },
        },
      });
    } catch (error) {}
  };
  return (
    <div className="h-screen flex flex-col items-center mt-8 md:mt-24">
      <Helmet>
        <title>Add Restaurant</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-4">
        <h2 className="self-start text-3xl my-9 md:mt-16">Add Restaurant</h2>
        <form
          onSubmit={handleSubmit(onValid)}
          className="grid gap-3 w-full mb-4"
        >
          <input
            ref={register({ required: 'Name is required' })}
            name="name"
            type="text"
            className="input"
            placeholder="name"
          />
          <input
            ref={register({ required: 'Address is required' })}
            name="address"
            type="text"
            className="input"
            placeholder="address"
          />
          <input
            ref={register({ required: 'Category Name is required' })}
            name="categoryName"
            type="text"
            className="input"
            placeholder="categoryName"
          />
          <input
            ref={register({ required: true })}
            name="file"
            type="file"
            accept="image/*"
          />
          <Button
            isValid={formState.isValid}
            loading={uploading}
            text="Create Restaurant"
          />
          {data?.createRestaurant.error && (
            <FormError error={data.createRestaurant.error} />
          )}
        </form>
      </div>
    </div>
  );
};
