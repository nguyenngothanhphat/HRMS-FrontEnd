import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import {
  convertMsToHours,
  MNG_MT_SECONDARY_COL_SPAN,
  MNG_MT_THIRD_COL_SPAN,
  employeeColor,
} from '@/utils/timeSheet';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import UserProfilePopover from '@/components/UserProfilePopover';
import styles from './index.less';

const { DESIGNATION, DEPARTMENT, PROJECT_GROUP } = MNG_MT_SECONDARY_COL_SPAN;
const { PROJECTS, PROJECT_MANAGER, TOTAL_HOURS, VIEW_DETAIL } = MNG_MT_THIRD_COL_SPAN;

const MemberCard = (props) => {
  const {
    viewType,
    VIEW_TYPE,
    card: { projects = [], employee = {}, employee: { department = {}, title = {} } = {} } = {},
    setEmployeeProjectDetailModalVisible = () => {},
    setSelectedEmployee = () => {},
  } = props;

  const onViewDetail = () => {
    setEmployeeProjectDetailModalVisible(true);
    setSelectedEmployee(employee);
  };

  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };

  const renderProjectName = (record, index) => {
    const { projectName = '', engagementType = '' } = record;

    return (
      <div className={styles.renderProject}>
        <div className={styles.avatar}>
          <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
            <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
          </div>
        </div>
        <div className={styles.right}>
          <span className={styles.name}>{projectName || '-'}</span>
          <span className={styles.type}>{engagementType || '-'}</span>
        </div>
      </div>
    );
  };

  // MAIN AREA
  return (
    <div className={styles.MemberCard}>
      <Row gutter={[12, 0]}>
        <Col span={DESIGNATION} className={styles.normalCell}>
          <div className={styles.title}>{title?.name || '-'}</div>
        </Col>
        <Col span={DEPARTMENT} className={styles.normalCell}>
          {department?.name || '-'}
        </Col>
        <Col
          span={PROJECT_GROUP}
          className={`${styles.groupCell} ${projects.length > 1 ? styles.borderLeftStyle : null}`}
        >
          {projects.map((pj, index) => {
            const { projectManager, userProjectSpentTime = 0 } = pj;
            if (viewType === VIEW_TYPE.PEOPLE_MANAGER) {
              return (
                <Row className={styles.groupRow}>
                  <Col span={PROJECTS} className={styles.normalCell}>
                    {renderProjectName(pj, index)}
                  </Col>
                  <Col span={PROJECT_MANAGER} className={styles.normalCell}>
                    {projectManager?.legalName}
                  </Col>
                  <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.totalHours}`}>
                    {userProjectSpentTime ? convertMsToHours(userProjectSpentTime) : 0}hrs
                  </Col>
                  <Col
                    span={VIEW_DETAIL}
                    className={`${styles.normalCell} ${styles.alignRight} ${styles.viewDetail}`}
                    onClick={() => onViewDetail()}
                  >
                    View details
                  </Col>
                </Row>
              );
            }

            return (
              <Row className={styles.groupRow}>
                <Col span={PROJECTS} className={styles.normalCell}>
                  {renderProjectName(pj, index)}
                </Col>
                <Col
                  span={PROJECT_MANAGER}
                  className={`${styles.normalCell} ${styles.alignCenter} ${styles.totalHours}`}
                >
                  {userProjectSpentTime ? convertMsToHours(userProjectSpentTime) : 0}hrs
                </Col>
                <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.alignCenter}`}>
                  {projectManager && (
                    <UserProfilePopover placement="leftTop" data={projectManager}>
                      {projectManager.avatar ? (
                        <img
                          src={projectManager.avatar || MockAvatar}
                          className={styles.avatar}
                          alt=""
                        />
                      ) : (
                        <div className={styles.icon}>
                          <span>
                            {projectManager.legalName
                              ? projectManager.legalName.toString()?.charAt(0)
                              : 'P'}
                          </span>
                        </div>
                      )}
                    </UserProfilePopover>
                  )}
                </Col>
                <Col
                  span={VIEW_DETAIL}
                  className={`${styles.normalCell} ${styles.alignRight} ${styles.viewDetail}`}
                  onClick={() => onViewDetail()}
                >
                  View details
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  MemberCard,
);
