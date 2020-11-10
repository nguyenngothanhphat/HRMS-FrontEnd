import React, { Component } from 'react';
import { Checkbox, DatePicker } from 'antd';
import styles from './index.less';

class AnnualReset extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.annualContent}>
        <div className={styles.titleText}>
          <span className={styles.text}>Employees Casual leave balance resets to 0 on</span>
          <DatePicker className={styles.datePicker} />
        </div>
        <Checkbox>Reset annually</Checkbox>
      </div>
    );
  }
}

export default AnnualReset;
