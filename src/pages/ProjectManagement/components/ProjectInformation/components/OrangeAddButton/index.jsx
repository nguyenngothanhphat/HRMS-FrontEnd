import { Button } from 'antd';
import React from 'react';
import AddIcon from '@/assets/projectManagement/orangeAdd.svg';
import styles from './index.less';

const OrangeAddButton = (props) => {
  const { text = 'Add', onClick = () => {}, icon = '' } = props;

  return (
    <Button
      onClick={onClick}
      icon={<img src={icon || AddIcon} alt="" />}
      className={styles.OrangeAddButton}
    >
      {text}
    </Button>
  );
};
export default OrangeAddButton;
