import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import ManagerView from './components/ManagerView';
import MyTimeSheet from './components/MyTimeSheet';
import Settings from './components/Settings';
import styles from './index.less';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import ActionModal from '@/pages/TimeSheet/components/ActionModal';
import { TAB_NAME } from '@/utils/timeSheet';

const { TabPane } = Tabs;

const SimpleView = (props) => {
  const { permissions = {}, tabName = '', showMyTimeSheet = true } = props;
  const [navToTimeoffModalVisible, setNavToTimeoffModalVisible] = useState(false);

  const requestLeave = () => {
    history.push('/time-off/overview/personal-timeoff/new');
  };

  const options = () => {
    return (
      <div className={styles.requestLeave} onClick={() => setNavToTimeoffModalVisible(true)}>
        <span className={styles.title}>Request Leave</span>
      </div>
    );
  };

  // PERMISSION TO VIEW TABS
  // const viewMyTimesheet = permissions.viewMyTimesheet === 1;
  const viewReportTimesheet = permissions.viewReportTimesheet === 1;
  const viewSettingTimesheet = permissions.viewSettingTimesheet === 1;

  const getActiveKey = () => {
    if (showMyTimeSheet) return tabName || TAB_NAME.MY;
    if (viewReportTimesheet) return TAB_NAME.REPORTS;
    if (viewSettingTimesheet) return TAB_NAME.SETTINGS;
    return tabName;
  };

  useEffect(() => {
    if (!tabName) {
      if (showMyTimeSheet) {
        history.replace(`/time-sheet/${TAB_NAME.MY}`);
      } else {
        const temp = getActiveKey();
        history.replace(`/time-sheet/${temp}`);
      }
    }
  }, [tabName]);

  if (!tabName) return '';
  return (
    <div className={styles.SimpleView}>
      <PageContainer>
        <Tabs
          activeKey={tabName || TAB_NAME.MY}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/time-sheet/${key}`);
          }}
          destroyInactiveTabPane
        >
          {showMyTimeSheet && (
            <TabPane tab="My Timesheet" key={TAB_NAME.MY}>
              <MyTimeSheet />
            </TabPane>
          )}
          {viewReportTimesheet && (
            <TabPane tab="My Team" key={TAB_NAME.REPORTS}>
              <ManagerView />
            </TabPane>
          )}
          {viewSettingTimesheet && (
            <TabPane tab="Settings" key={TAB_NAME.SETTINGS}>
              <Settings />
            </TabPane>
          )}
        </Tabs>
        <ActionModal
          visible={navToTimeoffModalVisible}
          onClose={() => setNavToTimeoffModalVisible(false)}
          buttonText="Continue"
          width={400}
          onFinish={requestLeave}
        >
          <img src={ModalImage} alt="" />
          <span style={{ textAlign: 'center' }}>
            You are being taken to the timeoff page - your leave details will be automatically
            updated on the timesheet once it has been applied
          </span>
        </ActionModal>
      </PageContainer>
    </div>
  );
};

export default connect(({ user: { permissions = [] } = {} }) => ({ permissions }))(SimpleView);
