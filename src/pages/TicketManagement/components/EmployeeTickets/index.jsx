import { Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history, Redirect } from 'umi';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import MyTickets from './components/MyTickets';
import TicketQueue from './components/TicketQueue';
import styles from './index.less';

const EmployeeTicket = (props) => {
  const { TabPane } = Tabs;

  const {
    dispatch,
    // companyLocationList = [],
    ticketList = [],
    totalStatus = [],
    tabName = '',
    permissions = [],
    role = '',
    selectedLocations: selectedLocationsProp = [],
    isLocationLoaded = false,
    locationsOfCountries = [],
  } = props;

  if (!tabName) return <Redirect to="/ticket-management/ticket-queue" />;

  const [selectedLocationsState, setSelectedLocationsState] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setSelectedLocationsState(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    if (!tabName) {
      history.replace(`/ticket-management/ticket-queue`);
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

  const handleChangeTable = (key) => {
    history.push(`/ticket-management/${key}`);
  };

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
      <div className={styles.item}>
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
          activeKey={tabName || 'ticket-queue'}
          onChange={(key) => {
            handleChangeTable(key);
          }}
          destroyInactiveTabPane
          tabBarExtraContent={renderFilterLocation()}
        >
          {isLocationLoaded ? (
            <>
              <TabPane tab="Ticket Queue" key="ticket-queue">
                <TicketQueue
                  role={role}
                  data={ticketList}
                  permissions={permissions}
                  tabName={tabName}
                />
              </TabPane>
              <TabPane tab="My Tickets" key="my-tickets">
                <MyTickets
                  role={role}
                  data={ticketList}
                  totalStatus={totalStatus}
                  permissions={permissions}
                />
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
    ticketManagement: {
      ticketList = [],
      totalStatus = [],
      selectedLocations = [],
      isLocationLoaded = false,
      locationsOfCountries = [],
    } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    employee,
    ticketList,
    locationsOfCountries,
    totalStatus,
    companyLocationList,
    selectedLocations,
    isLocationLoaded,
  }),
)(EmployeeTicket);
