import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../fragment';
import { useMe } from '../hooks/useMe';
import { editOrder, editOrderVariables } from '../__generated__/editOrder';
import { getOrder, getOrderVariables } from '../__generated__/getOrder';
import { UserRole, OrderStatus } from '../__generated__/globalTypes';
import { orderUpdates } from '../__generated__/orderUpdates';

export const ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const { id } = useParams<IParams>();
  const { data: userData } = useMe();
  const { subscribeToMore, data } = useQuery<getOrder, getOrderVariables>(
    ORDER_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const [editOrder] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER_MUTATION
  );
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore]);
  const onClick = (orderStatus: OrderStatus) => {
    editOrder({
      variables: {
        input: {
          id: +id,
          status: orderStatus,
        },
      },
    });
  };
  return (
    <div>
      <Helmet>
        <title>Order</title>
      </Helmet>
      <div className="mt-32 container flex justify-center">
        <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
          <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
            Order #{id}
          </h4>
          <h5 className="p-5 pt-10 text-3xl text-center ">
            ${data?.getOrder.order?.total}
          </h5>
          <div className="p-5 text-xl grid gap-6">
            <div className="border-t pt-5 border-gray-700">
              Prepared By:{' '}
              <span className="font-medium">
                {data?.getOrder.order?.restaurant?.name}
              </span>
            </div>
            <div className="border-t pt-5 border-gray-700 ">
              Deliver To:{' '}
              <span className="font-medium">
                {data?.getOrder.order?.customer?.email}
              </span>
            </div>
            <div className="border-t border-b py-5 border-gray-700">
              Driver:{' '}
              <span className="font-medium">
                {data?.getOrder.order?.driver?.email || 'Not yet.'}
              </span>
            </div>
            {userData?.me.role === UserRole.Client && (
              <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                Status: {data?.getOrder.order?.status}
              </span>
            )}
            {userData?.me.role === UserRole.Owner && (
              <>
                {data?.getOrder.order?.status === OrderStatus.Pending && (
                  <button
                    onClick={() => onClick(OrderStatus.Cooking)}
                    className="btn"
                  >
                    Accept order
                  </button>
                )}
                {data?.getOrder.order?.status === OrderStatus.Cooking && (
                  <button
                    onClick={() => onClick(OrderStatus.Cooked)}
                    className="btn"
                  >
                    Order Cooked
                  </button>
                )}
                {data?.getOrder.order?.status !== OrderStatus.Pending &&
                  data?.getOrder.order?.status !== OrderStatus.Cooking && (
                    <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                      Status: {data?.getOrder.order?.status}
                    </span>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
