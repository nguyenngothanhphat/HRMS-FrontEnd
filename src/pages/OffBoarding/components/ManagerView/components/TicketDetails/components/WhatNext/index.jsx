import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const WhatNext = (props) => {
  const { status = 4, item: { employee = {} } = {} } = props;

  const renderTitle = () => {
    switch (status) {
      case 4:
        return '1 -on- 1 Meeting Completed';
      default:
        return 'What next?';
    }
  };

  const renderContent = () => {
    switch (status) {
      case 1:
        return (
          <Row gutter={[24, 16]} className={styles.content} align="middle">
            <Col span={16}>
              <span className={styles.text1}>
                Schedule a 1-on-1 call with {getEmployeeName(employee.generalInfo)} and provide your
                closing comments for the same
              </span>
            </Col>
            <Col span={8}>
              <div className={styles.oneInOneButton}>
                <CustomPrimaryButton title="Schedule a 1-on-1" />
              </div>
            </Col>
            <Col span={16}>
              <span className={styles.text2}>
                <span style={{ fontWeight: 500 }}>Note: </span>
                The one on one needs to be completed within 10 days from the date the request was
                created.
              </span>
            </Col>
            <Col span={8} />
          </Row>
        );

      case 2:
      case 3:
      case 4:
        return (
          <Row gutter={[24, 16]} className={styles.content} align="top">
            <Col span={8}>
              <div className={styles.leftPart}>
                <span className={styles.label}>1-on-1 meeting with</span>
                <div className={styles.employee}>
                  <div className={styles.employee__avatar}>
                    <img src={employee.generalInfo?.avatar || DefaultAvatar} alt="avatar" />
                  </div>
                  <div className={styles.employee__name}>
                    <span className={styles.name}>{getEmployeeName(employee.generalInfo)}</span>
                    <span className={styles.title}>{employee.title?.name}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.rightPart}>
                <span className={styles.label}>Scheduled on</span>
                <span className={styles.time}>22.05.20 | 12 PM</span>
                <div className={styles.notification}>
                  <span>Requestee scheduled 1-on-1 meeting with you</span>
                </div>
              </div>
            </Col>
          </Row>
        );

      default:
        return '';
    }
  };

  const renderButtons = () => {
    switch (status) {
      case 1:
      case 3:
        return (
          <div className={styles.actions}>
            <CustomPrimaryButton title="Join with Google Meet" />
          </div>
        );

      case 2:
        return (
          <div className={styles.actions}>
            <Button type="link">Reschedule</Button>
            <CustomPrimaryButton title="Join with Google Meet" />
          </div>
        );

      case 4:
        return (
          <div className={styles.comment}>
            <span>Enter Closing Comments</span>
          </div>
        );

      default:
        return '';
    }
  };

  return (
    <Card title={renderTitle()} className={styles.WhatNext}>
      {renderContent()}
      {renderButtons()}
    </Card>
  );
};

export default WhatNext;
