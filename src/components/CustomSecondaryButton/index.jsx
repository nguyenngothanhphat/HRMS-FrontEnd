/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomSecondaryButton = ({ children, ...props }) => {
  return (
    <div className={styles.CustomSecondaryButton}>
      <Button {...props} type="link">
        {children}
      </Button>
    </div>
  );
};
export default CustomSecondaryButton;
