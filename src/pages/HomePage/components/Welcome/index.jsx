import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const Welcome = (props) => {
  const { currentUser: { employee = {} || {} } = {} } = props;
  const { generalInfo: { legalName = '' } = {} || {} } = employee;

  return (
    <div className={styles.Welcome}>
      <p className={styles.Welcome__helloText}>Hello {legalName}!</p>
      <span className={styles.Welcome__notificationText}>
        You have <span className={styles.number}>0 notifications</span> today
      </span>
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(Welcome);
