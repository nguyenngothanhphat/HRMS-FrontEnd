import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import EmployeeRole from './components/EmployeeRole';
import SetupTimeoff from './components/SetupTimeoff';

import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOff extends PureComponent {
  viewActivityLog = () => {
    // eslint-disable-next-line no-alert
    alert('View activity logs');
  };

  options = () => {
    return (
      <div className={styles.viewActivityLog} onClick={this.viewActivityLog}>
        <span className={styles.title}>View Activity logs (15)</span>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.TimeOff}>
        <PageContainer>
          <Tabs defaultActiveKey="setupTimeOff" tabBarExtraContent={this.options()}>
            <TabPane tab="Timeoff" key="langdingPage">
              <EmployeeRole />
            </TabPane>
            <TabPane tab="Setup Timeoff policy" key="setupTimeOff">
              <SetupTimeoff />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}
