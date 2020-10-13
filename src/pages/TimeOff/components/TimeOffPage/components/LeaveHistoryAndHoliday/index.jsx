import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import CalendarIcon from '@/assets/calendar_icon.svg';
import ListIcon from '@/assets/list_icon.svg';
import styles from './index.less';

const { TabPane } = Tabs;

export default class LeaveHistoryAndHoliday extends PureComponent {
  operations = () => (
    <div className={styles.menu}>
      <img src={ListIcon} alt="list" />
      <img src={CalendarIcon} alt="calendar" />
    </div>
  );

  render() {
    return (
      <div className={styles.LeaveHistoryAndHoliday}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab=" Request History" key="1">
            Request History
          </TabPane>
          <TabPane tab="Holiday" key="2">
            Holiday
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
