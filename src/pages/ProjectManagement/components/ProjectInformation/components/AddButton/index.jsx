import { Button } from 'antd';
import React from 'react';
import AddIcon from '@/assets/projectManagement/add.svg';
import styles from './index.less';

const AddButton = (props) => {
  const { text = 'Add', onClick = () => {} } = props;

  return (
    <Button onClick={onClick} icon={<img src={AddIcon} alt="" />} className={styles.AddButton}>
      {text}
    </Button>
  );
};
export default AddButton;
