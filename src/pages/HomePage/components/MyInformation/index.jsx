import React, { useState } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import MyTeam from './components/MyTeam';
import MyCalendar from './components/MyCalendar';
import MyTicket from './components/MyTicket';

const { TabPane } = Tabs;

const TAB_NAME = {
  MY_TEAM: 'my-team',
  MY_TICKETS: 'my-tickets',
  MY_CALENDAR: 'my-calendar',
};

const statusTickets = ['New', 'Assigned', 'In Progress', 'Client Pending'];

const MyInformation = (props) => {
  const {
    dashboard: {
      googleCalendarList = [],
      myTeam = [],
      listMyTicket = [],
      currentUser: { employee: { _id = '' } = {} } = {},
    } = {},
  } = props;

  const [activeKey, setActiveKey] = useState(TAB_NAME.MY_TEAM);

  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const getMyTickets = () => {
    const listMyTicketNew =
      listMyTicket.length > 0
        ? listMyTicket.filter((val) => {
            return val.employee_raise === _id;
          })
        : [];
    return listMyTicketNew.filter((element) => statusTickets.includes(element.status));
  };

  const getTabName = (key) => {
    switch (key) {
      case TAB_NAME.MY_TEAM:
        return `My Team (${addZeroToNumber(myTeam.length)})`;
      case TAB_NAME.MY_TICKETS:
        return `My Tickets (${addZeroToNumber(getMyTickets().length)})`;
      case TAB_NAME.MY_CALENDAR:
        return `My Calendar (${addZeroToNumber(googleCalendarList.length)})`;

      default:
        return '';
    }
  };

  return (
    <div className={styles.MyInformation}>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} destroyInactiveTabPane>
        <TabPane tab={getTabName(TAB_NAME.MY_TEAM)} key={TAB_NAME.MY_TEAM}>
          <MyTeam />
        </TabPane>
        <TabPane tab={getTabName(TAB_NAME.MY_CALENDAR)} key={TAB_NAME.MY_CALENDAR}>
          <MyCalendar />
        </TabPane>
        <TabPane tab={getTabName(TAB_NAME.MY_TICKETS)} key={TAB_NAME.MY_TICKETS}>
          <MyTicket />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ dashboard, user: { currentUser = {} } = {} }) => ({
  dashboard,

  currentUser,
}))(MyInformation);
