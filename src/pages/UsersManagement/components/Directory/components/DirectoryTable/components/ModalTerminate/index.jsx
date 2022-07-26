import { Button, DatePicker, Form, Input, Modal } from 'antd';
import moment from 'moment';
import React from 'react';

import styles from './index.less';

const dateFormat = 'MM.DD.YY';

const { TextArea } = Input;

const ModalTerminate = (props) => {
  const [form] = Form.useForm();

  const {
    visible = false,
    valueReason = '',
    // onChange = () => {},
    handleSubmit = () => {},
    handleCancelModal = () => {},
    loading,
  } = props;

  const handleFinish = (values) => {
    handleSubmit(values);
  };

  return (
    <Modal
      visible={visible}
      className={styles.terminateModal}
      title={false}
      onCancel={handleCancelModal}
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
            label="Last Working Date"
            name="lastWorkingDate"
            className={styles.datePickerForm}
            rules={[
              {
                required: true,
                message: 'Please choose date !',
              },
            ]}
          >
            <DatePicker
              className={styles.datePicker}
              format={dateFormat}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }}
            />
          </Form.Item>
          <Form.Item className={styles.flexContent}>
            <Button
              className={`${styles.btnGroup} ${styles.btnCancel}`}
              onClick={handleCancelModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className={`${styles.btnGroup} ${styles.btnSubmit}`}
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalTerminate;
