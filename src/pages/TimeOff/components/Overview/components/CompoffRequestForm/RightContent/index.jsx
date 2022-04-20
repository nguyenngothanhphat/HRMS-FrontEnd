import React, { PureComponent } from 'react';
import { Steps, Spin } from 'antd';
import NoteIcon from '@/assets/NoteIcon.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';

import styles from './index.less';

const { Step } = Steps;
class RightContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // customDot = (dot, { status, index }) => {
  //   console.log('status', status);
  //   return this.renderIcon('https://cdn.iconscout.com/icon/free/png-256/avatar-367-456319.png');
  // };

  renderIcon = (url) => {
    return (
      <div className={styles.avatar}>
        <img
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
          src={url}
          alt="avatar"
        />
      </div>
    );
  };

  getFlow = () => {
    const {
      compoffApprovalFlow: {
        step1: { generalInfo: { legalName: legalName1 = '', avatar: av1 = '' } = {} } = {},
        step2: { generalInfo: { legalName: legalName2 = '', avatar: av2 = '' } = {} } = {},
        step3: { generalInfo: { legalName: legalName3 = '', avatar: av3 = '' } = {} } = {},
      } = {},
    } = this.props;

    const arr = [];
    arr.push({
      name: legalName1,
      avatar: av1 === '' ? DefaultAvatar : av1,
    });
    arr.push({
      name: legalName2,
      avatar: av2 === '' ? DefaultAvatar : av2,
    });
    arr.push({
      name: legalName3,
      avatar: av3 === '' ? DefaultAvatar : av3,
    });
    return arr;
  };

  render() {
    const { compoffApprovalFlow = {}, loading } = this.props;

    return (
      <div className={styles.RightContent}>
        <div className={styles.header}>
          <div className={styles.titleWithIcon}>
            <img src={NoteIcon} alt="note" />
            <span className={styles.title}>Note</span>
          </div>
          <span className={styles.description}>
            Compoff requests requires approvals.
            <br />
            Once the compoff request is approved, a compoff balance will be shown with you leave
            balance. You can apply for compoff leave then.
          </span>
        </div>

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
            {Object.keys(compoffApprovalFlow).length !== 0 && (
              <div className={styles.content}>
                <span className={styles.title}>Chain of approval</span>
                <Steps current={0} labelPlacement="vertical">
                  {this.getFlow().map((value, index) => {
                    const { avatar = '', name = '' } = value;
                    return (
                      <Step key={`${index + 1}`} icon={this.renderIcon(avatar)} title={name} />
                    );
                  })}
                </Steps>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default RightContent;
