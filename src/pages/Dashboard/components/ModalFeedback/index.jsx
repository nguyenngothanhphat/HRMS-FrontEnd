import React, { useState } from 'react';
import { Modal, Input, Form, Button } from 'antd';

import styles from './index.less';

const { TextArea } = Input;

const ModalFeedback = (props) => {
  const [form] = Form.useForm();

  const { visible = false, handleCandelModal = () => {} } = props;

  const handleFinish = (values) => {
    console.log(values);
  };

  return (
    <Modal
      visible={visible}
      className={styles.terminateModal}
      title={false}
      onCancel={handleCandelModal}
      destroyOnClose
      footer={false}
    >
      <div className={styles.contentModal}>
        <div className={styles.titleModal}>Feedback</div>
        <Form
          form={form}
          onFinish={handleFinish}
          preserve={false}
          //   initialValues={{ reason: valueReason }}
        >
          <Form.Item
            label="Reason"
            name="reason"
            className={styles.formModal}
            rules={[
              {
                pattern: /^[\W\S_]{0,1000}$/,
                message: 'Only fill up to 1000 characters !',
              },
              {
                required: true,
                message: 'Please input field !',
              },
            ]}
          >
            <TextArea
              className={styles.fieldModal}
              placeholder="Fill in the box..."
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item className={styles.flexContent}>
            <Button
              className={`${styles.btnGroup} ${styles.btnSubmit}`}
              htmlType="submit"
              //   loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalFeedback;
