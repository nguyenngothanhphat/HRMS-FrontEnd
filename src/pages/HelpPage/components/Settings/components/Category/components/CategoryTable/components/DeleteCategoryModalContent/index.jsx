import { Form } from 'antd';
import React from 'react';
import { connect } from 'umi';

const DeleteCategoryModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    onClose = () => {},
    item: { _id = '', category = '' } = {},
    refreshData = () => {},
  } = props;

  const handleFinish = () => {
    dispatch({
      type: 'helpPage/deleteHelpCategory',
      payload: {
        id: _id,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        refreshData();
      }
    });
  };

  return (
    <Form form={form} name="deleteForm" onFinish={handleFinish}>
      <div
        style={{
          padding: 24,
        }}
      >
        Are you sure you want to delete the item <strong>{category}</strong>?
      </div>
    </Form>
  );
};

export default connect(() => ({}))(DeleteCategoryModalContent);
