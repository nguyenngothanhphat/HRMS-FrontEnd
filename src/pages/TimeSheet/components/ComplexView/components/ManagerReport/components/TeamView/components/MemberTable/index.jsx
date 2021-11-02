import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import {
  MNG_MT_MAIN_COL_SPAN,
  MNG_MT_SECONDARY_COL_SPAN,
  MNG_MT_THIRD_COL_SPAN,
  projectColor,
} from '@/utils/timeSheet';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import MemberCard from './components/MemberCard';
import UserProfilePopover from '../../../UserProfilePopover';
import styles from './index.less';

const { EMPLOYEE, REMAINING } = MNG_MT_MAIN_COL_SPAN;
const { DESIGNATION, DEPARTMENT, PROJECT_GROUP } = MNG_MT_SECONDARY_COL_SPAN;
const { PROJECTS, PROJECT_MANAGER, TOTAL_HOURS } = MNG_MT_THIRD_COL_SPAN;

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
  const [mode, setMode] = useState(2); // 1: people manager, 2: project manager

  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row className={styles.tableHeader}>
        <Col span={EMPLOYEE} className={styles.tableHeader__firstColumn}>
          Employee
        </Col>
        <Col span={REMAINING}>
          <div className={styles.tableHeader__remainColumn}>
            <Row gutter={[12, 0]}>
              <Col span={DESIGNATION} className={styles.title}>
                Designation
              </Col>
              <Col span={DEPARTMENT} className={styles.title}>
                Department
              </Col>

              <Col span={PROJECT_GROUP} className={styles.groupCell}>
                <Row className={styles.groupRow}>
                  <Col span={PROJECTS} className={styles.title}>
                    Projects
                  </Col>

                  {mode === 1 ? (
                    <>
                      <Col span={PROJECT_MANAGER} className={styles.title}>
                        Project Manager
                      </Col>
                      <Col span={TOTAL_HOURS} className={styles.title}>
                        Total hours
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col span={PROJECT_MANAGER} className={styles.title}>
                        Total hours
                      </Col>
                      <Col span={TOTAL_HOURS} className={`${styles.title} ${styles.alignCenter}`}>
                        PM Assigned
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  };

  const getColorByIndex = (index) => {
    return projectColor[index % projectColor.length];
  };

  const _renderEmployee = (item = {}, index) => {
    return (
      <Row className={styles.member}>
        <Col span={EMPLOYEE} className={`${styles.member__firstColumn}`}>
          <UserProfilePopover placement="rightTop">
            <div className={styles.renderEmployee}>
              <div className={styles.avatar}>
                {item.avatar ? (
                  <img src={item.avatar || MockAvatar} alt="" />
                ) : (
                  <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                    <span>{item.name ? item.name.toString()?.charAt(0) : 'P'}</span>
                  </div>
                )}
              </div>
              <div className={styles.right}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.id}>({item.userId})</span>
              </div>
            </div>
          </UserProfilePopover>
        </Col>
        <Col span={REMAINING} className={styles.member__remainColumn}>
          <MemberCard card={item} />
        </Col>
      </Row>
    );
  };

  const _renderTableContent = () => {
    return mockMembers.map((m, i) => _renderEmployee(m, i));
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
