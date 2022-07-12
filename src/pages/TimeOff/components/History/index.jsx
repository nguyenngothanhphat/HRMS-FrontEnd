import { Card, Steps } from 'antd';
import React from 'react';
import moment from 'moment';
import WarningIcon from '@/assets/timeOff/warning.svg';
import CheckIcon from '@/assets/timeOff/check.svg';
import ErrorIcon from '@/assets/timeOff/error.svg';
import DotIcon from '@/assets/timeOff/dot.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';
import { TIMEOFF_HISTORY_STATUS, TIMEOFF_STATUS } from '@/utils/timeOff';

const { Step } = Steps;

const History = (props) => {
  const { status = '', data, data: { history = [] } = {} } = props;
  console.log('🚀 ~ data', data);

  const getFlow = () => {
    const array = history.map((item) => {
      const {
        employee: { generalInfoInfo: { legalName = '', avatar = '' } = {} },
        status: statusHistory = '',
        updatedAt = '',
      } = item;
      return {
        name: legalName,
        avatar: avatar || DefaultAvatar,
        statusHistory,
        updatedAt,
      };
    });

    return array;
  };

  const renderColorStatus = (statusProp) => {
    switch (statusProp) {
      case TIMEOFF_HISTORY_STATUS.APPLIED:
      case TIMEOFF_HISTORY_STATUS.EDITED:
        return { color: '#2C6DF9' };
      case TIMEOFF_HISTORY_STATUS.REJECTED:
        return { color: '#F04438' };
      case TIMEOFF_HISTORY_STATUS.APPROVED:
        return { color: '#12B76A' };
      case TIMEOFF_HISTORY_STATUS.WAITING:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
        return { color: '#FFA100' };
      default:
        return { color: '#2C6DF9' };
    }
  };

  const renderImg = (name, avatar, updatedAt, statusProp) => {
    return (
      <>
        <img
          className={styles.avatar}
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={avatar || DefaultAvatar}
          alt="avatar"
        />
        <div>
          <div className={styles.nameStep}>{name}</div>
          <div className={styles.containerStatus}>
            <span className={styles.status} style={renderColorStatus(statusProp)}>
              {statusProp === TIMEOFF_HISTORY_STATUS.WAITING
                ? 'Waiting for Approval'
                : statusProp?.toLowerCase()}
            </span>{' '}
            {statusProp !== TIMEOFF_HISTORY_STATUS.WAITING && (
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
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
        return <img src={CheckIcon} alt="" />;
      case TIMEOFF_HISTORY_STATUS.REJECTED:
        return <img src={ErrorIcon} alt="" />;
      default:
        return <img src={DotIcon} alt="" />;
    }
  };

  const renderSteps = () => {
    const people = getFlow();
    return people.map((item) => {
      const { name = '', avatar = '', statusHistory = '', updatedAt = '' } = item;
      return (
        <>
          <Step
            icon={renderIcon(statusHistory)}
            description={renderImg(name, avatar, updatedAt, statusHistory)}
          />
        </>
      );
    });
  };

  return (
    <Card title={null} className={styles.History}>
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
        <div
          className={
            status && status !== TIMEOFF_STATUS.IN_PROGRESS
              ? styles.steps__solid
              : styles.step__dashed
          }
        >
          <Steps current={1} direction="vertical">
            {renderSteps()}
          </Steps>
        </div>
      </div>
    </Card>
  );
};

export default History;
