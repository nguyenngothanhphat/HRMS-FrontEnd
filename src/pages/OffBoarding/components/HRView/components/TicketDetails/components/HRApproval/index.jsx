import { Card, Form } from 'antd';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import FailedIcon from '@/assets/offboarding/failedIcon.svg';
import SuccessIcon from '@/assets/offboarding/successIcon.png';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import NotificationModal from '@/components/NotificationModal';
import { OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const HRApproval = (props) => {
  const {
    dispatch,
    item: {
      _id = '',
      employee = {},
      status = '',
      meeting = {},
      assigned = {},
      managerNote: {
        closingComments = '',
        isRehired = false,
        isReplacement = false,
        isHrRequired = false,
        isRequestDifferent = false,
        notes = '',
      } = {},
      managerPickLWD = '',
    } = {},
    item = {},
  } = props;

  const { status: meetingStatus = '' } = meeting;
  const { hr = {} } = assigned;

  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [action, setAction] = useState('');

  // render UI
  const renderContent = () => {
    const disabled = [OFFBOARDING.STATUS.IN_PROGRESS].includes(status);

    return (
      <div className={styles.actions}>
        <div className={styles.comment}>
          <span>Please Accept or Reject the resignation request.</span>
        </div>
        <div>
          <CustomSecondaryButton disabled={disabled}>Reject</CustomSecondaryButton>
          <CustomPrimaryButton disabled={disabled}>Accept</CustomPrimaryButton>
        </div>
      </div>
    );

    // if (true) {
    //   return (
    //     <div className={styles.result}>
    //       <img src={FailedIcon} alt="" />
    //       <span>
    //         The employee resignation request has been Rejected by{' '}
    //         <Link to={`/directory/employee-profile/${hr?.generalInfoInfo?.userId}`}>
    //           {hr?.generalInfoInfo?.legalName}
    //         </Link>
    //       </span>
    //     </div>
    //   );
    // }
    // if (meetingStatus === OFFBOARDING.MEETING_STATUS.DONE) {
    //   return (
    //     <div className={styles.result}>
    //       <img src={SuccessIcon} alt="" />
    //       <span>
    //         The employee resignation request has been Accepted by{' '}
    //         <Link to={`/directory/employee-profile/${manager?.generalInfoInfo?.userId}`}>
    //           {manager?.generalInfoInfo?.legalName}
    //         </Link>
    //       </span>
    //     </div>
    //   );
    // }

    // return null;
  };

  const renderModals = () => {
    return (
      <div>
        <NotificationModal
          visible={notificationModalVisible}
          onClose={() => setNotificationModalVisible(false)}
          description={
            action === 'accept'
              ? 'Your acceptance of the request has been recorded and all the concerned parties will be notified'
              : 'Your rejection of the request has been recorded and all the concerned parties will be notified'
          }
          buttonText="Ok"
        />
      </div>
    );
  };

  return (
    <Card title="HR Approval" className={styles.HRApproval}>
      {renderContent()}
      {renderModals()}
    </Card>
  );
};

export default connect(({ offboarding }) => ({ offboarding }))(HRApproval);
