import React, { PureComponent } from 'react';
import { Steps } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const { Step } = Steps;
const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DELETED, WITHDRAWN } = TIMEOFF_STATUS;
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
          src={url || DefaultAvatar}
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
          src={url || DefaultAvatar}
          alt="avatar"
        />
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </div>
    );
  };

  getFlow = () => {
    const {
      viewingLeaveRequest: {
        employee: { generalInfoInfo: { legalName: ln1 = '', avatar: av1 = '' } = {} } = {},
        approvalManager: { generalInfoInfo: { legalName: ln2 = '', avatar: av2 = '' } = {} } = {},
      } = {},
    } = this.props;

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

  render() {
    const people = this.getFlow();
    const { status = '' } = this.props;

    return (
      <div className={styles.RightContent}>
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
                      this.renderIcon(avatar)
                    ) : (
                      <>
                        {index === 0 && this.renderIcon2(avatar)}
                        {index === 1 && (
                          <>
                            {status === REJECTED && this.renderIcon(avatar, REJECTED)}
                            {(status === IN_PROGRESS || status === WITHDRAWN) &&
                              this.renderIcon(avatar)}
                            {(status === ACCEPTED || status === ON_HOLD) &&
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
