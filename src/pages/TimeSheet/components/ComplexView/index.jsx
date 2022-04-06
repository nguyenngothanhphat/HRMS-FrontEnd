import { Tabs, Checkbox } from 'antd';
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
import CheckboxMenu from './components/CheckboxMenu';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';

const { TabPane } = Tabs;

const ComplexView = (props) => {
  const {
    permissions = {},
    tabName = '',
    showMyTimeSheet = true,
    listLocationsByCompany = [],
    timeSheet: { divisionList = [] } = {},
    currentDateProp = '',
    dispatch,
  } = props;

  const [navToTimeoffModalVisible, setNavToTimeoffModalVisible] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedLocations, setSelectedLocation] = useState([]);
  const [isIncompleteTimeSheet, setIsIncompleteTimeSheet] = useState(false);

  const requestLeave = () => {
    history.push('/time-off/overview/personal-timeoff/new');
  };

  const onLocationChange = (selection) => {
    dispatch({
      type: 'timeSheet/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    setSelectedLocation([...selection]);
  };

  const onDivisionChange = (selection) => {
    dispatch({
      type: 'timeSheet/save',
      payload: {
        selectedDivisions: [...selection],
      },
    });
    setSelectedDivisions([...selection]);
  };

  const getSelectedLocationName = () => {
    if (selectedLocations.length === 1) {
      return listLocationsByCompany.find((x) => x._id === selectedLocations[0])?.name || '';
    }
    if (selectedLocations.length > 0 && selectedLocations.length < listLocationsByCompany.length) {
      return `${selectedLocations.length} locations selected`;
    }
    if (
      selectedLocations.length === listLocationsByCompany.length ||
      selectedLocations.length === 0
    ) {
      return 'All';
    }
    return 'All';
  };

  const getSelectedDivisionName = () => {
    if (selectedDivisions.length === 1) {
      return selectedDivisions[0] || '';
    }
    if (selectedDivisions.length > 0 && selectedDivisions.length < divisionList.length) {
      return `${selectedDivisions.length} divisions selected`;
    }
    if (selectedDivisions.length === divisionList.length || selectedDivisions.length === 0) {
      return 'All';
    }
    return 'All';
  };

  const onChangeIncompleteTimeSheet = (e) => {
    const value = e.target.checked;
    setIsIncompleteTimeSheet(value);
    dispatch({
      type: 'timeSheet/save',
      payload: {
        isIncompleteTimesheet: value,
      },
    });
  };

  const renderActionButton = () => {
    // if only one selected
    const selectedLocationName = getSelectedLocationName();
    const selectedDivisionName = getSelectedDivisionName();

    const divisionOptions = divisionList.map((x) => {
      return {
        _id: x.name,
        name: x.name,
      };
    });
    const locationOptions = listLocationsByCompany.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
    return (
      <div className={styles.options}>
        <div className={styles.item}>
          <Checkbox checked={isIncompleteTimeSheet} onChange={onChangeIncompleteTimeSheet}>
            Incomplete Timesheets
          </Checkbox>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Location</span>

          <CheckboxMenu
            options={locationOptions}
            onChange={onLocationChange}
            list={listLocationsByCompany}
            default={selectedLocations}
          >
            <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
              <span>{selectedLocationName}</span>
              <img src={SmallDownArrow} alt="" />
            </div>
          </CheckboxMenu>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Division</span>

          <CheckboxMenu
            options={divisionOptions}
            onChange={onDivisionChange}
            default={selectedDivisions}
          >
            <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
              <span>{selectedDivisionName}</span>
              <img src={SmallDownArrow} alt="" />
            </div>
          </CheckboxMenu>
        </div>
      </div>
    );
  };

  const options = () => {
    switch (tabName) {
      case TAB_NAME.HR_REPORTS:
        return renderActionButton();
      case TAB_NAME.MY:
        return (
          <div className={styles.requestLeave} onClick={() => setNavToTimeoffModalVisible(true)}>
            <span className={styles.title}>Request Leave</span>
          </div>
        );

      default:
        return '';
    }
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
    dispatch({
      type: 'timeSheet/clearState',
    });
    if (!tabName) {
      if (showMyTimeSheet) {
        history.replace(`/time-sheet/${TAB_NAME.MY}`);
      } else {
        const temp = getActiveKey();
        history.replace(`/time-sheet/${temp}`);
      }
      return;
    }
    if (tabName === TAB_NAME.HR_REPORTS) {
      dispatch({
        type: 'timeSheet/fetchDivisionListEffect',
        payload: {
          name: 'Engineering',
        },
      });
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
  ({
    user: { currentUser = {}, permissions = [] } = {},
    locationSelection: { listLocationsByCompany = [] },
    timeSheet,
  }) => ({
    currentUser,
    permissions,
    listLocationsByCompany,
    timeSheet,
  }),
)(ComplexView);
