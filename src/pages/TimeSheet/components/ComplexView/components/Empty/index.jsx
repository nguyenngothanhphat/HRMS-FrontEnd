import React from 'react';
import { Empty } from 'antd';
import EmptyImage from '@/assets/timeSheet/emptyImage.png';
import styles from './index.less';

const EmptyComponent = () => {
  return (
    <div className={styles.EmptyComponent}>
      <Empty description="No data" image={EmptyImage} />
    </div>
  );
};
export default EmptyComponent;
