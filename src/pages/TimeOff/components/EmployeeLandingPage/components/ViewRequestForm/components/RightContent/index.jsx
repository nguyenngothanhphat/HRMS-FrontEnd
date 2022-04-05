import React, { PureComponent } from 'react';
import { Steps } from 'antd';
import { history } from 'umi';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';
// import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';
import { TIMEOFF_STATUS } from '@/utils/timeOff';

const { Step } = Steps;
const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DELETED } = TIMEOFF_STATUS;
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

  renderIcon2 = (url, hideCheckIcon) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url || DefaultAvatar}
          alt="avatar"
        />
        {!hideCheckIcon && <CheckCircleTwoTone twoToneColor="#52c41a" />}
      </div>
    );
  };

  viewEmployeeProfile = (_id) => {
    history.push({
      pathname: `/directory/employee-profile/${_id}`,
    });
  };

  getFlow = () => {
    const {
      data: {
        employee: { generalInfo: { legalName: ln1 = '', avatar: av1 = '' } = {} } = {},
        approvalManager: { generalInfo: { legalName: ln2 = '', avatar: av2 = '' } = {} } = {},
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
        <div className={styles.aboveBox}>
          <div className={styles.header}>
            <span className={styles.title}>Note</span>
            <span className={styles.description}>
              <p className={styles.text1}>Withdrawal of applications/requests</p>
              <p className={styles.text2}>
                You can withdraw this timeoff application till one day prior to the date applied
                for. The withdraw option will not be available after that.
              </p>
            </span>
          </div>
        </div>
        <div className={styles.flowBox}>
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
                              {status === IN_PROGRESS && this.renderIcon(avatar)}
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
      </div>
    );
  }
}

export default RightContent;
