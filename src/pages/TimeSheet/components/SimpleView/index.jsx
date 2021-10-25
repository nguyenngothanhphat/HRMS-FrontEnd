import { Tabs } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ManagerView from './components/ManagerView';
import MyTimeSheet from './components/MyTimeSheet';
import Settings from './components/Settings';
import styles from './index.less';

const { TabPane } = Tabs;

const SimpleView = (props) => {
  const { permissions = {}, tabName = '' } = props;

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

  // PERMISSION TO VIEW TABS
  // const viewMyTimesheet = permissions.viewMyTimesheet === 1;
  const viewManagerTimesheet = permissions.viewManagerTimesheet === 1;
  const viewSettingTimesheet = permissions.viewSettingTimesheet === 1;

  return (
    <div className={styles.SimpleView}>
      <PageContainer>
        <Tabs
          activeKey={tabName || 'my'}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/time-sheet/${key}`);
          }}
          destroyInactiveTabPane
        >
          <TabPane tab="My time sheet" key="my">
            <MyTimeSheet />
          </TabPane>
          {viewManagerTimesheet && (
            <TabPane tab="Reports" key="reports">
              <ManagerView />
            </TabPane>
          )}
          {viewSettingTimesheet && (
            <TabPane tab="Settings" key="settings">
              <Settings />
            </TabPane>
          )}
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default connect(({ user: { permissions = [] } = {} }) => ({ permissions }))(SimpleView);
