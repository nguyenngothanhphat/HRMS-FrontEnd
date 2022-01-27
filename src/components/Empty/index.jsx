import React from 'react';
import { Empty } from 'antd';
import EmptyImage from '@/assets/timeSheet/emptyImage.png';
import styles from './index.less';

const EmptyComponent = (props) => {
  const { description = 'No data', image = EmptyImage } = props;

  return (
    <div className={styles.EmptyComponent}>
      <Empty description={description} image={image} />
    </div>
  );
};
export default EmptyComponent;
