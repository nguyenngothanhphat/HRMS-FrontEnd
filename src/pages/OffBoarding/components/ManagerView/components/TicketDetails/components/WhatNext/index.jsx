import { Card, Col, Row } from 'antd';
import React, { useState } from 'react';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import SetMeetingModal from '@/pages/OffBoarding/components/SetMeetingModal';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const WhatNext = (props) => {
  const { status = 1, item: { employee = {} } = {}, setIsEnterClosingComment = () => {} } = props;

  const [oneOnOneMeetingModalVisible, setOneOnOneMeetingModalVisible] = useState(false);

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
            <Col span={16} className={styles.text1}>
              <span>
                Schedule a 1-on-1 call with {getEmployeeName(employee.generalInfoInfo)} and provide
                your closing comments for the same
              </span>
            </Col>
            <Col span={8}>
              <div className={styles.oneInOneButton}>
                <CustomPrimaryButton onClick={() => setOneOnOneMeetingModalVisible(true)}>
                  Schedule a 1-on-1
                </CustomPrimaryButton>
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
            <Col span={10} lg={8}>
              <div className={styles.leftPart}>
                <span className={styles.label}>1-on-1 meeting with</span>
                <CustomEmployeeTag
                  title={employee?.titleInfo?.name}
                  name={getEmployeeName(employee?.generalInfoInfo)}
                  avatar={employee?.generalInfoInfo?.avatar}
                  userId={employee?.generalInfoInfo?.userId}
                />
              </div>
            </Col>
            <Col span={14} lg={16}>
              <div className={styles.rightPart}>
                <span className={styles.label}>Scheduled on</span>
                <span className={styles.time}>22.05.20 | 12 PM</span>
                {status === 3 && (
                  <div className={styles.notification}>
                    <span>Requestee scheduled 1-on-1 meeting with you</span>
                  </div>
                )}
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
      case 2:
        return (
          <div className={styles.actions}>
            <CustomPrimaryButton>Join with Google Meet</CustomPrimaryButton>
          </div>
        );

      case 3:
        return (
          <div className={styles.actions}>
            <CustomSecondaryButton>Reschedule</CustomSecondaryButton>
            <CustomPrimaryButton>Accept meeting</CustomPrimaryButton>
          </div>
        );

      case 4:
        return (
          <div className={styles.comment}>
            <span onClick={setIsEnterClosingComment}>Enter Closing Comments</span>
          </div>
        );

      default:
        return '';
    }
  };

  const renderModal = () => {
    return (
      <SetMeetingModal
        employee={employee}
        visible={oneOnOneMeetingModalVisible}
        onClose={() => setOneOnOneMeetingModalVisible(false)}
        title={`Set 1-on-1 with ${getEmployeeName(employee.generalInfoInfo)}`}
        partnerRole="Employee"
      />
    );
  };

  return (
    <Card title={renderTitle()} className={styles.WhatNext}>
      {renderContent()}
      {renderButtons()}
      {renderModal()}
    </Card>
  );
};

export default WhatNext;
