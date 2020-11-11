import React, { Component } from 'react';
import { Radio, Input, Select, Button } from 'antd';
import styles from './index.less';

class TenuaAccrua extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.contentTenua}>
        <div className={styles.titleText}>
          During the employee’s <Input className={styles.input} defaultValue="0571" /> year of
          employment, total casual leave accrued
          <Input className={styles.input} />
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">Day</Radio.Button>
            <Radio.Button value="d">Hours</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.effectFrom}>
          <div className={styles.text}> Effective from</div>
          <Select className={styles.select} />
        </div>
        <Button className={styles.btnAdd}>Add a new tenure accrual rate</Button>
      </div>
    );
  }
}

export default TenuaAccrua;
