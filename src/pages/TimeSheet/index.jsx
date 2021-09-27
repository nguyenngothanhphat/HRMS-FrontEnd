import React from 'react';
import { history, connect } from 'umi';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import MyTimeSheet from './components/MyTimeSheet';

const { TabPane } = Tabs;

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    // location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
  } = props;

  const requestLeave = () => {
    history.push('/time-off/overview/personal-timeoff/new');
  };

  const options = () => {
    return (
      <div className={styles.requestLeave} onClick={requestLeave}>
        <span className={styles.title}>Request Leave</span>
      </div>
    );
  };

  return (
    <div className={styles.TimeSheet}>
      <PageContainer>
        <Tabs
          activeKey={tabName || 'overview'}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/timesheet/${key}`);
          }}
        >
          <TabPane tab="My timesheet" key="overview">
            <MyTimeSheet />
          </TabPane>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(() => ({}))(TimeSheet);
