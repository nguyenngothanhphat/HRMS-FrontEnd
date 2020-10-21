import React, { Component } from 'react';
import { Button, Input } from 'antd';
import icon from '@/assets/offboarding-schedule.svg';
import styles from './index.less';

const { TextArea } = Input;

export default class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.stepContain}>
        <div className={styles.title_Box}>
          <div>
            <img src={icon} alt="iconCheck" className={styles.icon} />
          </div>
          <span className={styles.title_Text}>
            A last working date (LWD) will generated after your request is approved by your manager
            and the HR.
            <p>
              The Last Working Day (LWD) will be generated as per our Standard Offboarding Policy.
            </p>
          </span>
        </div>
        <div className={styles.titleBody}>
          <div className={styles.center}>
            <p className={styles.textBox}> Reason for leaving us?</p>
            <p className={styles.textTime}>
              <span style={{ color: 'black' }}>22.05.20 </span>| 12PM
            </p>
          </div>
          {/* <Input className={styles.boxReason} /> */}
          <TextArea className={styles.boxReason} />
        </div>
        <div className={styles.requestHRForm}>
          <p className={styles.textBox}> Reporting Manger’s comment</p>
          <TextArea className={styles.boxHRReason} />
        </div>
      </div>
    );
  }
}
