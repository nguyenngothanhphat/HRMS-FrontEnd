import React, { PureComponent } from 'react';
import { Steps } from 'antd';
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
    return <img className={styles.avatar} src={url} alt="avatar" />;
  };

  render() {
    const people = [
      {
        id: 1,
        body: '',
        text: 'Rose Mary',
        avatar:
          'https://i1.wp.com/nicholegabrielle.com/wp-content/uploads/2019/04/sample-avatar-003.jpg',
      },
      {
        id: 2,
        body: '',
        text: 'Aditya Venkatesan',
        avatar:
          'https://i1.wp.com/nicholegabrielle.com/wp-content/uploads/2019/04/sample-avatar-003.jpg',
      },
      {
        id: 3,
        body: '',
        text: 'Thammu Ayappa',
        avatar:
          'https://i1.wp.com/nicholegabrielle.com/wp-content/uploads/2019/04/sample-avatar-003.jpg',
      },
    ];

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
        <div className={styles.content}>
          <span className={styles.title}>Chain of approval</span>
          <Steps current={0} labelPlacement="vertical">
            {people.map((value, index) => {
              const { avatar = '', text = '' } = value;
              return <Step key={`${index + 1}`} icon={this.renderIcon(avatar)} title={text} />;
            })}
          </Steps>
        </div>
      </div>
    );
  }
}

export default RightContent;
