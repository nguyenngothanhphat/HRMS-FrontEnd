import React from 'react';
import { Steps } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/avtDefault.jpg';
// import CheckIcon from '@/assets/offboarding/check.svg';
import { OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const { Step } = Steps;
const { IN_PROGRESS, ACCEPTED, REJECTED, DELETED } = OFFBOARDING.STATUS;

const ChainOfApproval = (props) => {
  const {
    data: {
      hr: { generalInfoInfo: { legalName: ln2 = '', avatar: av2 = '' } } = {},
      manager: { generalInfoInfo: { legalName: ln1 = '', avatar: av1 = '' } = {} } = {},
    } = {},
    status = '',
    hrStatus = '',
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
                          {status === ACCEPTED && hrStatus === IN_PROGRESS && renderIcon(avatar)}
                          {status === ACCEPTED && hrStatus === ACCEPTED && renderIcon2(avatar)}
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
