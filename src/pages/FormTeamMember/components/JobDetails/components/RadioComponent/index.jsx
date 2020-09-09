import React, { Component } from 'react';
import { Radio, Typography } from 'antd';
import styles from './index.less';
class RadioComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { Tab } = this.props;
    return (
      <div className={styles.RadioComponent}>
        <Typography.Title level={5}>{Tab.positionTab.title}</Typography.Title>
        <Radio.Group className={styles.Padding} defaultValue={Tab.positionTab.arr[0].value}>
          {Tab.positionTab.arr.map((data) => (
            <Radio className={styles.paddingRightRadio} value={data.value}>
              <Typography.Text>{data.position}</Typography.Text>
            </Radio>
          ))}
        </Radio.Group>
        <Typography.Title level={5} className={styles.paddingBotTitle}>
          {Tab.classificationTab.title}
        </Typography.Title>
        <Radio.Group
          className={styles.paddingRadio}
          defaultValue={Tab.classificationTab.arr[0].value}
        >
          {Tab.classificationTab.arr.map((data) => (
            <Radio className={styles.Radio} value={data.value}>
              <Typography.Text>{data.classification}</Typography.Text>
            </Radio>
          ))}
        </Radio.Group>
      </div>
    );
  }
}

export default RadioComponent;
