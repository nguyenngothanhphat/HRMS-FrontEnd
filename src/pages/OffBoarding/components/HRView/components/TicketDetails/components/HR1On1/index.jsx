import { Card, Col, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import SetMeetingModal from '@/pages/OffBoarding/components/SetMeetingModal';
import { dateFormat, getEmployeeName, OFFBOARDING, onJoinMeeting } from '@/utils/offboarding';
import styles from './index.less';

const HR1On1 = (props) => {
  const {
    dispatch,
    item: { _id = '', employee = {}, meetingHR = {} } = {},
    setIsEnterClosingComment = () => {},
  } = props;

  const { status: meetingStatus = '', date: hrDate = '', id: meetingId = '' } = meetingHR;

  const [oneOnOneMeetingModalVisible, setOneOnOneMeetingModalVisible] = useState(false);

  // functionalities
  const onSetOneOnOneMeeting = async (values) => {
    const res = await dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        id: _id,
        employeeId: employee?._id,
        action: OFFBOARDING.UPDATE_ACTION.HR_RESCHEDULE,
        meeting: {
          hrDate: moment(values.time),
        },
      },
    });
    if (res.statusCode === 200) {
      setOneOnOneMeetingModalVisible(false);
    }
  };

  // render UI
  const renderTitle = () => {
    return 'HR 1 on 1 Requested';
  };

  const renderContent = () => {
    switch (meetingStatus) {
      case OFFBOARDING.MEETING_STATUS.NOT_START:
      case '':
        return (
          <Row gutter={[24, 16]} className={styles.content} align="middle">
            <Col span={16} className={styles.text1}>
              <span>
                The reporting manager has requested that the HR speak to the employee about their
                decision.
              </span>
            </Col>
            <Col span={8}>
              <div className={styles.oneInOneButton}>
                <CustomPrimaryButton onClick={() => setOneOnOneMeetingModalVisible(true)}>
                  Schedule a 1-on-1
                </CustomPrimaryButton>
              </div>
            </Col>
          </Row>
        );

      case OFFBOARDING.MEETING_STATUS.HR_PICK_DATE:
      case OFFBOARDING.MEETING_STATUS.EMPLOYEE_ACCEPT_HR_DATE:
      case OFFBOARDING.MEETING_STATUS.DATE_CONFIRMED:
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
                <span className={styles.time}>
                  {moment(hrDate).format(`${dateFormat} | h:mm a`)}
                </span>
              </div>
            </Col>
          </Row>
        );

      default:
        return '';
    }
  };

  const renderButtons = () => {
    switch (meetingStatus) {
      case OFFBOARDING.MEETING_STATUS.NOT_START:
        return '';

      case OFFBOARDING.MEETING_STATUS.HR_PICK_DATE:
      case OFFBOARDING.MEETING_STATUS.EMPLOYEE_ACCEPT_HR_DATE:
      case OFFBOARDING.MEETING_STATUS.DATE_CONFIRMED:
        return (
          <div className={styles.actions}>
            <div className={styles.comment}>
              <span onClick={() => setIsEnterClosingComment(true)}>Enter Closing Comments</span>
            </div>
            <div>
              <CustomSecondaryButton
                onClick={() => {
                  setOneOnOneMeetingModalVisible(true);
                }}
              >
                <span
                  style={{
                    color: '#2C6DF9',
                  }}
                >
                  Reschedule
                </span>
              </CustomSecondaryButton>
              <CustomPrimaryButton
                onClick={() => {
                  onJoinMeeting(meetingId);
                }}
              >
                Join with Google Meet
              </CustomPrimaryButton>
            </div>
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
        onFinish={onSetOneOnOneMeeting}
        selectedDate={hrDate || null}
      />
    );
  };

  return (
    <Card title={renderTitle()} className={styles.HR1On1}>
      {renderContent()}
      {renderButtons()}
      {renderModal()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({ offboarding }))(HR1On1);
