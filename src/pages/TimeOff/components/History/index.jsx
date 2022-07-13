import { Card, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [indexWithdraw, setIndexWithdraw] = useState(0);

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
      case TIMEOFF_HISTORY_STATUS.WAITING:
        return 'Waiting for Approval';
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
        return 'Withdraw';
      default:
        return 'Applied';
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
              {renderStatusName(statusProp)}
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
        return <img src={CheckIcon} alt="" />;
      case TIMEOFF_HISTORY_STATUS.REJECTED:
      case TIMEOFF_HISTORY_STATUS.WITHDRAW:
        return <img src={ErrorIcon} alt="" />;
      default:
        return <img src={DotIcon} alt="" />;
    }
  };

  const renderSteps = () => {
    const people = getFlow();
    return people.map((item, index) => {
      const { name = '', avatar = '', statusHistory = '', updatedAt = '' } = item;
      return (
        <>
          <Step
            className={`${
              people[index + 1]?.statusHistory !== TIMEOFF_HISTORY_STATUS.WAITING
                ? styles.steps__solid
                : styles.step__dashed
            } 
              ${
                status === TIMEOFF_STATUS.WITHDRAWN && index > indexWithdraw
                  ? styles.steps__withdraw
                  : ''
              }`}
            icon={renderIcon(statusHistory)}
            description={renderImg(name, avatar, updatedAt, statusHistory)}
          />
        </>
      );
    });
  };

  if (status === TIMEOFF_STATUS.DRAFTS) return null;

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
        <div>
          <Steps current={1} direction="vertical">
            {renderSteps()}
          </Steps>
        </div>
      </div>
    </Card>
  );
};

export default History;
