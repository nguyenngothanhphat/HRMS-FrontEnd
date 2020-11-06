import React, { Component } from 'react';
import styles from './index.less';

class TimeoffType extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.TimeoffType}>
        <div className={styles.TimeoffContain}>
          <div className={styles.TimeoffFrom}>
            <div className={styles.Content}> Configure Casual leave policy</div>
            <div className={styles.SubContent}>
              Casual Leave or CL is granted to an eligible employee if they cannot report to work
              due to an unforeseen situation. Casual leave can also be utilised if an eligible
              employee wants to take leave for a couple of days for personal reasons.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TimeoffType;
