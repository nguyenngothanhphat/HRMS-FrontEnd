/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Empty } from 'antd';
// import EmptyImage from '@/assets/timeSheet/emptyImage.png';
import styles from './index.less';

const EmptyComponent = ({
  description = 'No data',
  image = '',
  height = 200,
  showDescription = true,
}) => {
  return (
    <div
      className={styles.EmptyComponent}
      style={{
        height,
      }}
    >
      <Empty description={showDescription ? description : null} {...(image ? { image } : {})} />
    </div>
  );
};
export default EmptyComponent;
