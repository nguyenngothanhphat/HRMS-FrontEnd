import { Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import DirectoryIcon from '@/assets/dashboard/directory.svg';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import TimeoffIcon from '@/assets/dashboard/timeoff.svg';
import TimesheetIcon from '@/assets/dashboard/timesheet.svg';
import ApprovalIcon from '@/assets/dashboard/approvalIcon.svg';
import CommonModal from '@/components/CommonModal';
import AppCard from './components/AppCard';
import ShowAllAppModalContent from './components/ShowAllAppModalContent';
// import ExpensoIcon from '@/assets/dashboard/expenso.svg';
// import ReportIcon from '@/assets/dashboard/reports.svg';
// import TicketIcon from '@/assets/ticketManagement-assign.svg';
import styles from './index.less';
import ROLES from '@/utils/roles';

const MyApps = (props) => {
  const { user: { currentUser: { roles = [] } } = {} } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const myApps = [
    {
      icon: TimesheetIcon,
      name: 'Timesheets',
      link: '/time-sheet',
    },
    {
      icon: TimeoffIcon,
      name: 'Timeoff',
      link: '/time-off/overview',
    },
    {
      icon: DirectoryIcon,
      name: 'Directory',
      link: '/directory/org-chart',
    },
    {
      icon: ApprovalIcon,
      name: 'Approval',
      link: '/dashboard/approvals',
      isHide: !roles.some((x) => x.includes(ROLES.MANAGER.toUpperCase())),
    },
  ];

  const listMyApps = myApps.slice(0, 6);
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

      <CommonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="My Apps"
        hasFooter={false}
        withPadding
        content={<ShowAllAppModalContent myApps={myApps} />}
      />
    </div>
  );
};

export default connect(({ user = {} }) => ({
  user,
}))(MyApps);
