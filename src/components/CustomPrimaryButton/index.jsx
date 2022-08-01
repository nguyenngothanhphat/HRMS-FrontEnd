/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomPrimaryButton = ({ children, height = 42, backgroundColor = '#ffa100', ...props }) => {
  return (
    <Button
      {...props}
      className={styles.CustomPrimaryButton}
      style={{
        height,
        backgroundColor,
      }}
    >
      {children}
    </Button>
  );
};
export default CustomPrimaryButton;
