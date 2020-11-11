import React, { Component } from 'react';
import { Radio, Input, Checkbox } from 'antd';
import styles from './index.less';

class WaitingPeriod extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.contentWaiting}>
        <div className={styles.titleText}>
          <span className={styles.text}>
            Employees can carryover casual leaves from one year to next uptown
          </span>
          <Input className={styles.input} />
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">Day</Radio.Button>
            <Radio.Button value="d">Hours</Radio.Button>
          </Radio.Group>
        </div>
        <Checkbox>Do not limit number of hours/days employee carryover</Checkbox>
      </div>
    );
  }
}

export default WaitingPeriod;
