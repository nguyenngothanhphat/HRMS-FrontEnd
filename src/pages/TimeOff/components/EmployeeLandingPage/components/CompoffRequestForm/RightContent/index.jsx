import React, { PureComponent } from 'react';
import { Steps, Spin } from 'antd';
import NoteIcon from '@/assets/NoteIcon.svg';
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
        <img src={url} alt="avatar" />
      </div>
    );
  };

  getFlow = () => {
    const {
      compoffApprovalFlow: {
        step1: {
          generalInfo: { firstName: fn1 = '', lastName: ln1 = '', avatar: av1 = '' } = {},
        } = {},
        step2: {
          generalInfo: { firstName: fn2 = '', lastName: ln2 = '', avatar: av2 = '' } = {},
        } = {},
        step3: {
          generalInfo: { firstName: fn3 = '', lastName: ln3 = '', avatar: av3 = '' } = {},
        } = {},
      } = {},
    } = this.props;

    const arr = [];
    arr.push({
      name: `${fn1} ${ln1}`,
      avatar:
        av1 === ''
          ? 'https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png'
          : av1,
    });
    arr.push({
      name: `${fn2} ${ln2}`,
      avatar:
        av2 === ''
          ? 'https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png'
          : av2,
    });
    arr.push({
      name: `${fn3} ${ln3}`,
      avatar:
        av3 === ''
          ? 'https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png'
          : av3,
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
