import { Checkbox, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import CommonModal from '@/components/CommonModal';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentLocation } from '@/utils/authority';
import { TAB_NAME } from '@/utils/timeSheet';
import FinanceReport from './components/FinanceReport';
import HumanResourceReport from './components/HumanResourceReport';
import ManagerReport from './components/ManagerReport';
import MyTimeSheet from './components/MyTimeSheet';
import Settings from './components/Settings';
import styles from './index.less';

const { TabPane } = Tabs;

const ComplexView = (props) => {
  const {
    permissions = {},
    tabName = '',
    showMyTimeSheet = true,
    companyLocationList = [],
    timeSheet: { divisionList = [] } = {},
    currentDateProp = '',
    dispatch,
  } = props;

  const [navToTimeoffModalVisible, setNavToTimeoffModalVisible] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedLocations, setSelectedLocation] = useState([getCurrentLocation()]);
  const [isIncompleteTimeSheet, setIsIncompleteTimeSheet] = useState(false);

  // PERMISSIONS TO VIEW LOCATION
  const viewLocationHR = permissions.viewLocationHRTimesheet === 1;
  const viewLocationFinance = permissions.viewLocationFinanceTimesheet === 1;

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

  const renderLocationOptions = () => {
    const locationUser = companyLocationList
      .filter((x) => {
        return x._id === getCurrentLocation();
      })
      .map((x) => {
        return {
          _id: x._id,
          name: x.name,
        };
      });

    const locationOptions = companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });

    if (
      (tabName === TAB_NAME.HR_REPORTS && viewLocationHR) ||
      (tabName === TAB_NAME.FINANCE_REPORTS && viewLocationFinance)
    ) {
      return locationOptions;
    }
    return locationUser;
  };

  const renderDivisionOptions = () => {
    const viewDivisionHR = permissions.viewDivisionHRTimesheet === 1;
    const viewDivisionFinance = permissions.viewDivisionFinanceTimesheet === 1;

    if (tabName === TAB_NAME.HR_REPORTS && viewDivisionHR) {
      return true;
    }
    if (tabName === TAB_NAME.FINANCE_REPORTS && viewDivisionFinance) {
      return true;
    }
    return false;
  };

  const renderFilterBar = (isHRTab) => {
    // if only one selected
    const divisionOptions = divisionList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
    return (
      <div className={styles.options}>
        {isHRTab && (
          <div className={styles.item}>
            <Checkbox checked={isIncompleteTimeSheet} onChange={onChangeIncompleteTimeSheet}>
              Incomplete Timesheets
            </Checkbox>
          </div>
        )}
        <CustomDropdownSelector
          options={renderLocationOptions()}
          onChange={onLocationChange}
          disabled={renderLocationOptions().length < 2}
          selectedList={selectedLocations}
          label="Location"
        />

        {renderDivisionOptions() && (
          <CustomDropdownSelector
            options={divisionOptions}
            onChange={onDivisionChange}
            disabled
            label="Division"
            selectedList={selectedDivisions}
          />
        )}
      </div>
    );
  };

  const options = () => {
    switch (tabName) {
      case TAB_NAME.HR_REPORTS:
        return renderFilterBar(true);

      case TAB_NAME.FINANCE_REPORTS:
        return renderFilterBar();

      case TAB_NAME.MY:
        return (
          <div className={styles.options}>
            <CustomBlueButton
              onClick={() => setNavToTimeoffModalVisible(true)}
              title="Request Leave"
            />
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
    // clear filter state in HR & Project view
    dispatch({
      type: 'timeSheet/save',
      payload: {
        employeeNameList: [],
      },
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
    if (
      divisionList.length === 0 &&
      [TAB_NAME.HR_REPORTS, TAB_NAME.FINANCE_REPORTS].includes(tabName)
    ) {
      dispatch({
        type: 'timeSheet/fetchDivisionListEffect',
        payload: {
          name: 'Engineering',
        },
      });
    }
    dispatch({
      type: 'timeSheet/getEmployeeScheduleByLocation',
      payload: { location: getCurrentLocation() },
    });
  }, [tabName]);

  const renderOtherTabs = () => {
    return (
      <>
        {viewHRReport && (
          <TabPane tab="HR Reports" key={TAB_NAME.HR_REPORTS}>
            <HumanResourceReport />
          </TabPane>
        )}
        {viewFinanceReport && (
          <TabPane tab="Finance Reports" key={TAB_NAME.FINANCE_REPORTS}>
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
        <CommonModal
          visible={navToTimeoffModalVisible}
          onClose={() => setNavToTimeoffModalVisible(false)}
          firstText="Continue"
          width={400}
          onFinish={requestLeave}
          hasHeader={false}
          content={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 24,
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src={ModalImage} alt="" />
              <span style={{ textAlign: 'center' }}>
                You are being taken to the timeoff page - your leave details will be automatically
                updated on the timesheet once it has been applied
              </span>
            </div>
          }
        />
      </PageContainer>
    </div>
  );
};

export default connect(
  ({
    user: { currentUser = {}, permissions = [] } = {},
    location: { companyLocationList = [] },
    timeSheet,
  }) => ({
    currentUser,
    permissions,
    companyLocationList,
    timeSheet,
  }),
)(ComplexView);
