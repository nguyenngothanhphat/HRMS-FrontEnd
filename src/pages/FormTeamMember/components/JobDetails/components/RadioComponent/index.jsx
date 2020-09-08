import React, { Component } from 'react';
import { Radio } from 'antd';
import styles from './index.less';
class RadioComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { Tab } = this.props;
    return (
      <div className={styles.RadioComponent}>
        <p>{Tab.positionTab.title}</p>
        <Radio.Group className={styles.Padding} defaultValue={Tab.positionTab.arr[0].value}>
          {Tab.positionTab.arr.map((data) => (
            <Radio className={styles.paddingRightRadio} value={data.value}>
              <span>{data.position}</span>
            </Radio>
          ))}
        </Radio.Group>
        <p className={styles.paddingBotTitle}>{Tab.classificationTab.title}</p>
        <Radio.Group
          className={styles.paddingRadio}
          defaultValue={Tab.classificationTab.arr[0].value}
        >
          {Tab.classificationTab.arr.map((data) => (
            <Radio className={styles.Radio} value={data.value}>
              <span>{data.classification}</span>
            </Radio>
          ))}
        </Radio.Group>
      </div>
    );
  }
}

export default RadioComponent;
