import React, { Component } from 'react';
import { Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;
class RightContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.RightContent}>
        <div className={styles.header}>
          <span className={styles.title}>Note</span>
          <span className={styles.description}>
            <p className={styles.text1}>Withdrawal of applications/requests</p>
            <p className={styles.text2}>
              You can withdraw this timeoff application till one day prior to the date applied for.
              The withdraw option will not be available after that.
            </p>
          </span>
        </div>
      </div>
    );
  }
}

export default RightContent;
