import React, { PureComponent } from 'react';
import { Steps, Spin } from 'antd';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

const { Step } = Steps;
class RightContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderIcon = (url) => {
    return (
      <div className={styles.avatar}>
        <img src={url} alt="avatar" />
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
    const { viewingCompoffRequest: { currentStep = 0 } = {}, loading } = this.props;

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
                  return <Step key={`${index + 1}`} icon={this.renderIcon(avatar)} title={name} />;
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
