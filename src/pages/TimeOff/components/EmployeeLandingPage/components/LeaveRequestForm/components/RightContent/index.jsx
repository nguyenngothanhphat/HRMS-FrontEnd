import React, { PureComponent } from 'react';
// import { Steps } from 'antd';
import NoteIcon from '@/assets/NoteIcon.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

// const { Step } = Steps;
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
      <img
        onError={(e) => {
          e.target.src = DefaultAvatar;
        }}
        className={styles.avatar}
        src={url || DefaultAvatar}
        alt="avatar"
      />
    );
  };

  render() {
    return (
      <div className={styles.RightContent}>
        <div className={styles.header}>
          <div className={styles.titleWithIcon}>
            <img src={NoteIcon} alt="note" />
            <span className={styles.title}>Note</span>
          </div>
          <span className={styles.description}>
            Timeoff requests requires approvals.
            <br />
            It takes anywhere around 2-4 standard working days for the entire process to complete.
          </span>
        </div>
        {
          // <div className={styles.content}>
          //   <span className={styles.title}>Chain of approval</span>
          //   <Steps current={0} labelPlacement="vertical">
          //     {people.map((value, index) => {
          //       const { avatar = '', text = '' } = value;
          //       return <Step key={`${index + 1}`} icon={this.renderIcon(avatar)} title={text} />;
          //     })}
          //   </Steps>
          // </div>
        }
      </div>
    );
  }
}

export default RightContent;
