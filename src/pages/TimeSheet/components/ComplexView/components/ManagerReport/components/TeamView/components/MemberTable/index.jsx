import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { MT_MAIN_COL_SPAN, MT_SECONDARY_COL_SPAN } from '@/utils/timeSheet';
import MemberCard from './components/MemberCard';
import styles from './index.less';

const { DATE, REMAINING } = MT_MAIN_COL_SPAN;
const { ACTIVITY, START_TIME, END_TIME, NIGHT_SHIFT, TOTAL_HOURS, NOTES, ACTIONS } =
  MT_SECONDARY_COL_SPAN;

const mockMembers = [
  {
    id: 1,
    name: 'Bessie Cooper',
    userId: 'bessiecooper',
    designation: 'UX Designer',
    department: 'UX, Mumbai',
    projects: [
      {
        id: 1,
        name: 'Udaan - Retainer',
        projectManager: 'Dianne Russell',
        totalHours: 160,
      },
      {
        id: 2,
        name: 'HRMS',
        projectManager: 'Savannah Nguyen',
        totalHours: 160,
      },
      {
        id: 3,
        name: 'Udaan - Retainer',
        projectManager: 'Dianne Russell',
        totalHours: 160,
      },
    ],
  },
  {
    id: 2,
    name: 'Bessie Cooper',
    userId: 'bessiecooper',
    designation: 'UX Designer',
    department: 'UX, Mumbai',
    projects: [
      {
        id: 1,
        name: 'Udaan - Retainer',
        projectManager: 'Dianne Russell',
        totalHours: 160,
      },
      {
        id: 2,
        name: 'HRMS',
        projectManager: 'Savannah Nguyen',
        totalHours: 160,
      },
    ],
  },
];

const MemberTable = (props) => {
  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row className={styles.tableHeader}>
        <Col span={DATE} className={`${styles.tableHeader__firstColumn} ${styles.alignCenter}`}>
          Employee
        </Col>
        <Col span={REMAINING}>
          <div className={styles.tableHeader__remainColumn}>
            <Row gutter={[12, 0]}>
              <Col span={ACTIVITY} className={styles.title}>
                Designation
              </Col>
              <Col span={START_TIME} className={styles.title}>
                Department
              </Col>
              <Col span={END_TIME} className={styles.title}>
                Projects
              </Col>
              <Col span={NIGHT_SHIFT} className={styles.title}>
                Project Manager
              </Col>
              <Col span={TOTAL_HOURS} className={styles.title}>
                Total hours
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  };

  const _renderEmployee = (item = {}) => {
    return (
      <Row className={styles.member}>
        <Col span={DATE} className={`${styles.MemberList__firstColumn} ${styles.alignCenter}`}>
          <span>{item.name}</span>
        </Col>
        <Col span={REMAINING} className={styles.MemberList__remainColumn}>
          <MemberCard card={item} />
        </Col>
      </Row>
    );
  };

  const _renderTableContent = () => {
    return mockMembers.map((m) => _renderEmployee(m));
  };

  // MAIN AREA
  return (
    <div className={styles.MemberTable}>
      <div className={styles.tableContainer}>
        {_renderTableHeader()}
        {_renderTableContent()}
      </div>
    </div>
  );
};

export default connect(() => ({}))(MemberTable);
