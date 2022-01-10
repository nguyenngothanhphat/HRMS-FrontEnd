import React, { useState } from 'react';
import { connect } from 'umi';
import { Row } from 'antd';
import ShowAllApp from './components/ShowAllApp';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import TimesheetIcon from '@/assets/dashboard/timesheet.svg';
import TimeoffIcon from '@/assets/dashboard/timeoff.svg';
import DirectoryIcon from '@/assets/dashboard/directory.svg';
// import ExpensoIcon from '@/assets/dashboard/expenso.svg';
// import ReportIcon from '@/assets/dashboard/reports.svg';
// import TicketIcon from '@/assets/ticketManagement-assign.svg';

import styles from './index.less';
import AppCard from './components/AppCard';

const myApps = [
  {
    icon: TimesheetIcon,
    name: 'Timesheets',
  },
  {
    icon: TimeoffIcon,
    name: 'Timeoff',
  },
  {
    icon: DirectoryIcon,
    name: 'Directory',
  },
];

const listMyApps = myApps.slice(0, 6);

const MyApps = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <div className={styles.MyApps}>
      <div>
        <div className={styles.header}>
          <span>My Apps</span>
        </div>
        <div className={styles.content}>
          <Row gutter={[24, 24]}>
            {listMyApps.map((app) => (
              <AppCard app={app} />
            ))}
          </Row>
        </div>
      </div>
      <div className={styles.manageAppsBtn} onClick={() => setModalVisible(true)}>
        <span>Show all</span>
        <img src={LeftArrow} alt="expand" />
      </div>
      <ShowAllApp
        visible={modalVisible}
        title='My Apps'
        onClose={() => setModalVisible(false)}
        myApps={myApps}
      />
    </div>
  );
};

export default connect(() => ({}))(MyApps);
