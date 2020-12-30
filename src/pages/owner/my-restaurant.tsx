import { gql, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDER_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragment';
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant';
import { pendingOrders } from '../../__generated__/pendingOrders';
import {
  VictoryLine,
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from 'victory';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

export const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IMyRestaurantParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IMyRestaurantParams>();
  const history = useHistory();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/order/${subscriptionData.pendingOrders.id}`);
    }
  }, [data, history, subscriptionData]);
  return (
    <div>
      <Helmet>
        <title>My Restaurant</title>
      </Helmet>
      <div
        className="bg-gray-700  py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="flex flex-col items-center mt-8 md:mt-24">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <div className="max-w-lg">
          <Link
            to={`/restaurant/${id}/add-dish`}
            className="text-white bg-gray-600 py-3 px-10 mx-4"
          >
            Add Dish &rarr;
          </Link>
          <Link to={``} className="text-white bg-lime-600 py-3 px-10 mx-4">
            Buy Promotion &rarr;
          </Link>
        </div>
      </div>
      <div className="mt-10 px-8">
        {data?.myRestaurant.restaurant?.menu.length === 0 ? (
          <h4 className="text-xl mb-5">Please upload a dish!</h4>
        ) : (
          <div className="grid grid-flow-row auto-rows-max md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
            {data?.myRestaurant.restaurant?.menu.map((dish) => (
              <Dish
                key={dish.id}
                name={dish.name}
                price={dish.price}
                description={dish.descrition}
              />
            ))}
          </div>
        )}
        <div>
          <VictoryChart
            maxDomain={{ y: 40000 }}
            minDomain={{ y: 0 }}
            theme={VictoryTheme.material}
            domainPadding={10}
            height={400}
            width={window.innerWidth}
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryLine
              labels={({ datum }) => `${datum.y / 10000}만원`}
              labelComponent={<VictoryLabel renderInPortal dy={-20} />}
              data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                x: order.createdAt,
                y: order.total,
              }))}
              interpolation="natural"
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => `${tick / 10000}만원`}
            />
            <VictoryAxis
              tickFormat={(tick) =>
                `${new Date(tick).toLocaleDateString('ko').split('.')[2]}일`
              }
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};
