import React, { useEffect } from 'react';
import { history, connect } from 'umi';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import MyTimeSheet from './components/MyTimeSheet';
import ManagerView from './components/ManagerView';
import Settings from './components/Settings';

const { TabPane } = Tabs;

const TimeSheet = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    permissions = {},
    dispatch,
    // location: { state: { status = '', tickedId = '', typeName = '', category = '' } = {} } = {},
  } = props;

  useEffect(() => {
    if (!tabName) {
      history.replace(`/time-sheet/my`);
    }
  }, [tabName]);

  // clear state when unmounting
  useEffect(() => {
    return () => {
      dispatch({
        type: 'timeSheet/clearState',
      });
    };
  }, []);

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
    <div className={styles.TimeSheet}>
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

export default connect(({ user: { permissions = [] } = {} }) => ({ permissions }))(TimeSheet);
