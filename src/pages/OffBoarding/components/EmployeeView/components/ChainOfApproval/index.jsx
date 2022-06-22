import React from 'react';
import { Steps } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const { Step } = Steps;
const { IN_PROGRESS, ACCEPTED, REJECTED, DELETED, DRAFT } = OFFBOARDING.STATUS;

const ChainOfApproval = (props) => {
  const {
    employee: {
      generalInfo: { legalName: ln1 = '', avatar: av1 = '' } = {},
      managerInfo: { generalInfoInfo: { legalName: ln2 = '', avatar: av2 = '' } = {} } = {},
    } = {},
    status = '',
  } = props;

  const renderIcon = (url, statusProps) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url || DefaultAvatar}
          alt="avatar"
        />
        {statusProps === REJECTED && <CloseCircleTwoTone twoToneColor="#fd4546" />}
      </div>
    );
  };

  const renderIcon2 = (url) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url || DefaultAvatar}
          alt="avatar"
        />
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </div>
    );
  };

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

  const people = getFlow();

  return (
    <div className={styles.ChainOfApproval}>
      <div className={styles.content}>
        <span className={styles.title}>Chain of approval</span>
        <Steps current={status === IN_PROGRESS ? 1 : 2} labelPlacement="vertical">
          {people.map((value, index) => {
            const { avatar = '', name = '' } = value;
            return (
              <Step
                key={`${index + 1}`}
                icon={
                  status === DELETED ? (
                    renderIcon(avatar)
                  ) : (
                    <>
                      {index === 0 && renderIcon2(avatar)}
                      {index === 1 && (
                        <>
                          {status === REJECTED && renderIcon(avatar, REJECTED)}
                          {(status === IN_PROGRESS || status === DRAFT) && renderIcon(avatar)}
                          {status === ACCEPTED && renderIcon2(avatar)}
                        </>
                      )}
                    </>
                  )
                }
                title={name}
              />
            );
          })}
        </Steps>
      </div>
    </div>
  );
};

export default ChainOfApproval;
