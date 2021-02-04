import React, { PureComponent } from 'react';
import { Steps } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
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
    const {
      viewingLeaveRequest: {
        employee: {
          generalInfo: { firstName: fn1 = '', lastName: ln1 = '', avatar: av1 = '' } = {},
        } = {},
        approvalManager: {
          generalInfo: { firstName: fn2 = '', lastName: ln2 = '', avatar: av2 = '' } = {},
        } = {},
      } = {},
    } = this.props;

    const arr = [];
    arr.push({
      name: `${fn1} ${ln1}`,
      avatar: av1 === '' ? DefaultAvatar : av1,
    });
    arr.push({
      name: `${fn2} ${ln2}`,
      avatar: av2 === '' ? DefaultAvatar : av2,
    });
    return arr;
  };

  render() {
    const people = this.getFlow();
    const { status = '' } = this.props;

    return (
      <div className={styles.RightContent}>
        <div className={styles.content}>
          <span className={styles.title}>Chain of approval</span>
          <Steps current={status === TIMEOFF_STATUS.inProgress ? 1 : 2} labelPlacement="vertical">
            {people.map((value, index) => {
              const { avatar = '', name = '' } = value;
              return (
                <Step
                  key={`${index + 1}`}
                  icon={
                    status === TIMEOFF_STATUS.deleted ? (
                      this.renderIcon(avatar)
                    ) : (
                      <>
                        {index === 0 && this.renderIcon2(avatar)}
                        {index === 1 && (
                          <>
                            {status === TIMEOFF_STATUS.rejected &&
                              this.renderIcon(avatar, TIMEOFF_STATUS.rejected)}
                            {status === TIMEOFF_STATUS.inProgress && this.renderIcon(avatar)}
                            {(status === TIMEOFF_STATUS.accepted || status === 'ON-HOLD') &&
                              this.renderIcon2(avatar)}
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
  }
}

export default RightContent;
