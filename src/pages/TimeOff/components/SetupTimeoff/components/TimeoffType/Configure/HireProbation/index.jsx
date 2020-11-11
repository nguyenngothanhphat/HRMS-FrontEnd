import React, { Component } from 'react';
import { Radio, Input } from 'antd';
import styles from './index.less';

class HireProbation extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.contentIncreaments}>
        <div className={styles.titleText}>
          <span className={styles.text}>
            Should new hires have their casual leave balance prorated for the 1st year?
          </span>
          <Input className={styles.input} />
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">Day</Radio.Button>
            <Radio.Button value="d">Hours</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

export default HireProbation;
