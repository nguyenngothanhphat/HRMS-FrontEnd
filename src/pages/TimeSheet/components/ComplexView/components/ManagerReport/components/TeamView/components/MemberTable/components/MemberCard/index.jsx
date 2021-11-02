import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { MNG_MT_SECONDARY_COL_SPAN, MNG_MT_THIRD_COL_SPAN } from '@/utils/timeSheet';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import UserProfilePopover from '../../../../../UserProfilePopover';
import styles from './index.less';

const { DESIGNATION, DEPARTMENT, PROJECT_GROUP } = MNG_MT_SECONDARY_COL_SPAN;
const { PROJECTS, PROJECT_MANAGER, TOTAL_HOURS } = MNG_MT_THIRD_COL_SPAN;

const MemberCard = (props) => {
  const { card: { designation = '', projects = '', department = '' } = {} } = props;
  const [mode, setMode] = useState(2); // 1: people manager, 2: project manager

  // MAIN AREA
  return (
    <div className={styles.MemberCard}>
      <Row gutter={[12, 0]}>
        <Col span={DESIGNATION} className={styles.normalCell}>
          {designation}
        </Col>
        <Col span={DEPARTMENT} className={styles.normalCell}>
          {department}
        </Col>
        <Col span={PROJECT_GROUP} className={styles.groupCell}>
          {projects.map((pj) => {
            if (mode === 1) {
              return (
                <Row className={styles.groupRow}>
                  <Col span={PROJECTS} className={styles.normalCell}>
                    {pj.name}
                  </Col>
                  <Col span={PROJECT_MANAGER} className={styles.normalCell}>
                    {pj.projectManager}
                  </Col>
                  <Col span={TOTAL_HOURS} className={styles.normalCell}>
                    {pj.totalHours}
                  </Col>
                </Row>
              );
            }

            return (
              <Row className={styles.groupRow}>
                <Col span={PROJECTS} className={styles.normalCell}>
                  {pj.name}
                </Col>
                <Col span={PROJECT_MANAGER} className={styles.normalCell}>
                  {pj.totalHours}
                </Col>
                <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.alignCenter}`}>
                  <UserProfilePopover placement="leftTop">
                    {pj.avatar ? (
                      <img src={pj.avatar || MockAvatar} className={styles.avatar} alt="" />
                    ) : (
                      <div className={styles.icon}>
                        <span>{pj.name ? pj.name.toString()?.charAt(0) : 'P'}</span>
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
