import { Card } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { onJoinMeeting } from '@/utils/offboarding';
import styles from './index.less';

const HRApproval = (props) => {
  const {
    dispatch,
    item: { _id = '', employee = {}, status = '', meeting = {} } = {},
    setIsEnterClosingComment = () => {},
  } = props;

  const {
    status: meetingStatus = '',
    managerDate = '',
    employeeDate = '',
    isAccept = false,
    id: meetingId = '',
  } = meeting;

  // render UI
  const renderContent = () => {};

  const renderButtons = () => {
    return (
      <div className={styles.actions}>
        <div className={styles.comment}>
          <span>Please Accept or Reject the resignation request.</span>
        </div>
        <div>
          <CustomSecondaryButton>Reject</CustomSecondaryButton>
          <CustomPrimaryButton>Accept</CustomPrimaryButton>
        </div>
      </div>
    );
  };

  return (
    <Card title="HR Approval" className={styles.HRApproval}>
      {renderContent()}
      {renderButtons()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({ offboarding }))(HRApproval);
