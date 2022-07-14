import { Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
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
    companyLocationList = [],
    permissions = [],
    role = '',
    selectedLocations: selectedLocationsProp = [],
    isLocationLoaded = false,
  } = props;

  const [selectedLocationsState, setSelectedLocationsState] = useState([]);

  useEffect(() => {
    setSelectedLocationsState(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    const currentLocation = getCurrentLocation();
    if (currentLocation) {
      dispatch({
        type: 'ticketManagement/save',
        payload: {
          selectedLocations: [currentLocation],
          isLocationLoaded: true,
        },
      });
    }
  }, []);

  const fetchLocationList = () => {
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  const onLocationChange = (selection) => {
    dispatch({
      type: 'ticketManagement/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    setSelectedLocationsState([...selection]);
  };

  const renderFilterLocation = () => {
    const locationOptions = companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
    return (
      <div className={styles.options}>
        <CustomDropdownSelector
          options={locationOptions}
          onChange={onLocationChange}
          disabled={locationOptions.length < 2}
          label="Location"
          selectedList={selectedLocationsState}
        />
      </div>
    );
  };

  useEffect(() => {
    if (!tabName) {
      history.replace(`/ticket-management/all-tickets`);
    }
    fetchLocationList();

    return () => {
      dispatch({
        type: 'ticketManagement/save',
        payload: {
          selectedLocations: [],
        },
      });
    };
  }, []);

  if (!tabName) return '';
  return (
    <div className={styles.TicketManagement}>
      <PageContainer>
        <Tabs
          activeKey={tabName || 'all-tickets'}
          onChange={(key) => {
            history.push(`/ticket-management/${key}`);
          }}
          tabBarExtraContent={renderFilterLocation()}
        >
          {isLocationLoaded ? (
            <>
              <TabPane tab="Overview" key="overview">
                <WorkInProgress />;
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
          location: { _id: locationId = '', headQuarterAddress: { country = '' } = {} } = {},
        } = {},
      } = {},
    },
    location: { companyLocationList = [] },
    ticketManagement: {
      listOffAllTicket = [],
      totalList = [],
      selectedLocations = [],
      isLocationLoaded = false,
    } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    country,
    companyLocationList,
    locationId,
    selectedLocations,
    isLocationLoaded,
  }),
)(ManagerTicket);
