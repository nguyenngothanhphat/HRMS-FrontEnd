import React, { PureComponent } from 'react';
import { Steps } from 'antd';
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
          <Steps current={status === 'IN-PROGRESS' ? 1 : 2} labelPlacement="vertical">
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
