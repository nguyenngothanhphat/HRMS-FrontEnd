import { Button } from 'antd';
import React from 'react';
import AddIcon from '@/assets/projectManagement/add.svg';
import styles from './index.less';

const CustomAddButton = (props) => {
  const { text = 'Add', onClick = () => {}, icon = '' } = props;

  return (
    <Button
      onClick={onClick}
      icon={<img src={icon || AddIcon} alt="" />}
      className={styles.CustomAddButton}
    >
      {text}
    </Button>
  );
};
export default CustomAddButton;
