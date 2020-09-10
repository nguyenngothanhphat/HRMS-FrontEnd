import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.less';

export default function GroupInfoType2({ data, width, fullWidth }) {
  return (
    <div style={{ width: fullWidth ? '100%' : width }}>
      <div className={styles.GroupInfoType2}>
        <div className={styles.title}>
          <p>{data.title}</p>
        </div>
        <div className={styles.subTitle}>
          <p>Plan</p>
          <p>Active Till</p>
        </div>
        <div>
          {data.plans.map((x) => {
            const temp = Object.entries(x);
            return (
              <div className={styles.content}>
                <div>{temp[0][0]}</div>
                <div>{temp[0][1]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

GroupInfoType2.propTypes = {
  fullWidth: PropTypes.bool,
  width: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

GroupInfoType2.defaultProps = {
  fullWidth: false,
  width: '477px',
};
