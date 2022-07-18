import { Card } from 'antd';
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
      hrNote = {},
      hrStatus = '',
      status = '',
      assigned = {},
      managerNote: { isRequestDifferent = false } = {},
    } = {},
    loadingButton = false,
  } = props;

  const { hr = {} } = assigned;

  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [action, setAction] = useState('');

  const onFinalAction = async (actionProp = '') => {
    setAction(actionProp);
    const payload = {
      id: _id,
      employeeId: employee?._id,
      action:
        actionProp === 'accept'
          ? OFFBOARDING.UPDATE_ACTION.HR_ACCEPT
          : OFFBOARDING.UPDATE_ACTION.HR_REJECT,
    };

    const res = await dispatch({
      type: 'offboarding/updateRequestEffect',
      payload,
      showNotification: false,
    });
    if (res.statusCode === 200) {
      setNotificationModalVisible(true);
    }
  };

  // render UI
  const renderContent = () => {
    const disabled =
      (hrNote.isAcceptLWD === undefined && isRequestDifferent) ||
      status === OFFBOARDING.STATUS.IN_PROGRESS;

    if (hrStatus === OFFBOARDING.STATUS.REJECTED) {
      return (
        <div className={styles.result}>
          <img src={FailedIcon} alt="" />
          <span>
            The employee resignation request has been Rejected by{' '}
            <Link to={`/directory/employee-profile/${hr?.generalInfoInfo?.userId}`}>
              {hr?.generalInfoInfo?.legalName}
            </Link>
          </span>
        </div>
      );
    }
    if (hrStatus === OFFBOARDING.STATUS.ACCEPTED) {
      return (
        <div className={styles.result}>
          <img src={SuccessIcon} alt="" />
          <span>
            The employee resignation request has been Accepted by{' '}
            <Link to={`/directory/employee-profile/${hr?.generalInfoInfo?.userId}`}>
              {hr?.generalInfoInfo?.legalName}
            </Link>
          </span>
        </div>
      );
    }

    return (
      <div className={styles.actions}>
        <div className={styles.comment}>
          <span>Please Accept or Reject the resignation request.</span>
        </div>
        <div>
          <CustomSecondaryButton
            disabled={disabled}
            onClick={() => onFinalAction('reject')}
            loading={loadingButton && action === 'reject'}
          >
            Reject
          </CustomSecondaryButton>
          <CustomPrimaryButton
            disabled={disabled}
            onClick={() => onFinalAction('accept')}
            loading={loadingButton && action === 'accept'}
          >
            Accept
          </CustomPrimaryButton>
        </div>
      </div>
    );
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

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingButton: loading.effects['offboarding/updateRequestEffect'],
}))(HRApproval);
