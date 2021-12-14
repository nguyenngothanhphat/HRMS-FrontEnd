import React, { Component } from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';

class HealthWellbeing extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.GroupInfoType2}>
        <div className={styles.title}>{data.title}</div>
        {data.coverageEndDate.map((item) => {
          const temp = Object.entries(item);
          return (
            <div
              key={Math.random().toString(36).substring(7)}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div className={styles.subTitle}>
                <p>{formatMessage({ id: 'component.GroupInfoType2.plan' })}</p>
                <p>{formatMessage({ id: 'component.GroupInfoType2.coverageEndDate' })}</p>
              </div>

              <div className={styles.content}>
                <p style={{ width: '100%' }}>{temp[0][0]}</p>
                <p style={{ width: '100%' }}>{temp[0][1]}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default HealthWellbeing;
