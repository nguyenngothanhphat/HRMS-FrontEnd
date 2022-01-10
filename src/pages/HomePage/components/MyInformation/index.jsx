import React, { useState } from 'react';
import { Tabs } from 'antd';
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

const MyInformation = () => {
  const [activeKey, setActiveKey] = useState(TAB_NAME.MY_TEAM);

  const getTabName = (key) => {
    switch (key) {
      case TAB_NAME.MY_TEAM:
        return 'My Team';
      case TAB_NAME.MY_TICKETS:
        return 'My Tickets';
      case TAB_NAME.MY_CALENDAR:
        return 'My Calendar';

      default:
        return '';
    }
  };

  return (
    <div className={styles.MyInformation}>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
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

export default MyInformation;
