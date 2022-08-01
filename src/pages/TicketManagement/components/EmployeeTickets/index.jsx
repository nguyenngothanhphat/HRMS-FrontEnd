import { Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history, Redirect } from 'umi';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import CheckboxMenu from '@/components/CheckboxMenu';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import MyTickets from './components/MyTickets';
import TicketQueue from './components/TicketQueue';
import styles from './index.less';

const EmployeeTicket = (props) => {
  const { TabPane } = Tabs;

  const {
    dispatch,
    companyLocationList = [],
    listOffAllTicket = [],
    totalStatus = [],
    tabName = '',
    permissions = [],
    role = '',
    selectedLocations: selectedLocationsProp = [],
    isLocationLoaded = false,
  } = props;

  if (!tabName) return <Redirect to="/ticket-management/ticket-queue" />;

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

  const fetchLocation = () => {
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  const handleChangeTable = (key) => {
    history.push(`/ticket-management/${key}`);
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

  const getSelectedLocationName = () => {
    if (selectedLocationsState.length === 1) {
      return companyLocationList.find((x) => x._id === selectedLocationsState[0])?.name || '';
    }
    if (
      selectedLocationsState.length > 0 &&
      selectedLocationsState.length < companyLocationList.length
    ) {
      return `${selectedLocationsState.length} locations selected`;
    }
    if (selectedLocationsState.length === companyLocationList.length) {
      return 'All';
    }
    return 'None';
  };

  const renderFilterLocation = () => {
    const selectedLocationName = getSelectedLocationName();
    const locationOptions = companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
    return (
      <div className={styles.item}>
        <span className={styles.label}>Location</span>

        <CheckboxMenu
          options={locationOptions}
          onChange={onLocationChange}
          list={companyLocationList}
          default={selectedLocationsState}
        >
          <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
            <span>{selectedLocationName}</span>
            <img src={SmallDownArrow} alt="" />
          </div>
        </CheckboxMenu>
      </div>
    );
  };

  useEffect(() => {
    fetchLocation();
    return () => {
      dispatch({
        type: 'ticketManagement/save',
        payload: {
          selectedLocations: [],
        },
      });
    };
  }, []);

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
                  data={listOffAllTicket}
                  permissions={permissions}
                  tabName={tabName}
                />
              </TabPane>
              <TabPane tab="My Tickets" key="my-tickets">
                <MyTickets
                  role={role}
                  data={listOffAllTicket}
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
      listOffAllTicket = [],
      totalStatus = [],
      selectedLocations = [],
      isLocationLoaded = false,
    } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    employee,
    listOffAllTicket,
    totalStatus,
    companyLocationList,
    selectedLocations,
    isLocationLoaded,
  }),
)(EmployeeTicket);
