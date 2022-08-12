import { Form } from 'antd';
import React from 'react';
import { connect } from 'umi';

const DeleteQuestionModalContent = (props) => {
  const { dispatch, onClose = () => {}, refreshData = () => {}, item: { id = '' } = {} } = props;
  const { item: { question = '' } = {} } = props;

  const handleFinish = () => {
    dispatch({
      type: 'helpPage/deleteQuestion',
      payload: {
        id,
      },
    }).then((res) => {
      if (res?.statusCode === 200) {
        onClose();
        refreshData();
      }
    });
  };

  return (
    <Form name="deleteForm" onFinish={handleFinish}>
      <div
        style={{
          padding: 24,
        }}
      >
        Are you sure you want to delete the item <strong>{question}</strong>?
      </div>
    </Form>
  );
};

export default connect(() => ({}))(DeleteQuestionModalContent);
