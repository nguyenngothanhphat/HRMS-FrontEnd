import { Button } from 'antd';
import React from 'react';
import EditIcon from '@/assets/projectManagement/edit.svg';
import styles from './index.less';

const CustomEditButton = ({
  onClick = () => {},
  image = '',
  icon = '',
  children = 'Edit',
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      icon={icon || <img src={image || EditIcon} alt="" />}
      className={styles.CustomEditButton}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </Button>
  );
};
export default CustomEditButton;
