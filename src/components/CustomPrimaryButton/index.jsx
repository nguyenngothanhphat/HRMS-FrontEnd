/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomPrimaryButton = (props) => {
  const { title = '' } = props;

  return (
    <Button {...props} className={styles.CustomPrimaryButton}>
      {title}
    </Button>
  );
};
export default CustomPrimaryButton;
