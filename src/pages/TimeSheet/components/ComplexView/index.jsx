import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
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
import { TAB_NAME } from '@/utils/timeSheet';

const { TabPane } = Tabs;

const ComplexView = (props) => {
  const { permissions = {}, tabName = '', showMyTimeSheet = true } = props;

  // from redirect page
  const { currentDateProp = '' } = props;

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
  // const viewReportTimesheet = permissions.viewReportTimesheet === 1;
  const viewHRReport = permissions.viewHRReportCVTimesheet === 1;
  const viewFinanceReport = permissions.viewFinanceReportCVTimesheet === 1;
  const viewPeopleManagerReport = permissions.viewPeopleManagerCVTimesheet === 1;
  const viewPMReport = permissions.viewProjectManagerCVTimesheet === 1;
  const viewSettingTimesheet = permissions.viewSettingTimesheet === 1;

  const getActiveKey = () => {
    if (showMyTimeSheet) return tabName || TAB_NAME.MY;
    if (viewHRReport) return TAB_NAME.HR_REPORTS;
    if (viewFinanceReport) return TAB_NAME.FINANCE_REPORTS;
    if (viewPeopleManagerReport || viewPMReport) return TAB_NAME.PM_REPORTS;
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

  const renderOtherTabs = () => {
    return (
      <>
        {viewHRReport && (
          <TabPane tab="Reports" key={TAB_NAME.HR_REPORTS}>
            <HumanResourceReport />
          </TabPane>
        )}
        {viewFinanceReport && (
          <TabPane tab="Reports" key={TAB_NAME.FINANCE_REPORTS}>
            <FinanceReport />
          </TabPane>
        )}
        {(viewPeopleManagerReport || viewPMReport) && (
          <TabPane tab="My Projects" key={TAB_NAME.PM_REPORTS}>
            <ManagerReport />
          </TabPane>
        )}

        {viewSettingTimesheet && (
          <TabPane tab="Settings" key={TAB_NAME.SETTINGS}>
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
          activeKey={tabName || TAB_NAME.MY}
          tabBarExtraContent={options()}
          onChange={(key) => {
            history.push(`/time-sheet/${key}`);
          }}
          destroyInactiveTabPane
        >
          {showMyTimeSheet && (
            <TabPane tab="My Timesheet" key={TAB_NAME.MY}>
              <MyTimeSheet currentDateProp={currentDateProp} />
            </TabPane>
          )}
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
