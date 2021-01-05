import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { Dish } from '../../components/dish';
import { DishOption } from '../../components/dish-option';
import { Modal } from '../../components/modal';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragment';
import {
  createOrder,
  createOrderVariables,
} from '../../__generated__/createOrder';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
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
        menu {
          ...DishParts
        }
        category {
          slug
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const history = useHistory();
  const [orderState, setOrderState] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const { id } = useParams<IRestaurantParams>();
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (ok) {
      history.push(`/order/${orderId}`);
    }
  };
  const [createOrder, { loading }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });
  const isValid = () => {
    return Boolean(orderItems.length !== 0);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const toggleItem = (dishId: number, optionName?: string) => {
    if (isSelected(dishId)) {
      setOrderItems((current) =>
        current.filter((dish) => dish.dishId !== dishId)
      );
    } else {
      setOrderItems((current) => [
        ...current,
        {
          dishId,
          options: [],
        },
      ]);
    }
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    return Boolean(item?.options?.find((option) => option.name === optionName));
  };
  const toggleOption = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (isSelected(dishId)) {
      setOrderItems((current) =>
        current.filter((dish) => dish.dishId !== dishId)
      );
      if (!isOptionSelected(dishId, optionName)) {
        setOrderItems((current) => [
          {
            dishId,
            options: [{ name: optionName }, ...item?.options!],
          },
          ...current,
        ]);
      } else {
        setOrderItems((current) => [
          {
            dishId,
            options: item?.options?.filter(
              (option) => option.name !== optionName
            ),
          },
          ...current,
        ]);
      }
    }
  };
  const onClick = (address: string) => {
    createOrder({
      variables: {
        input: {
          restaurantId: +id,
          items: orderItems,
          address,
        },
      },
    });
  };
  return (
    <div>
      <Helmet>
        <title>Restaurant</title>
      </Helmet>
      {orderState && <Modal onClick={onClick} />}
      <div
        className="bg-red-200 py-32 bg-cover bg-center"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-80 py-8 pl-16 ml-2">
          <h3 className="text-3xl">{data?.restaurant.restaurant?.name}</h3>
          <h5 className="text-xs font-light mt-2 mb-1">
            <Link
              to={`/category/${data?.restaurant.restaurant?.category?.slug}`}
            >
              {`• ${data?.restaurant.restaurant?.category?.name}`}
            </Link>
          </h5>
          <h5 className="text-base font-light">
            {data?.restaurant.restaurant?.address}
          </h5>
        </div>
      </div>
      <div className="mt-10 px-8">
        <div className="text-center mb-10">
          <Button
            onClick={() => {
              setOrderState(true);
            }}
            isValid={isValid()}
            loading={loading}
            text="| Order now |"
          />
        </div>
        <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              id={dish.id}
              key={dish.id}
              name={dish.name}
              price={dish.price}
              description={dish.descrition}
              options={dish.options}
              isCustomer={true}
              toggleItem={toggleItem}
              isSelected={isSelected(dish.id)}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  id={dish.id}
                  name={option.name}
                  extra={option.extra}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  toggleOption={toggleOption}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
