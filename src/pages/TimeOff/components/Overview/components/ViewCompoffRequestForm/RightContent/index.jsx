import React, { PureComponent } from 'react';
import { Steps, Spin } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import styles from './index.less';

const { Step } = Steps;
const { REJECTED } = TIMEOFF_STATUS;
class RightContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderIcon = (url, status) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url}
          alt="avatar"
        />
        {status === REJECTED && <CloseCircleTwoTone twoToneColor="#fd4546" />}
      </div>
    );
  };

  renderIcon2 = (url) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url}
          alt="avatar"
        />
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </div>
    );
  };

  getFlow = () => {
    const { viewingCompoffRequest: { approvalFlow = {} } = {} } = this.props;
    const {
      step1: {
        employee: { generalInfo: { legalName: ln1 = '', avatar: av1 = '' } = {} } = {},
      } = {},
      step2: {
        employee: { generalInfo: { legalName: ln2 = '', avatar: av2 = '' } = {} } = {},
      } = {},
      step3: {
        employee: { generalInfo: { legalName: ln3 = '', avatar: av3 = '' } = {} } = {},
      } = {},
    } = approvalFlow;

    const arr = [];
    arr.push({
      name: ln1,
      avatar: av1 === '' ? DefaultAvatar : av1,
    });
    arr.push({
      name: ln2,
      avatar: av2 === '' ? DefaultAvatar : av2,
    });
    arr.push({
      name: ln3,
      avatar: av3 === '' ? DefaultAvatar : av3,
    });
    return arr;
  };

  render() {
    const people = this.getFlow();
    const { viewingCompoffRequest: { status = '', currentStep = 0 } = {}, loading } = this.props;

    return (
      <div className={styles.RightContent}>
        <div className={styles.header}>
          <span className={styles.title}>Note</span>
          <span className={styles.description}>
            <p className={styles.text1}>Withdrawal of applications/requests</p>
            <p className={styles.text2}>You can withdraw this compoff application...</p>
          </span>
        </div>

        <div className={styles.content}>
          <span className={styles.title}>Chain of approval</span>
          {loading ? (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px 0',
                }}
              >
                <Spin size="medium" />
              </div>
            </>
          ) : (
            <>
              <Steps current={currentStep - 1} labelPlacement="vertical">
                {people.map((value, index) => {
                  const { avatar = '', name = '' } = value;
                  return (
                    <Step
                      key={`${index + 1}`}
                      icon={
                        index < currentStep - 1
                          ? this.renderIcon2(avatar)
                          : this.renderIcon(avatar, status)
                      }
                      title={name}
                    />
                  );
                })}
              </Steps>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default RightContent;
