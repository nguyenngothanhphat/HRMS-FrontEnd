import { Card, Steps } from 'antd';
import React from 'react';
import moment from 'moment';
import WarningIcon from '@/assets/timeOff/warning.svg';
import CheckIcon from '@/assets/timeOff/check.svg';
import ErrorIcon from '@/assets/timeOff/error.svg';
import DotIcon from '@/assets/timeOff/dot.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';
import { TIMEOFF_STATUS } from '@/utils/timeOff';

const { Step } = Steps;

const History = (props) => {
  const {
    status = '',
    data,
    data: {
      employee: { generalInfoInfo: { legalName: ln1 = '', avatar: av1 = '' } = {} } = {},
      approvalManager: { generalInfoInfo: { legalName: ln2 = '', avatar: av2 = '' } = {} } = {},
      updatedAt = '',
    } = {},
  } = props;
  console.log('🚀 ~ status', status);
  console.log('🚀 ~ data', data);

  const getFlow = () => {
    const arr = [];
    arr.push({
      name: ln1,
      avatar: av1 || DefaultAvatar,
    });
    arr.push({
      name: ln2,
      avatar: av2 || DefaultAvatar,
    });
    return arr;
  };

  const renderColorStatus = () => {
    switch (status) {
      case TIMEOFF_STATUS.IN_PROGRESS:
      case TIMEOFF_STATUS.EDITED:
        return { color: '#2C6DF9' };
      case TIMEOFF_STATUS.REJECTED:
        return { color: '#F04438' };
      case TIMEOFF_STATUS.ACCEPTED:
        return { color: '#12B76A' };
      case TIMEOFF_STATUS.WAITING_APPROVAL:
      case TIMEOFF_STATUS.WITHDRAWN:
        return { color: '#FFA100' };
      default:
        return { color: '#2C6DF9' };
    }
  };

  const renderImg = (name, avatar) => {
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
            <span className={styles.status} style={renderColorStatus()}>
              Applied
            </span>{' '}
            <span className={styles.date}>
              on {moment(updatedAt).format('MM DD YYYY')} | {moment(updatedAt).format('H:mm a')}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderIcon = () => {
    switch (status) {
      case TIMEOFF_STATUS.IN_PROGRESS:
      case TIMEOFF_STATUS.ACCEPTED:
      case TIMEOFF_STATUS.WITHDRAWN:
        return <img src={CheckIcon} alt="" />;
      case TIMEOFF_STATUS.REJECTED:
        return <img src={ErrorIcon} alt="" />;
      default:
        return <img src={DotIcon} alt="" />;
    }
  };

  const renderSteps = () => {
    const people = getFlow();
    return people.map((item) => {
      const { name = '', avatar = '' } = item;
      return (
        <>
          <Step icon={renderIcon()} description={renderImg(name, avatar)} />
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
            status !== TIMEOFF_STATUS.WAITING_APPROVAL ? styles.steps__solid : styles.step__dashed
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
