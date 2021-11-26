import { Tabs } from 'antd';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import { PageContainer } from '@/layouts/layout/src';
import ActionModal from '@/pages/TimeSheet/components/ActionModal';
import ManagerReport from './components/PopoverProfiles';
import HumanResourceReport from './components/HumanResourceReport';
import FinanceReport from './components/FinanceReport';
import MyTimeSheet from './components/MyTimeSheet';
import Settings from './components/Settings';
import styles from './index.less';

const { TabPane } = Tabs;

const ComplexView = (props) => {
  const { permissions = {}, tabName = '', currentUserRole = '' } = props;

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

  const renderOtherTabs = () => {
    const visible = currentUserRole !== 'employee';
    return (
      <>
        {visible && viewReportTimesheet && (
          <TabPane tab="Reports" key="reports">
            {['people-manager', 'project-manager', 'manager'].includes(currentUserRole) && (
              <ManagerReport />
            )}
            {['hr-manager'].includes(currentUserRole) && <HumanResourceReport />}
            {['finance'].includes(currentUserRole) && <FinanceReport />}
          </TabPane>
        )}
        {viewSettingTimesheet && (
          <TabPane tab="Settings" key="settings">
            <Settings />
          </TabPane>
        )}
      </>
    );
  };

  return (
    <div className={styles.ComplexView}>
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
          {renderOtherTabs()}
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

export default connect(
  ({
    timeSheet: { currentUserRole = '' } = {},
    user: { currentUser = {}, permissions = [] } = {},
  }) => ({
    currentUser,
    permissions,
    currentUserRole,
  }),
)(ComplexView);
