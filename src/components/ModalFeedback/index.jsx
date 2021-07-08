import React, { useState } from 'react';
import { Modal, Input, Form, Button, Radio, Divider } from 'antd';
import ScreenCapture from './ScreenCapture';

import styles from './index.less';

const { TextArea } = Input;

const ModalFeedback = (props) => {
  const [form] = Form.useForm();
  const [on, setOn] = useState(false);
  const [valueRadio, setValueRadio] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [screenCapture, setScreenCapture] = useState(null);
  const { visible = false, handleCandelModal = () => {}, openFeedback = () => {} } = props;

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  const handleFinish = (values) => {
    console.log(values);
  };

  const handleChange = (objValue) => {
    if ('feedback' in objValue) {
      setFeedback(objValue.feedback);
    }
  };

  const handleScreenCapture = (img) => {
    openFeedback();
    setScreenCapture(img);
    setOn(false);
    document.body.style.overflow = 'scroll';
  };

  const handleBack = () => {
    setScreenCapture(null);
  };

  const destroyOnClose = () => {
    setOn(false);
    setFeedback(null);
    setScreenCapture(null);
    setValueRadio(null);
    handleCandelModal();
  };

  return (
    <div>
      <Modal
        visible={visible}
        className={`${styles.feedbackModal} ${
          screenCapture ? styles.mainModal2 : styles.mainModal
        }`}
        title={false}
        onCancel={destroyOnClose}
        destroyOnClose={destroyOnClose}
        footer={false}
      >
        <div className={styles.contentFeedback}>
          <div className={styles.titleModal}>Feedback</div>
          <div className={styles.formModal}>
            <div className={`${styles.subTitle} ${styles.title1}`}>
              You can choose either to submit your wish as is, or, you can now also pinpoint areas
              of the current page that relate to your entry with the &quot;Highlight Page&quot;
              tool.
            </div>
            <div className={styles.form}>
              <Form
                form={form}
                onFinish={handleFinish}
                onValuesChange={handleChange}
                preserve={false}
              >
                <div className={styles.formTop} style={screenCapture ? { display: 'flex' } : {}}>
                  {!screenCapture && (
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
                      initialValue={feedback}
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
                      {screenCapture ? (
                        <Button
                          onClick={handleBack}
                          className={`${styles.btnGroup} ${styles.highlightBtn} ${styles.backBtn}`}
                        >
                          Back
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setOn(true);
                            handleCandelModal();
                          }}
                          className={`${styles.btnGroup} ${styles.highlightBtn}`}
                        >
                          Highlight Page
                        </Button>
                      )}
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
      {on ? <ScreenCapture onEndCapture={handleScreenCapture} /> : null}
    </div>
  );
};

export default ModalFeedback;
