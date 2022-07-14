/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import React from 'react';
import EditIcon from '@/assets/edit.svg';
import styles from './index.less';

const EditButton = ({ children, paddingInline = 10, ...props }) => {
  return (
    <div
      className={styles.EditButton}
      style={{
        paddingInline,
      }}
    >
      <Button {...props} icon={<img src={EditIcon} alt="" />}>
        {children || 'Edit'}
      </Button>
    </div>
  );
};
export default EditButton;
