import React from 'react';
import { compose, withProps, lifecycle, withHandlers, withState } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from 'react-google-maps';
import isEqual from 'lodash/isEqual';
import { Skeleton } from 'antd';
import { roundNumber } from '@/utils/utils';
import PageLoading from '../PageLoading';

const M_MILE = 0.000621371192;
const M_KM = 0.001;

export default compose(
  withProps({
    // 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDF62YnuYiEPX_aWnc-eeiXBBtvITb93n8&v=3.exp&libraries=geometry,drawing,places',
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCu3QtdmZaVdtgW9hMPuMLFmp6PqfBLNSI&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: (
      <div style={{ height: `100%` }}>
        <PageLoading />
      </div>
    ),
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  withState('args', 'setArguments', {
    center: { longitude: 106.660172, latitude: 10.762622 },
  }),
  withHandlers({
    updateArguments: ({ args, setArguments, onChange }) => newArgs => {
      const {
        maps: { DirectionsStatus, DirectionsService, TravelMode, LatLng, UnitSystem },
        // eslint-disable-next-line no-undef
      } = google;
      const extendArgs = {
        ...args,
        ...newArgs,
      };
      const { origin, destination, waypoints, distanceUnit } = extendArgs;
      if (origin && destination) {
        const directionsService = new DirectionsService();
        directionsService.route(
          {
            origin: new LatLng(origin.latitude, origin.longitude),
            destination: new LatLng(destination.latitude, destination.longitude),
            waypoints:
              waypoints && waypoints.length > 0
                ? waypoints.map(waipts => ({
                    location: new LatLng(waipts.latitude, waipts.longitude),
                    stopover: true,
                  }))
                : [],
            travelMode: TravelMode.DRIVING,
            unitSystem: distanceUnit === 'km' ? UnitSystem.METRIC : UnitSystem.IMPERIAL,
          },
          (result, status) => {
            if (status === DirectionsStatus.OK) {
              let distance = 0;
              result.routes.forEach(route =>
                route.legs.forEach(leg => {
                  if (distanceUnit === 'km') {
                    distance += leg.distance.value * M_KM;
                  } else {
                    distance += leg.distance.value * M_MILE;
                  }
                })
              );
              setArguments({ ...extendArgs, directions: result });
              if (typeof onChange === 'function') onChange(roundNumber(distance, 4));
            }
          }
        );
      } else {
        setArguments({ ...extendArgs });
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { origin, destination, waypoints, updateArguments, distanceUnit } = this.props;
      updateArguments({ origin, destination, waypoints, distanceUnit });
    },
    componentDidUpdate() {
      const { props } = this;
      const { origin, destination, waypoints, updateArguments, args, distanceUnit } = props;
      if (!isEqual(args, props)) updateArguments({ origin, destination, waypoints, distanceUnit });
    },
  })
)(props => {
  const {
    args: { origin, destination, waypoints, directions, center, loading },
  } = props;
  const defaultCenter = origin
    ? { lat: origin.latitude, lng: origin.longitude }
    : { lat: center.latitude, lng: center.longitude };
  return (
    <Skeleton loading={loading}>
      <GoogleMap
        defaultZoom={14}
        defaultCenter={defaultCenter}
        defaultOptions={{
          // these following 7 options turn certain controls off see link below
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          rotateControl: false,
          fullscreenControl: false,
        }}
      >
        {origin && <Marker position={{ lat: origin.latitude, lng: origin.longitude }} />}
        {waypoints &&
          waypoints.length > 0 &&
          waypoints.map(waipts => (
            <Marker
              key={waipts.placeID}
              position={{ lat: waipts.latitude, lng: waipts.longitude }}
            />
          ))}
        {destination && (
          <Marker position={{ lat: destination.latitude, lng: destination.longitude }} />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Skeleton>
  );
});
