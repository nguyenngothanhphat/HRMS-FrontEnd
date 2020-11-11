import React, { Component } from 'react';
import { Radio, Input, Checkbox } from 'antd';
import styles from './index.less';

class BaseAccual extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.content}>
        <div className={styles.titleText}>
          During the employee’s 1st year of employment, total casual leave accrued
        </div>
        <div className={styles.inputText}>
          <Input className={styles.input} defaultValue="0571" />
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">Day</Radio.Button>
            <Radio.Button value="d">Hours</Radio.Button>
          </Radio.Group>
        </div>
        <Checkbox>Unlimited causal leave</Checkbox>
      </div>
    );
  }
}

export default BaseAccual;
