import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import EmployeeRole from './components/EmployeeRole';
import SetupTimeoff from './components/SetupTimeoff';

// import styles from './index.less';

const { TabPane } = Tabs;
export default class TimeOff extends PureComponent {
  render() {
    return (
      <div>
        <PageContainer>
          <Tabs defaultActiveKey="setupTimeOff">
            <TabPane tab="Time Off" key="langdingPage">
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
