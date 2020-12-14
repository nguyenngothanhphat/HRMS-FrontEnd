import React, { PureComponent } from 'react';
import { Tabs, notification } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { history } from 'umi';
import EmployeeRole from './components/EmployeeRole';
import ManagerRole from './components/ManagerRole';
import SetupTimeoff from './components/SetupTimeoff';

import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOff extends PureComponent {
  viewActivityLog = () => {
    // eslint-disable-next-line no-alert
    alert('View activity logs');
  };

  componentDidMount = () => {
    const {
      location: { state: { status = '', tickedId = '', typeName = '' } = {} } = {},
    } = this.props;
    if (status === 'WITHDRAW') {
      notification.success({
        message: 'Time off request',
        description: `Time off request [Ticket id: ${tickedId}] [Type: ${typeName}] was withdrawn & deleted.`,
      });
      history.replace();
    }
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
          <Tabs defaultActiveKey="2" tabBarExtraContent={this.options()}>
            <TabPane tab="Timeoff" key="1">
              <EmployeeRole />
            </TabPane>
            <TabPane tab="Manager Timeoff" key="2">
              <ManagerRole />
            </TabPane>
            <TabPane tab="Setup Timeoff policy" key="3">
              <SetupTimeoff />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}
