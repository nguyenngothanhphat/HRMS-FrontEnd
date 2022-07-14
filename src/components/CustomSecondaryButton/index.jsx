/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomSecondaryButton = ({ children, paddingInline = 25, ...props }) => {
  return (
    <div
      className={styles.CustomSecondaryButton}
      style={{
        paddingInline,
      }}
    >
      <Button {...props} type="link">
        {children}
      </Button>
    </div>
  );
};
export default CustomSecondaryButton;
