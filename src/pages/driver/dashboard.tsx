import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragment';
import { cookedOrder } from '../../__generated__/cookedOrder';
import { useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

export const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription cookedOrder {
    cookedOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const TAKE_ORDER_MATATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚘</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSuccess = ({
    coords: { latitude: lat, longitude: lng },
  }: GeolocationPosition) => {
    setDriverCoords({ lat, lng });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
    /*     const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      },
      (results, status) => {
        console.log(status, results);
      }
    ); */
  }, [driverCoords, map, maps]);
  const handleApiLoaded = ({
    map,
    maps,
  }: {
    map: google.maps.Map;
    maps: any;
  }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const { data: subscriptionData } = useSubscription<cookedOrder>(
    COOKED_ORDER_SUBSCRIPTION
  );
  useEffect(() => {
    if (subscriptionData?.cookedOrder.id) {
      makeRoute();
    }
  }, [subscriptionData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/order/${subscriptionData?.cookedOrder.id}`);
    }
  };
  const [takeOrder] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MATATION,
    { onCompleted }
  );
  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBPcmfTW63hJB45K7mKYcHo7oao0uP2UcE' }}
          defaultCenter={{ lat: 37.3939212, lng: 126.6796107 }}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleApiLoaded}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {subscriptionData?.cookedOrder.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              New Coocked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @ {subscriptionData?.cookedOrder.restaurant?.name}
            </h1>
            <button
              className="btn w-full  block  text-center mt-5"
              onClick={() => {
                takeOrder({
                  variables: {
                    input: {
                      id: subscriptionData.cookedOrder.id,
                    },
                  },
                });
              }}
            >
              Accept Order &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            No orders yet...
          </h1>
        )}
      </div>
    </div>
  );
};
