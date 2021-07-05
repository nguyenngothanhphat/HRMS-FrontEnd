import React, { useState } from 'react';
import { Modal, Input, Form, Button, Radio, Divider } from 'antd';

import styles from './index.less';

const { TextArea } = Input;

const ModalFeedback = (props) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(1);
  const { visible = false, handleCandelModal = () => {} } = props;

  const onChange = (e) => {
    // console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const handleFinish = (values) => {
    // console.log(values);
  };

  return (
    <Modal
      visible={visible}
      className={styles.feedbackModal}
      title={false}
      onCancel={handleCandelModal}
      destroyOnClose
      footer={false}
    >
      <div className={styles.contentFeedback}>
        <div className={styles.titleModal}>Feedback</div>
        <div className={styles.formModal}>
          <div className={`${styles.subTitle} ${styles.title1}`}>
            You can choose either to submit your wish as is, or, you can now also pinpoint areas of
            the current page that relate to your entry with the &quot;Highlight Page&quot; tool.
          </div>
          <div className={styles.form}>
            <Form form={form} onFinish={handleFinish} preserve={false}>
              <div className={styles.formTop}>
                <Form.Item name="option">
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1} className={styles.radioText}>
                      Report an issue
                    </Radio>
                    <Radio value={2} className={styles.radioText}>
                      Suggest an Enhancement
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                <div className={`${styles.subTitle} ${styles.title2}`}>
                  Please describe what you would like to change or what you liked?
                </div>

                <Form.Item
                  name="feedback"
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
                    placeholder="Type here..."
                    autoSize={{ minRows: 6, maxRows: 12 }}
                  />
                </Form.Item>
              </div>
              <Divider />

              <div className={styles.formBottom}>
                <Form.Item className={styles.flexButton1}>
                  <Button className={`${styles.btnGroup} ${styles.highlightBtn}`}>
                    Highlight Page
                  </Button>
                </Form.Item>
                <Form.Item className={styles.flexButton2}>
                  <Button
                    className={`${styles.btnGroup} ${styles.btnSubmit}`}
                    htmlType="submit"
                    //   loading={loading}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalFeedback;
