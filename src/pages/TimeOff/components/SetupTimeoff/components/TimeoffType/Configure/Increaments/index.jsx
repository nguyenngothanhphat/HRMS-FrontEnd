import React, { Component } from 'react';
import { Radio, Input, DatePicker, Checkbox } from 'antd';
import styles from './index.less';

class Increaments extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.contentIncreaments}>
        <div className={styles.titleText}>
          <span className={styles.text}>
            Employees can apply for casual leaves in a minimum increments of
          </span>
          <Input className={styles.input} />
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">Day</Radio.Button>
            <Radio.Button value="d">Hours</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.effectFrom}>
          <div className={styles.text}> Effective from</div>
          <DatePicker className={styles.timePicker} />
        </div>
        <Checkbox>Do not impose a minimum increment</Checkbox>
      </div>
    );
  }
}

export default Increaments;
