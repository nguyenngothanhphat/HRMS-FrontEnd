import { Card } from 'antd';
import React from 'react';
import styles from './index.less';

const NewJoinees = () => {
  const renderOption = () => {
    return <div className={styles.options}>option</div>;
  };

  return (
    <Card title="NewJoinees" extra={renderOption()} className={styles.NewJoinees}>
      New Joinees
    </Card>
  );
};

export default NewJoinees;
