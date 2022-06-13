import React from 'react';
import { Button, Row, Col } from 'antd';
import styles from './index.less';
import UserProfilePopover from '@/components/UserProfilePopover';

const ViewLeftInitial = (props) => {
  const {
    employee: {
      managerInfo: {
        generalInfoInfo: { legalName: managerName = '', userId = '' } = {},
        generalInfoInfo = {},
      } = {},
      managerInfo = {},
    } = {},
  } = props;

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles.ViewLeftInitial}>
      <Row className={styles.header} justify="space-between">
        <Col span={24} className={styles.headerSchedule}>
          <div className={styles.headerSchedule__title}>Did you know?</div>
          <div className={styles.container__content}>
            <div className={styles.headerSchedule__content}>
              {`Your Manager, `}
              <span className={styles.headerSchedule__content__managerName}>
                <UserProfilePopover
                  placement="topRight"
                  trigger="hover"
                  data={{ ...managerInfo, ...generalInfoInfo }}
                >
                  <span className={styles.userID} onClick={() => viewProfile(userId)}>
                    {managerName}
                  </span>
                </UserProfilePopover>
              </span>
              , usually conducts 1-on-1s and you can speak anything to him.{' '}
              <p style={{ fontWeight: 600, color: '#161c29', marginBottom: '0' }}>
                8/10 employees have changed their mind after talking to their manager.
              </p>
              <p style={{ marginBottom: '0' }}>Schedule a meeting now!</p>
            </div>
            <div>
              <Button>Schedule 1-on-1</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ViewLeftInitial;
