import { Button } from 'antd';
import React from 'react';
import AddIcon from '@/assets/projectManagement/add.svg';
import styles from './index.less';

const CustomAddButton = (props) => {
  const { children = 'Add', onClick = () => {}, icon = '' } = props;

  return (
    <Button
      onClick={onClick}
      icon={<img src={icon || AddIcon} alt="" />}
      className={styles.CustomAddButton}
    >
      {children}
    </Button>
  );
};
export default CustomAddButton;
