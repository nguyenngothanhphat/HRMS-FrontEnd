import { Card } from 'antd';
import React from 'react';
import styles from './index.less';

const People = () => {
  const renderOption = () => {
    return <div className={styles.options}>option</div>;
  };

  return (
    <Card title="People" extra={renderOption()} className={styles.People}>
      People
    </Card>
  );
};

export default People;
