import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TicketQueue from './components/TicketQueue';
import MyTickets from './components/MyTickets';
import CheckboxMenu from '@/components/CheckboxMenu';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import { getAuthority, getCurrentLocation } from '@/utils/authority';
import styles from './index.less';

const EmployeeTicket = (props) => {
  const { TabPane } = Tabs;

  const {
    dispatch,
    selectedLocations = [],
    employee: {
      _id = '',
      departmentInfo: { _id: idDepart = '' },
      location: { headQuarterAddress: { country = '' } = {} } = {},
    } = {},
    companyLocationList = [],
    listOffAllTicket = [],
    totalList = [],
    tabName = '',
  } = props;

  const [selectedLocationsState, setSelectedLocationsState] = useState([getCurrentLocation()]);

  const fetchLocation = () => {
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  const fetchListAllTicket = (status) => {
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));

    let payload = {
      status: [status],
      location: selectedLocations,
    };
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
      };
    }

    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload,
    });
  };

  // const fetchListEmployee = (departmentNameList) => {
  //   dispatch({
  //     type: 'ticketManagement/fetchListEmployee',
  //     payload: {
  //       department: departmentNameList,
  //       status: 'ACTIVE',
  //     },
  //   });
  // };

  const fetchTotalList = () => {
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
    let payload = {
      employeeAssignee: _id,
      departmentAssign: idDepart,
      location: selectedLocations,
    };
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload,
    });
  };

  const handleChangeTable = (key) => {
    history.push(`/ticket-management/${key}`);
    if (key === 'ticket-queue') {
      fetchListAllTicket('New');
    } else {
      fetchListAllTicket('Assigned');
    }
    fetchTotalList();
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
    if (!tabName) {
      history.replace(`/ticket-management/ticket-queue`);
    }
    fetchLocation();
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
          activeKey={tabName || 'ticket-queue'}
          onChange={(key) => {
            handleChangeTable(key);
          }}
          destroyInactiveTabPane
          tabBarExtraContent={renderFilterLocation()}
        >
          <TabPane tab="Ticket Queue" key="ticket-queue">
            <TicketQueue data={listOffAllTicket} countData={totalList} />
          </TabPane>
          <TabPane tab="My Tickets" key="my-tickets">
            <MyTickets data={listOffAllTicket} countData={totalList} />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(
  ({
    ticketManagement: { listOffAllTicket = [], totalList = [], selectedLocations = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    employee,
    listOffAllTicket,
    totalList,
    companyLocationList,
    selectedLocations,
  }),
)(EmployeeTicket);
