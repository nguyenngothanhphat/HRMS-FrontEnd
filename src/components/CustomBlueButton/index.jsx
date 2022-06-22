/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomBlueButton = ({ children, ...props }) => {
  return (
    <div className={styles.CustomBlueButton}>
      <Button {...props}>{children}</Button>
    </div>
  );
};
export default CustomBlueButton;
