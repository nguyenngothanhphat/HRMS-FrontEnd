import { Col, Row, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import {
  MNG_MT_MAIN_COL_SPAN,
  MNG_MT_SECONDARY_COL_SPAN,
  MNG_MT_THIRD_COL_SPAN,
  projectColor,
} from '@/utils/timeSheet';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import MemberCard from './components/MemberCard';
import UserProfilePopover from '@/components/UserProfilePopover';
import EmptyComponent from '@/pages/TimeSheet/components/ComplexView/components/Empty';
import EmployeeProjectDetailModal from '@/pages/TimeSheet/components/ComplexView/components/EmployeeProjectDetailModal';

import styles from './index.less';

const { EMPLOYEE, REMAINING } = MNG_MT_MAIN_COL_SPAN;
const { DESIGNATION, DEPARTMENT, PROJECT_GROUP } = MNG_MT_SECONDARY_COL_SPAN;
const { PROJECTS, PROJECT_MANAGER, TOTAL_HOURS, VIEW_DETAIL } = MNG_MT_THIRD_COL_SPAN;
const VIEW_TYPE = {
  PEOPLE_MANAGER: 1,
  PROJECT_MANAGER: 2,
};

const MemberTable = (props) => {
  const [viewType, setViewType] = useState(VIEW_TYPE.PROJECT_MANAGER);
  const { data = [], permissions, loadingFetch = false } = props;

  const [employeeProjectDetailModalVisible, setEmployeeProjectDetailModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    if (permissions.viewProjectManagerCVTimesheet === 1) {
      setViewType(VIEW_TYPE.PROJECT_MANAGER);
    }
    if (permissions.viewPeopleManagerCVTimesheet === 1) {
      setViewType(VIEW_TYPE.PEOPLE_MANAGER);
    }
  }, []);

  // RENDER UI
  const _renderTableHeader = () => {
    return (
      <Row className={styles.tableHeader}>
        <Col span={EMPLOYEE} className={styles.tableHeader__firstColumn}>
          Employee
        </Col>
        <Col span={REMAINING}>
          <div className={styles.tableHeader__remainColumn}>
            <Row gutter={[12, 0]} align="middle">
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

                  {viewType === VIEW_TYPE.PEOPLE_MANAGER ? (
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
                  <Col span={VIEW_DETAIL} className={`${styles.title} ${styles.alignRight}`}>
                    Action
                  </Col>
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
    const { employee: { legalName = '', userId = '', avatar = '' } = {} } = item;
    return (
      <Row className={styles.member}>
        <Col span={EMPLOYEE} className={`${styles.member__firstColumn}`}>
          <UserProfilePopover placement="rightTop" data={item.employee}>
            <div className={styles.renderEmployee}>
              <div className={styles.avatar}>
                {avatar ? (
                  <img src={avatar || MockAvatar} alt="" />
                ) : (
                  <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                    <span>{legalName ? legalName.toString()?.charAt(0) : 'P'}</span>
                  </div>
                )}
              </div>
              <div className={styles.right}>
                <span className={styles.name}>{legalName}</span>
                <span className={styles.id}>({userId})</span>
              </div>
            </div>
          </UserProfilePopover>
        </Col>
        <Col span={REMAINING} className={styles.member__remainColumn}>
          <MemberCard
            card={item}
            viewType={viewType}
            VIEW_TYPE={VIEW_TYPE}
            setEmployeeProjectDetailModalVisible={setEmployeeProjectDetailModalVisible}
            setSelectedEmployee={setSelectedEmployee}
          />
        </Col>
      </Row>
    );
  };

  const _renderTableContent = () => {
    if (loadingFetch)
      return (
        <div className={styles.loadingContainer}>
          <Spin size="default" />
        </div>
      );
    if (data.length === 0) return <EmptyComponent />;
    return data.map((m, i) => _renderEmployee(m, i));
  };

  // MAIN AREA
  return (
    <div className={styles.MemberTable}>
      <div className={styles.tableContainer}>
        {_renderTableHeader()}
        {_renderTableContent()}
      </div>
      <EmployeeProjectDetailModal
        visible={employeeProjectDetailModalVisible}
        onClose={() => setEmployeeProjectDetailModalVisible(false)}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
};

export default connect(({ user: { permissions } }) => ({ permissions }))(MemberTable);
