import { Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history, Redirect } from 'umi';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';
import WorkInProgress from '@/components/WorkInProgress';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import AllTicket from './components/AllTickets';
import styles from './index.less';

const ManagerTicket = (props) => {
  const { TabPane } = Tabs;
  const {
    dispatch,
    tabName = '',
    permissions = [],
    role = '',
    selectedLocations: selectedLocationsProp = [],
    isLocationLoaded = false,
    locationsOfCountries = [],
  } = props;

  if (!tabName) return <Redirect to="/ticket-management/all-tickets" />;

  const [selectedLocationsState, setSelectedLocationsState] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setSelectedLocationsState(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    if (!tabName) {
      history.replace(`/ticket-management/all-tickets`);
    } else {
      dispatch({
        type: 'ticketManagement/getLocationsOfCountriesEffect',
      });
    }
    return () => {
      setData([]);
      setSelectedLocationsState([]);
      dispatch({
        type: 'ticketManagement/save',
        locationsOfCountries: [],
      });
    };
  }, []);

  useEffect(() => {
    const tempData = locationsOfCountries.map((x, i) => {
      return {
        title: x.country?.name,
        key: i,
        children: x.data.map((y) => {
          return {
            title: y.name,
            key: y._id,
          };
        }),
      };
    });
    setSelectedLocationsState([getCurrentLocation()]);
    setData(tempData);
    dispatch({
      type: 'ticketManagement/save',
      payload: {
        selectedLocations: [getCurrentLocation()],
        isLocationLoaded: true,
      },
    });
  }, [JSON.stringify(locationsOfCountries)]);

  const onLocationChange = (selection) => {
    dispatch({
      type: 'ticketManagement/save',
      payload: {
        selectedLocations: selection,
      },
    });
  };

  const renderFilterLocation = () => {
    return (
      <div className={styles.options}>
        <LocationDropdownSelector
          saveLocationToRedux={onLocationChange}
          selectedLocations={selectedLocationsState}
          data={data}
        />
      </div>
    );
  };

  if (!tabName) return '';
  return (
    <div className={styles.TicketManagement}>
      <PageContainer>
        <Tabs
          activeKey={tabName}
          onChange={(key) => {
            history.push(`/ticket-management/${key}`);
          }}
          tabBarExtraContent={renderFilterLocation()}
        >
          {isLocationLoaded ? (
            <>
              <TabPane tab="Overview" key="overview">
                <WorkInProgress />
              </TabPane>
              <TabPane tab="All Tickets" key="all-tickets">
                <AllTicket role={role} permissions={permissions} />
              </TabPane>
            </>
          ) : (
            <div style={{ padding: 24 }}>
              <Skeleton active />
            </div>
          )}
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(
  ({
    user: {
      currentUser: {
        employee: {
          location: { _id: locationId = '', headQuarterAddress: { country = {} } = {} } = {},
        } = {},
      } = {},
    },
    location: { companyLocationList = [] },
    ticketManagement: {
      listOffAllTicket = [],
      totalList = [],
      selectedLocations = [],
      isLocationLoaded = false,
      locationsOfCountries = [],
    } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    country,
    companyLocationList,
    locationId,
    selectedLocations,
    locationsOfCountries,
    isLocationLoaded,
  }),
)(ManagerTicket);
