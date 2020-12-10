import React, { PureComponent } from 'react';
import { Tabs, notification } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import EmployeeRole from './components/EmployeeRole';
import SetupTimeoff from './components/SetupTimeoff';
import { history } from 'umi';

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
          <Tabs defaultActiveKey="langdingPage" tabBarExtraContent={this.options()}>
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
