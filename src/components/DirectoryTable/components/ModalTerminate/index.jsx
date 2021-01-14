import React, { useState } from 'react'
import { Modal, Input, Form, Button } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

const ModalTerminate = (props) => {
    const [form] = Form.useForm();
    const [isValid, setIsValid] = useState(false)

    const {
        visible = false,
        valueReason = '',
        onChange = () => {},
        handleSubmit = () => {},
        handleCandelModal = () => {},
    } = props;

    return (
      <Modal
        visible={visible}
        className={styles.terminateModal}
        title={false}
        onOk={handleSubmit}
        onCancel={handleCandelModal}
        destroyOnClose
        footer={false}
      >
        <div className={styles.contentModal}>
          <div className={styles.titleModal}>Terminate employee</div>
          <Form 
            form={form}
            onFinish={handleSubmit}
            onFieldsChange={() =>
                setIsValid(
                    form.getFieldsError().some((field) => field.errors.length > 0)
                )}
          >
            <Form.Item 
              label='Reason' 
              name='reason' 
              className={styles.formModal}
              rules={[
                    {
                        pattern: /^[\W\S_]{0,1000}$/,
                        message: 'Only fill up to 1000 characters',
                    },
                    {
                        required: true,
                        message: 'Please input field !',
                    },
                ]}
            >
              <TextArea 
                className={styles.fieldModal}
                value={valueReason}
                onChange={onChange}
                placeholder='Fill in the box...'
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item className={styles.flexContent}>
              <Button
                className={`${styles.btnGroup} ${styles.btnCancel}`}
                onClick={handleCandelModal}
              >
                Cancel
              </Button>
              <Button
                className={`${styles.btnGroup} ${styles.btnSubmit}`}
                htmlType='submit'
                disabled={isValid}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    )
}

export default ModalTerminate
