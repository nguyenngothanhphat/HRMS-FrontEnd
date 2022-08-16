import { Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import moment from 'moment';
import Resources from './components/Resources';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import styles from './index.less';
import TeamLeaveCalendar from './components/TeamLeaveCalendar';
import SmallRightArrow from '@/assets/dashboard/smallRightArrow.svg';
import SmallLeftArrow from '@/assets/dashboard/smallLeftArrow.svg';
import { getCurrentTenant } from '@/utils/authority';

const { TabPane } = Tabs;
const HR_MANAGER = 'HR-MANAGER';
const MANAGER = 'MANAGER';

const dateFormat = 'MMM YYYY';
const MyTeam = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const {
    dispatch,
    myTeam = [],
    roles = [],
    // companyLocationList = [],
    // employee: { departmentInfo: { name: departmentName = '' } = {} } = {},
    employee = {},
    timeOffTypesByCountry = [],
  } = props;
  const checkLocation = employee ? employee.location : {};
  const country = checkLocation ? employee?.location?.headQuarterAddress?.country : '';

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchTimeOffTypesByCountry',
      payload: {
        country,
      },
    });
  }, []);

  // USE EFFECT
  // useEffect(() => {
  //   // refresh data by month here
  // }, [selectedMonth]);

  useEffect(() => {
    // const roleEmployee = employee && employee?.title ? employee.title.roles : [];
    const employeeId = employee ? employee._id : '';
    const companyInfo = employee ? employee.company : {};
    dispatch({
      type: 'dashboard/fetchMyTeam',
      payload: {
        tenantId: getCurrentTenant(),
        // company: getCurrentCompany(),
        // department: [departmentName],
        // location: companyLocationList.map((l) => l._id),
        roles,
        employee: employeeId,
        status: ['ACTIVE'],
        company: [companyInfo],
      },
    });
  }, []);
  // CHECK ROLE
  const checkRoleHrAndManager = roles.includes(HR_MANAGER) || roles.includes(MANAGER);

  // FUNCTION
  const onViewTimeoff = () => {
    history.push('/time-off/overview');
  };

  // TEAM LEAVE REQUEST
  const onPreviousMonth = () => {
    setSelectedMonth(moment(selectedMonth).add(-1, 'months'));
  };

  const onNextMonth = () => {
    setSelectedMonth(moment(selectedMonth).add(1, 'months'));
  };

  const renderTeamLeaveRequestAction = () => {
    return (
      <div className={styles.header__actions}>
        <img src={SmallLeftArrow} alt="" onClick={onPreviousMonth} />
        <span>{moment(selectedMonth, dateFormat).locale('en').format(dateFormat)}</span>
        <img src={SmallRightArrow} alt="" onClick={onNextMonth} />
      </div>
    );
  };
  // const filterListTimeOffType = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'A');
  const listTimeOffType = timeOffTypesByCountry.map((item) => item._id);
  return (
    <div className={styles.MyTeam}>
      <div>
        <div className={styles.header}>
          <span className={styles.header__headerText}>My Team</span>
          {activeKey === '2' && renderTeamLeaveRequestAction()}
        </div>
        <div className={styles.content}>
          <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
            <TabPane tab="Members" key="1">
              <Resources data={myTeam} />
            </TabPane>
            {checkRoleHrAndManager ? (
              <TabPane tab="Team Leave Calendar" key="2">
                <TeamLeaveCalendar
                  selectedMonth={selectedMonth}
                  listTimeOffType={listTimeOffType}
                />
              </TabPane>
            ) : (
              ''
            )}
          </Tabs>
        </div>
      </div>
      {activeKey === '2' && listTimeOffType.length > 0 && (
        <div className={styles.viewAllBtn} onClick={onViewTimeoff}>
          <span>View all Time off</span>
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
    </div>
  );
};

export default connect(
  ({
    dashboard: { myTeam = [], timeOffTypesByCountry = [] } = {},
    location: { companyLocationList = [] } = {},
    user: { currentUser: { roles = [], employee = {} } = {} } = {},
  }) => ({
    roles,
    employee,
    myTeam,
    companyLocationList,
    timeOffTypesByCountry,
  }),
)(MyTeam);
