import React, { useState } from 'react';
import { Modal, Input, Form, Button, DatePicker } from 'antd';
// import moment from 'moment';

import styles from './index.less';

const dateFormat = 'YYYY/MM/DD';

const { TextArea } = Input;

const ModalTerminate = (props) => {
  const [form] = Form.useForm();
  const [date, setDate] = useState('');

  const {
    visible = false,
    valueReason = '',
    // onChange = () => {},
    handleSubmit = () => {},
    handleCandelModal = () => {},
  } = props;

  const handleFinish = (values) => {
    handleSubmit(values);
  };

  const changeDate = (_, dateValue) => {
    setDate(dateValue);
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
        <div className={styles.titleModal}>Terminate employee</div>
        <Form
          form={form}
          onFinish={handleFinish}
          preserve={false}
          initialValues={{ reason: valueReason }}
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
          <Form.Item
            label="Working Day"
            name="workingDay"
            className={styles.datePickerForm}
            rules={[
              {
                required: true,
                message: 'Please choose date !',
              },
            ]}
          >
            <DatePicker className={styles.datePicker} format={dateFormat} onChange={changeDate} />
          </Form.Item>
          <Form.Item className={styles.flexContent}>
            <Button
              className={`${styles.btnGroup} ${styles.btnCancel}`}
              onClick={handleCandelModal}
            >
              Cancel
            </Button>
            <Button className={`${styles.btnGroup} ${styles.btnSubmit}`} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalTerminate;
