import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import CalendarIcon from '@/assets/calendar_icon.svg';
import ListIcon from '@/assets/list_icon.svg';
import Holiday from './components/Holiday';
import LeaveHistory from './components/LeaveHistory';
import styles from './index.less';

const { TabPane } = Tabs;

export default class LeaveHistoryAndHoliday extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeShowType: 1, // 1: list, 2: calendar
    };
  }

  handleSelectShowType = (value) => {
    this.setState({
      activeShowType: value,
    });
  };

  operations = () => {
    const { activeShowType } = this.state;
    return (
      <div className={styles.menu}>
        <img
          src={ListIcon}
          className={activeShowType === 1 ? styles.activeShowType : ''}
          onClick={() => this.handleSelectShowType(1)}
          alt="list"
        />
        <img
          src={CalendarIcon}
          className={activeShowType === 2 ? styles.activeShowType : ''}
          onClick={() => this.handleSelectShowType(2)}
          alt="calendar"
        />
      </div>
    );
  };

  render() {
    const { activeShowType } = this.state;
    return (
      <div className={styles.LeaveHistoryAndHoliday}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
          <TabPane tab="Request History" key="1">
            <LeaveHistory />
          </TabPane>
          <TabPane tab="Holiday" key="2">
            {activeShowType === 1 ? <Holiday /> : ''}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
