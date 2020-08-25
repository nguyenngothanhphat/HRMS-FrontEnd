import React from 'react';
// import { Row, Col } from 'antd';
import styles from '../../index.less';

const ReportTab = props => {
  const { name, title, email, avatarUrl } = props;
  return (
    <div className={styles.reporter}>
      <img className={styles.avatar} src={avatarUrl} alt="avatar" />
      <div styles={styles.reportInfo}>
        <div className={styles.avatarreporter}>
          <div className={styles.name}>{name}</div>
          <div className={styles.contentTitle}>{title}</div>
          <div className={styles.email}>{email}</div>
        </div>
      </div>
    </div>
  );
};
export default ReportTab;
