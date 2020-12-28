import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import {
  createDish,
  createDishVariables,
} from '../../__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

export const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IAddDishParams {
  id: string;
}

interface IFormProps {
  name: string;
  price: string;
  descrition: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { id } = useParams<IAddDishParams>();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  const [createDish, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +id,
          },
        },
      },
    ],
  });
  const onValid = () => {
    const { name, price, descrition, ...rest } = getValues();
    const optionsObj = options.map((id) => ({
      name: rest[`${id}-optionName`],
      extra: +rest[`${id}-optionExtra`],
    }));
    createDish({
      variables: {
        input: {
          name,
          price: +price,
          descrition,
          restaurantId: +id,
          options: optionsObj,
        },
      },
    });
    history.goBack();
  };
  const [options, setOptions] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptions((current) => [Date.now(), ...current]);
  };
  const onDeleteOptionClick = (index: number) => {
    setOptions((current) => current.filter((id) => id !== index));
    setValue(`${index}-optionName`, '');
    setValue(`${index}-optionExtra`, '');
  };
  return (
    <div className="h-screen flex flex-col items-center mt-8 md:mt-24">
      <Helmet>
        <title>Add Dish</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-4">
        <h2 className="self-start text-3xl my-9 md:mt-16">Add Dish</h2>
        <form
          onSubmit={handleSubmit(onValid)}
          className="grid gap-3 w-full mb-4"
        >
          <input
            ref={register({ required: 'Name is required' })}
            name="name"
            type="text"
            className="input"
            placeholder="Name"
          />
          <input
            ref={register({ required: 'Price is required' })}
            name="price"
            type="number"
            className="input"
            min={0}
            placeholder="Price"
          />
          <input
            ref={register({ required: 'Description is required' })}
            name="descrition"
            type="text"
            className="input"
            placeholder="Description"
          />
          <div className="my-10">
            <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
            <span
              onClick={onAddOptionClick}
              className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
            >
              Add Dish Option
            </span>
            {options.length !== 0 &&
              options.map((id) => (
                <div key={id} className="mt-5 grid grid-cols-3">
                  <input
                    ref={register}
                    name={`${id}-optionName`}
                    type="text"
                    placeholder="Option Name"
                    className="input"
                  />
                  <input
                    ref={register}
                    name={`${id}-optionExtra`}
                    type="number"
                    min={0}
                    placeholder="Option extra"
                    className="input"
                  />
                  <span
                    onClick={() => onDeleteOptionClick(id)}
                    className="input"
                  >
                    Delete Click
                  </span>
                </div>
              ))}
          </div>
          <Button
            isValid={formState.isValid}
            loading={loading}
            text="Create Dish"
          />
        </form>
      </div>
    </div>
  );
};
