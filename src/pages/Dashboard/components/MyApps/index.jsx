import React from 'react';
import { connect } from 'umi';
import { Row } from 'antd';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import TimesheetIcon from '@/assets/dashboard/timesheet.svg';
import TimeoffIcon from '@/assets/dashboard/timeoff.svg';
import DirectoryIcon from '@/assets/dashboard/directory.svg';
import ExpensoIcon from '@/assets/dashboard/expenso.svg';
import ReportIcon from '@/assets/dashboard/reports.svg';

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
  {
    icon: ExpensoIcon,
    name: 'Expenso',
  },
  {
    icon: ReportIcon,
    name: 'Reports',
  },
];

const MyApps = () => {
  return (
    <div className={styles.MyApps}>
      <div>
        <div className={styles.header}>
          <span>My Apps</span>
        </div>
        <div className={styles.content}>
          <Row gutter={[24, 24]}>
            {myApps.map((app) => (
              <AppCard app={app} />
            ))}
          </Row>
        </div>
      </div>
      <div className={styles.manageAppsBtn}>
        <span>Show all</span>
        <img src={LeftArrow} alt="expand" />
      </div>
    </div>
  );
};

export default connect(() => ({}))(MyApps);
