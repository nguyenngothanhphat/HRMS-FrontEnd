import React, { Component } from 'react';
import icon from '@/assets/offboarding-schedule.svg';
import styles from './index.less';

export default class ResignationLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
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
            <p> Reason for leaving us?</p>
            <span>22.05.20 | 12PM</span>
          </div>
          <div className={styles.boxReason}>
            The reason I have decided to end my journey with Lollypop here is because…The reason I
            have decided to end my journey with Lollypop here is because…The reason I have decided
            to end my journey with Lollypop here is because…The reason I have decided to end my
            journey with Lollypop here is because…The reason I have decided to end my journey with
            Lollypop here is because…The reason I have decided to end my journey with Lollypop here
            is because…The reason I have decided to end my journey with Lollypop here is because…The
            reason I have decided to end my journey with Lollypop here is because…The reason I have
            decided to end my journey with Lollypop here is because…
          </div>
        </div>
      </div>
    );
  }
}
