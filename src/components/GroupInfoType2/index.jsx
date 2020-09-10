import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.less';

export default function GroupInfoType2({ data, width, fullWidth }) {
  const plans = Object.entries(data);

  return (
    <div style={{ width: fullWidth ? '100%' : width }}>
      <div className={styles.GroupInfoType2}>
        <div className={styles.title}>{}</div>
        <div className={styles.subTitle}>
          <p>Plan</p>
          <p>Active Till</p>
        </div>
        {plans.map((item) => {
          return (
            <div className={styles.content}>
              <div>{item[0]}</div>
              <div>{item[1]}</div>
            </div>
          );
        })}
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
  width: '50%',
};
