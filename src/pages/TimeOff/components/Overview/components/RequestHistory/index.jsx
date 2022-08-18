import { Card, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import WarningIcon from '@/assets/timeOff/warning.svg';
import CheckIcon from '@/assets/timeOff/check.svg';
import ErrorIcon from '@/assets/timeOff/error.svg';
import DotIcon from '@/assets/timeOff/dot.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';
import { TIMEOFF_HISTORY_STATUS, TIMEOFF_STATUS } from '@/constants/timeOff';
import { getEmployeeUrl } from '@/utils/utils';

const { Step } = Steps;

const RequestHistory = (props) => {
  const { status = '', data, data: { history = [] } = {} } = props;
  const [indexWithdraw, setIndexWithdraw] = useState(0);

  const getFlow = () => {
    const array = history.map((item) => {
      const {
        employee: { generalInfoInfo: { legalName = '', avatar = '', userId = '' } = {} } = {},
        status: statusHistory = '',
        updatedAt = '',
      } = item;
      return {
        name: legalName,
        avatar: avatar || DefaultAvatar,
        userId,
        statusHistory,
        updatedAt,
      };
    });
    const a = [];
    const b = [];
    array.forEach((item) => {
      if (item.statusHistory === TIMEOFF_HISTORY_STATUS.APPLIED) {
        a.push(item);
      } else {
        b.push(item);
      }
    });
    return [...a, ...b];
  };

  useEffect(() => {
    setIndexWithdraw(
      getFlow().findIndex((item) => item?.statusHistory === TIMEOFF_HISTORY_STATUS.WITHDRAW),
    );
  }, [data]);

  const renderColorStatus = (statusProp) => {
    switch (statusProp) {
      case TIMEOFF_HISTORY_STATUS.APPLIED:
      case TIMEOFF_HISTORY_STATUS.EDITED:
        return { color: '#2C6DF9' };
      case TIMEOFF_HISTORY_STATUS.REJECTED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_REJECTED:
        return { color: '#F04438' };
      case TIMEOFF_HISTORY_STATUS.APPROVED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_ACCEPTED:
        return { color: '#12B76A' };
      case TIMEOFF_HISTORY_STATUS.WAITING:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
      case TIMEOFF_HISTORY_STATUS.WAITING_WITHDRAW:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_APPROVED:
        return { color: '#FFA100' };
      default:
        return { color: '#2C6DF9' };
    }
  };

  const renderStatusName = (statusProp) => {
    switch (statusProp) {
      case TIMEOFF_HISTORY_STATUS.APPLIED:
        return 'Applied';
      case TIMEOFF_HISTORY_STATUS.EDITED:
        return 'Edited';
      case TIMEOFF_HISTORY_STATUS.REJECTED:
        return 'Rejected';
      case TIMEOFF_HISTORY_STATUS.APPROVED:
        return 'Approved';
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_ACCEPTED:
        return 'Approved Withdrawn Request';
      case TIMEOFF_HISTORY_STATUS.WAITING:
        return 'Waiting for Approval';
      case TIMEOFF_HISTORY_STATUS.WAITING_WITHDRAW:
        return 'Waiting for Withdrawn';
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_REJECTED:
        return 'Rejected Withdrawn Request';
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_APPROVED:
        return 'Withdrawn';
      default:
        return 'Applied';
    }
  };

  const onViewProfile = (id) => {
    const url = getEmployeeUrl(id);
    window.open(url, '_blank');
  };

  const renderImg = (name, avatar, userId, updatedAt, statusProp) => {
    return (
      <>
        <img
          className={styles.avatar}
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={avatar || DefaultAvatar}
          alt="avatar"
          onClick={() => onViewProfile(userId)}
        />
        <div>
          <div className={styles.nameStep} onClick={() => onViewProfile(userId)}>
            {name}
          </div>
          <div className={styles.containerStatus}>
            <span className={styles.status} style={renderColorStatus(statusProp)}>
              {renderStatusName(statusProp)}
            </span>{' '}
            {statusProp !== TIMEOFF_HISTORY_STATUS.WAITING &&
              statusProp !== TIMEOFF_HISTORY_STATUS.WAITING_WITHDRAW && (
                <span className={styles.date}>
                  on {moment(updatedAt).format('MM DD YYYY')} | {moment(updatedAt).format('H:mm a')}
                </span>
              )}
          </div>
        </div>
      </>
    );
  };

  const renderIcon = (statusProp) => {
    switch (statusProp) {
      case TIMEOFF_HISTORY_STATUS.APPLIED:
      case TIMEOFF_HISTORY_STATUS.EDITED:
      case TIMEOFF_HISTORY_STATUS.APPROVED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_APPROVED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_REJECTED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW_ACCEPTED:
        return <img src={CheckIcon} alt="" />;
      case TIMEOFF_HISTORY_STATUS.REJECTED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
        return <img src={ErrorIcon} alt="" />;
      case TIMEOFF_HISTORY_STATUS.WAITING_WITHDRAW:
        return <img src={DotIcon} alt="" />;
      default:
        return <img src={DotIcon} alt="" />;
    }
  };

  const renderSteps = () => {
    const people = getFlow();
    return people.map((item, index) => {
      const { name = '', avatar = '', userId = '', statusHistory = '', updatedAt = '' } = item;
      return (
        <Step
          className={`${
            people[index + 1]?.statusHistory !== TIMEOFF_HISTORY_STATUS.WAITING &&
            people[index + 1]?.statusHistory !== TIMEOFF_HISTORY_STATUS.WAITING_WITHDRAW
              ? styles.steps__solid
              : styles.step__dashed
          } 
              ${
                status === TIMEOFF_STATUS.WITHDRAWN &&
                index > indexWithdraw &&
                statusHistory === TIMEOFF_HISTORY_STATUS.WAITING
                  ? styles.steps__withdraw
                  : ''
              }`}
          icon={renderIcon(statusHistory)}
          description={renderImg(name, avatar, userId, updatedAt, statusHistory)}
        />
      );
    });
  };

  if (status === TIMEOFF_STATUS.DRAFTS) return null;

  return (
    <Card title={null} className={styles.RequestHistory}>
      <div className={styles.container}>
        <div className={styles.note}>
          <div className={styles.titleNote}>
            <img src={WarningIcon} alt="" />
            <span>Note - Withdrawal of requests</span>
          </div>
          <div className={styles.contentNote}>
            You can withdraw this timeoff application till one day prior to the date applied for.
            The withdraw option will not be available after that.
          </div>
        </div>
        <div className={styles.header}>History</div>
        <div>
          <Steps current={1} direction="vertical">
            {renderSteps()}
          </Steps>
        </div>
      </div>
    </Card>
  );
};

export default RequestHistory;
