import { Form } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const DeleteCommentModalContent = (props) => {
  const { dispatch, refreshData, onClose = () => {}, handlingRow = {} } = props;

  const handleFinish = async () => {
    await dispatch({
      type: 'resourceManagement/updateComment',
      payload: {
        commentResource: '',
        _id: handlingRow?.employeeId,
      },
    });
    onClose();
    refreshData();
  };

  return (
    <div className={styles.DeleteCommentModalContent}>
      <Form name="delete" id="deleteForm" onFinish={handleFinish}>
        <span>Are you sure to delete this comment?</span>
      </Form>
    </div>
  );
};

export default connect(() => ({}))(DeleteCommentModalContent);
