import { Tabs } from 'antd';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import { PageContainer } from '@/layouts/layout/src';
import ActionModal from '@/pages/TimeSheet/components/ActionModal';
import ManagerReport from './components/ManagerReport';
import HumanResourceReport from './components/HumanResourceReport';
import FinanceReport from './components/FinanceReport';
import MyTimeSheet from './components/MyTimeSheet';
import Settings from './components/Settings';
import styles from './index.less';

const { TabPane } = Tabs;

const ComplexView = (props) => {
  const { permissions = {}, tabName = '', currentUserRoles = [] } = props;

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
    const mainTabs = () => {
      if (
        currentUserRoles.some((r) => ['people-manager', 'project-manager', 'manager'].includes(r))
      )
        return <ManagerReport />;
      if (currentUserRoles.some((r) => ['hr-manager'].includes(r))) return <HumanResourceReport />;
      if (currentUserRoles.some((r) => ['finance'].includes(r))) return <FinanceReport />;
      return '';
    };
    return (
      <>
        {viewReportTimesheet && (
          <TabPane tab="Reports" key="reports">
            {mainTabs()}
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

  if (!tabName) return '';
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
  ({ user: { currentUser = {}, permissions = [], currentUserRoles = [] } = {} }) => ({
    currentUser,
    permissions,
    currentUserRoles,
  }),
)(ComplexView);
