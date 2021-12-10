import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { MNG_MT_SECONDARY_COL_SPAN, MNG_MT_THIRD_COL_SPAN } from '@/utils/timeSheet';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import UserProfilePopover from '../../../../../UserProfilePopover';
import styles from './index.less';

const { DESIGNATION, DEPARTMENT, PROJECT_GROUP } = MNG_MT_SECONDARY_COL_SPAN;
const { PROJECTS, PROJECT_MANAGER, TOTAL_HOURS } = MNG_MT_THIRD_COL_SPAN;

const MemberCard = (props) => {
  const {
    viewType,
    VIEW_TYPE,
    card: { projects = [], employee: { department = {}, title = {} } = {} } = {},
  } = props;

  // MAIN AREA
  return (
    <div className={styles.MemberCard}>
      <Row gutter={[12, 0]}>
        <Col span={DESIGNATION} className={styles.normalCell}>
          {title?.name || '-'}
        </Col>
        <Col span={DEPARTMENT} className={styles.normalCell}>
          {department?.name || '-'}
        </Col>
        <Col span={PROJECT_GROUP} className={styles.groupCell}>
          {projects.map((pj) => {
            const { projectName = '', projectManager = {}, userProjectSpentTime = 0 } = pj;
            if (viewType === VIEW_TYPE.PEOPLE_MANAGER) {
              return (
                <Row className={styles.groupRow}>
                  <Col span={PROJECTS} className={styles.normalCell}>
                    {projectName}
                  </Col>
                  <Col span={PROJECT_MANAGER} className={styles.normalCell}>
                    {projectManager?.legalName}
                  </Col>
                  <Col span={TOTAL_HOURS} className={styles.normalCell}>
                    {userProjectSpentTime} hours
                  </Col>
                </Row>
              );
            }

            return (
              <Row className={styles.groupRow}>
                <Col span={PROJECTS} className={styles.normalCell}>
                  {projectName}
                </Col>
                <Col span={PROJECT_MANAGER} className={styles.normalCell}>
                  {userProjectSpentTime} hours
                </Col>
                <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.alignCenter}`}>
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
