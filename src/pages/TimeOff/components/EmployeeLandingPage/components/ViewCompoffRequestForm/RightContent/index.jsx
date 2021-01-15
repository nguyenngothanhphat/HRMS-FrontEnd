import React, { PureComponent } from 'react';
import { Steps } from 'antd';
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
        generalInfo: { firstName: fn1 = '', lastName: ln1 = '', avatar: av1 = '' } = {},
      } = {},
      step2: {
        generalInfo: { firstName: fn2 = '', lastName: ln2 = '', avatar: av2 = '' } = {},
      } = {},
      step3: {
        generalInfo: { firstName: fn3 = '', lastName: ln3 = '', avatar: av3 = '' } = {},
      } = {},
    } = approvalFlow;

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
    const people = this.getFlow();
    const { viewingCompoffRequest: { currentStep = 0 } = {} } = this.props;

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
          <Steps current={currentStep - 1} labelPlacement="vertical">
            {people.map((value, index) => {
              const { avatar = '', name = '' } = value;
              return <Step key={`${index + 1}`} icon={this.renderIcon(avatar)} title={name} />;
            })}
          </Steps>
        </div>
      </div>
    );
  }
}

export default RightContent;
