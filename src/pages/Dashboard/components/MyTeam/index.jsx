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
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const { TabPane } = Tabs;

const dateFormat = 'MMM YYYY';
const MyTeam = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const {
    dispatch,
    myTeam = [],
    listLocationsByCompany = [],
    employee: { departmentInfo: { name: departmentName = '' } = {} } = {},
  } = props;

  // USE EFFECT
  useEffect(() => {
    // refresh data by month here
  }, [selectedMonth]);

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchMyTeam',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        department: [departmentName],
        location: listLocationsByCompany.map((l) => l._id),
      },
    });
  }, []);

  // FUNCTION
  const onViewTimeoff = () => {
    history.push('/timeoff');
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

  return (
    <div className={styles.MyTeam}>
      <div>
        <div className={styles.header}>
          <span className={styles.header__headerText}>My Team</span>
          {activeKey === '2' && renderTeamLeaveRequestAction()}
        </div>
        <div className={styles.content}>
          <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
            <TabPane tab="Resources" key="1">
              <Resources data={myTeam} />
            </TabPane>
            <TabPane tab="Team Leave Calendar" key="2">
              <TeamLeaveCalendar selectedMonth={selectedMonth} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      {activeKey === '2' && (
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
    dashboard: { myTeam = [] } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    employee,
    myTeam,
    listLocationsByCompany,
  }),
)(MyTeam);
