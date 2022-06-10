import { Card, Avatar, Col, Row, Button } from 'antd';
import React from 'react';
import avtDefault from '@/assets/defaultAvatar.png';
import styles from './index.less';

const ConfirmRequest = (props) => {
  const {
    employee: {
      managerInfo: {
        generalInfoInfo: { legalName: managerName = '', avatar = '' } = {},
        titleInfo: { name: titleName = '' } = {},
      } = {},
    } = {},
    status = 1,
  } = props;

  const renderWithStatus = () => {
    switch (status) {
      case 1:
        return (
          <div className={styles.labelStatus}>
            Waiting for Aditya Venkatesan to Accept your meeting request.
          </div>
        );
      case 2:
        return (
          <div className={styles.labelStatus}>
            Meeting request has been accepted by Aditya Venkatesan.
          </div>
        );
      case 3:
        return <div className={styles.labelStatus}>Anil Reddy has rescheduled the meeting.</div>;
      default:
        return '';
    }
  };

  const renderContent = () => {
    return (
      <Row gutter={[24, 16]} className={styles.content} align="top">
        <Col span={10}>
          <div className={styles.leftPart}>
            <div className={styles.label}>1-on-1 meeting with</div>
            <div className={styles.reporting}>
              <Avatar size={36} src={avatar || avtDefault} style={{ marginRight: '15px' }} />
              <div>
                <div className={styles.legalName}>{managerName}</div>
                <div className={styles.titleinfo}>{titleName}</div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={14}>
          <div className={styles.rightPart}>
            <span className={styles.label}>Scheduled on</span>
            <span className={styles.time}>
              22.05.20 | 12 PM{' '}
              <span style={{ color: '#2C6DF9', textDecoration: 'underline' }}>Modify</span>
            </span>

            <div className={styles.notification}>{renderWithStatus(status)}</div>
          </div>
        </Col>
      </Row>
    );
  };

  const renderButtons = () => {
    switch (status) {
      case 1:
      case 2:
        return (
          <div className={styles.actions}>
            <Button className={styles.btn} disabled>
              Join with Google Meet
            </Button>
          </div>
        );

      case 3:
        return (
          <div className={styles.actions}>
            <Button className={styles.btn} type="link">
              Accept meeting
            </Button>
          </div>
        );

      default:
        return '';
    }
  };

  return (
    <div className={styles.ConfirmRequest}>
      <Card title="What's next?">
        {renderContent()}
        {renderButtons()}
      </Card>
    </div>
  );
};

export default ConfirmRequest;
