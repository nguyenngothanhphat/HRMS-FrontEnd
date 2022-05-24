import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import CheckboxMenu from '@/components/CheckboxMenu';
import AllTicket from './components/AllTickets';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';
import { getCurrentLocation } from '@/utils/authority';

const ManagerTicket = (props) => {
  const { TabPane } = Tabs;
  const { dispatch, tabName = '', companyLocationList = [], permissions = [] } = props;

  const [selectedLocationsState, setSelectedLocationsState] = useState([getCurrentLocation()]);

  const fetchLocationList = () => {
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
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
    if (!tabName) {
      history.replace(`/ticket-management/all-tickets`);
    }
    fetchLocationList();

    return () => {
      dispatch({
        type: 'ticketManagement/save',
        payload: {
          selectedLocations: [getCurrentLocation()],
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
          <TabPane tab="Overview" key="overview">
            <WorkInProgress />;
          </TabPane>
          <TabPane tab="All Tickets" key="all-tickets">
            <AllTicket permissions={permissions} />
          </TabPane>
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

    ticketManagement: { listOffAllTicket = [], totalList = [], selectedLocations = [] } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    country,
    companyLocationList,
    locationId,
    selectedLocations,
  }),
)(ManagerTicket);
