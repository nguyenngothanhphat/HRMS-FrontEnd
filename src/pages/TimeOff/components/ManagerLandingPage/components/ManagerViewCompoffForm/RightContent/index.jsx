import React, { PureComponent } from 'react';
import { Steps, Spin } from 'antd';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

const { Step } = Steps;
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
        {status === TIMEOFF_STATUS.rejected && <CloseCircleTwoTone twoToneColor="#fd4546" />}
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
        employee: {
          generalInfo: { firstName: fn1 = '', lastName: ln1 = '', avatar: av1 = '' } = {},
        } = {},
      } = {},
      step2: {
        employee: {
          generalInfo: { firstName: fn2 = '', lastName: ln2 = '', avatar: av2 = '' } = {},
        } = {},
      } = {},
      step3: {
        employee: {
          generalInfo: { firstName: fn3 = '', lastName: ln3 = '', avatar: av3 = '' } = {},
        } = {},
      } = {},
    } = approvalFlow;

    const arr = [];
    arr.push({
      name: `${fn1} ${ln1}`,
      avatar: av1 === '' ? DefaultAvatar : av1,
    });
    arr.push({
      name: `${fn2} ${ln2}`,
      avatar: av2 === '' ? DefaultAvatar : av2,
    });
    arr.push({
      name: `${fn3} ${ln3}`,
      avatar: av3 === '' ? DefaultAvatar : av3,
    });
    return arr;
  };

  render() {
    const people = this.getFlow();
    const { viewingCompoffRequest: { status = '', currentStep = 0 } = {}, loading } = this.props;

    return (
      <div className={styles.RightContent}>
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
