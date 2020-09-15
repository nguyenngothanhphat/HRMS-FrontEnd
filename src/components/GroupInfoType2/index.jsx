import React from 'react';
import PropTypes from 'prop-types';
import { formatMessage } from 'umi';
import styles from './styles.less';

export default function GroupInfoType2({ data }) {
  return (
    <div className={styles.GroupInfoType2}>
      <div className={styles.title}>{data.title}</div>
      {data.plans.map((item) => {
        const temp = Object.entries(item);
        return (
          <div style={{ display: 'flex' }}>
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

GroupInfoType2.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};
