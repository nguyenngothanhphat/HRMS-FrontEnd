import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import MyTeam from './components/MyTeam';
import MyCalendar from './components/MyCalendar';
import MyTicket from './components/MyTicket';
import { getCurrentTenant } from '@/utils/authority';

const { TabPane } = Tabs;

const TAB_NAME = {
  MY_TEAM: 'my-team',
  MY_TICKETS: 'my-tickets',
  MY_CALENDAR: 'my-calendar',
};
const statusRequestTimeoff = ['IN-PROGRESS'];
const statusTickets = ['New', 'Assigned', 'In Progress', 'Client Pending'];

const MyInformation = (props) => {
  const {
    dispatch,
    dashboard: {
      status = '',
      statusApproval = '',
      googleCalendarList = [],
      myTeam = [],
      listMyTicket = [],
      leaveRequests = [],
    } = {},
    currentUser: { employee, employee: { _id = '' } = {} } = {},
  } = props;

  const [activeKey, setActiveKey] = useState(TAB_NAME.MY_CALENDAR);
  const [total, setTotal] = useState({
    [TAB_NAME.MY_CALENDAR]: 0,
    [TAB_NAME.MY_TEAM]: 0,
    [TAB_NAME.MY_TICKETS]: 0,
  });
  const [myTickets, setMyTickets] = useState([]);

  // USE EFFECT
  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListTicket',
    });
  }, [statusApproval]);

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchListMyTicket',
    });
  }, [status]);

  useEffect(() => {
    const roleEmployee = employee && employee?.title ? employee.title.roles : [];
    const employeeId = employee ? employee._id : '';
    const companyInfo = employee ? employee.company : {};
    dispatch({
      type: 'dashboard/fetchMyTeam',
      payload: {
        tenantId: getCurrentTenant(),
        roles: roleEmployee,
        employee: employeeId,
        status: ['ACTIVE'],
        company: [companyInfo],
      },
    });
    dispatch({
      type: 'dashboard/fetchMyLeaveRequest',
      payload: {
        status: ['IN-PROGRESS'],
      },
    });
  }, []);

  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const getMyTickets = () => {
    let list = [];

    // tickets
    const tempTicket = listMyTicket.filter((val) => {
      return val.employee_raise === _id;
    });

    list = tempTicket.filter((element) => statusTickets.includes(element.status));

    // leave requests
    const tempLeaveRequest = leaveRequests.filter((element) =>
      statusRequestTimeoff.includes(element.status),
    );

    tempLeaveRequest.forEach((element) => {
      list.push(element);
    });

    return list;
  };

  useEffect(() => {
    const tempTotal = {
      [TAB_NAME.MY_CALENDAR]: googleCalendarList.length,
      [TAB_NAME.MY_TEAM]: myTeam.length,
      [TAB_NAME.MY_TICKETS]: myTickets.length,
    };
    setTotal(tempTotal);
  }, [JSON.stringify(myTeam), JSON.stringify(myTickets), JSON.stringify(googleCalendarList)]);

  useEffect(() => {
    setMyTickets(getMyTickets());
  }, [JSON.stringify(listMyTicket), JSON.stringify(leaveRequests)]);

  const getTabName = (key) => {
    switch (key) {
      case TAB_NAME.MY_TEAM:
        return `My Team (${addZeroToNumber(total[TAB_NAME.MY_TEAM])})`;
      case TAB_NAME.MY_TICKETS:
        return `My Tickets (${addZeroToNumber(total[TAB_NAME.MY_TICKETS])})`;
      case TAB_NAME.MY_CALENDAR:
        return `My Calendar (${addZeroToNumber(total[TAB_NAME.MY_CALENDAR])})`;

      default:
        return '';
    }
  };

  return (
    <div className={styles.MyInformation}>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab={getTabName(TAB_NAME.MY_CALENDAR)} key={TAB_NAME.MY_CALENDAR}>
          <MyCalendar />
        </TabPane>
        <TabPane tab={getTabName(TAB_NAME.MY_TEAM)} key={TAB_NAME.MY_TEAM}>
          <MyTeam />
        </TabPane>
        <TabPane tab={getTabName(TAB_NAME.MY_TICKETS)} key={TAB_NAME.MY_TICKETS}>
          <MyTicket data={myTickets} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ dashboard, user: { currentUser = {} } = {} }) => ({
  dashboard,
  currentUser,
}))(MyInformation);
