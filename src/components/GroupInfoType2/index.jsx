import React from 'react';
import { formatMessage } from 'umi';
import styles from './styles.less';

export default function GroupInfoType2(props) {
  const { data } = props;
  return (
    <div className={styles.GroupInfoType2}>
      <div className={styles.title}>{data.title}</div>
      {data.plans.map((item) => {
        const temp = Object.entries(item);
        return (
          <div
            key={Math.random().toString(36).substring(7)}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className={styles.subTitle}>
              <p>{formatMessage({ id: 'component.GroupInfoType2.plan' })}</p>
              <p>{formatMessage({ id: 'component.GroupInfoType2.active' })}</p>
            </div>

            <div className={styles.content}>
              <p style={{ width: '50%' }}>{temp[0][0]}</p>
              <p style={{ width: '100%' }}>{temp[0][1]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
