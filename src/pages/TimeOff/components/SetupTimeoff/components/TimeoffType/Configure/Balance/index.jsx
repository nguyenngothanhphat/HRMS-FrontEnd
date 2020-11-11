import React, { Component } from 'react';
import { Checkbox, Input, Radio } from 'antd';
import styles from './index.less';

class AccrualSchedule extends Component {
  onChange = () => {};

  renderItem = (render) => {
    return (
      <div className={styles.content}>
        <div className={styles.borderBotton}>
          <div className={styles.titleText}>{render.title}</div>
          <div className={styles.inputText}>
            <span> {render.subText}</span>
            <Input className={styles.input} defaultValue="0571" />
            <Radio.Group defaultValue="a" buttonStyle="solid">
              <Radio.Button value="a">Day</Radio.Button>
              <Radio.Button value="d">Hours</Radio.Button>
            </Radio.Group>
          </div>
          <Checkbox className={styles.checkbox}>{render.inputCheckbox}</Checkbox>
        </div>
      </div>
    );
  };

  render() {
    const array = [
      {
        title: 'Maxinum balance',
        inputText: 'At a time, employees cannot have a casual leave balance greater than',
        inputCheckbox: 'Do not limit employee Casual leave balance',
      },
      {
        title: 'Negative balances',
        inputText: 'Employees can apply for casual leaves that make their balances negative unto',
        inputCheckbox: 'Unlimited negative balances',
      },
    ];

    return (
      <div className={styles.accrualContent}>{array.map((render) => this.renderItem(render))}</div>
    );
  }
}

export default AccrualSchedule;
