import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { BackTop } from 'antd';
import React from 'react';
import styles from './index.less';

const GoToTop = () => {
  return (
    <div className={styles.GoToTop}>
      <BackTop>
        <VerticalAlignTopOutlined />
      </BackTop>
    </div>
  );
};

export default GoToTop;
