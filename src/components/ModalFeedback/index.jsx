import React, { useState } from 'react';
import { Modal, Input, Form, Button, Radio, Divider } from 'antd';
import ScreenCapture from './ScreenCapture';

import styles from './index.less';

const { TextArea } = Input;

const ModalFeedback = (props) => {
  const [form] = Form.useForm();
  const [valueRadio, setValueRadio] = useState(null);
  const [screenCapture, setScreenCapture] = useState('');
  const { visible = false, handleCandelModal = () => {} } = props;

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  const handleFinish = (values) => {
    console.log(values);
  };

  const handleScreenCapture = (img) => {
    setScreenCapture(img);
  };

  const destroyOnClose = () => {
    handleCandelModal();
    setValueRadio(null);
  };

  return (
    <Modal
      visible={visible}
      className={`${styles.feedbackModal} ${screenCapture ? styles.mainModal2 : styles.mainModal}`}
      title={false}
      onCancel={destroyOnClose}
      destroyOnClose={destroyOnClose}
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
              <div className={styles.formTop} style={screenCapture ? { display: 'flex' } : {}}>
                {screenCapture ? null : (
                  <>
                    <Form.Item
                      name="option"
                      rules={[
                        {
                          required: true,
                          message: 'Please check the radio !',
                        },
                      ]}
                    >
                      <Radio.Group onChange={onChange} value={valueRadio}>
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
                  </>
                )}

                {screenCapture && (
                  <Form.Item>
                    <div className={styles.captureSection}>
                      <img className={styles.screenshot} alt="screenshot" src={screenCapture} />
                    </div>
                  </Form.Item>
                )}

                {valueRadio && (
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
                    className={styles.textBoxForm}
                  >
                    <TextArea
                      className={styles.fieldModal}
                      placeholder="Type here..."
                      autoSize={{ minRows: 6, maxRows: 12 }}
                    />
                  </Form.Item>
                )}
              </div>
              <Divider />

              <div className={styles.formBottom}>
                {valueRadio && (
                  <Form.Item className={styles.flexButton1}>
                    <ScreenCapture onEndCapture={handleScreenCapture}>
                      {({ onStartCapture }) => (
                        <Button
                          onClick={onStartCapture}
                          className={`${styles.btnGroup} ${styles.highlightBtn}`}
                        >
                          Highlight Page
                        </Button>
                      )}
                    </ScreenCapture>
                  </Form.Item>
                )}

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
