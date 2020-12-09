import React, { Component } from 'react';
import { Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;
class RightContent extends Component {
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
          <span className={styles.title}>Note</span>
          <span className={styles.description}>
            Timeoff requests requires approvals.
            <br />
            It takes anywhere around 2-4 standard working days for the entire process to complete.
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
