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
  const [submit, setSubmit] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { visible = false, handleCandelModal = () => {}, openFeedback = () => {} } = props;

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  const destroyOnClose = () => {
    setOn(false);
    setFeedback(null);
    setScreenCapture(null);
    setValueRadio(null);
    handleCandelModal();
  };

  const handleFinish = (values) => {
    console.log(values);
    setLoadingSubmit(true);
    setTimeout(() => {
      setSubmit(true);
      setLoadingSubmit(false);
    }, 1000);

    setTimeout(() => {
      destroyOnClose();
      setSubmit(false);
    }, 2500);
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
          <div className={styles.titleModal}>
            Feedback
            {submit && (
              <span className={styles.message}>
                Thank you for your feedback ! Your feedback has been recorded and will be shared
                with the appropriate team.
              </span>
            )}
          </div>
          <div className={styles.formModal}>
            <div className={`${styles.subTitle} ${styles.title1}`}>
              {screenCapture
                ? `Please describe what you would like to change or what you liked?`
                : `Thank you for helping us improve ! Please select an option below.`}
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
                        initialValue={valueRadio}
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

                      {valueRadio && (
                        <div className={`${styles.subTitle} ${styles.title2}`}>
                          Please describe what you would like to change or what you liked? You can
                          also pinpoint areas of the current page that relate to your feedback with
                          the &quot;Highlight Page&quot; tool.
                        </div>
                      )}
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
                          className={`${submit ? styles.disableBtn : styles.btnGroup} ${
                            styles.highlightBtn
                          } ${styles.backBtn}`}
                          disabled={submit}
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
                      className={`${submit ? styles.disableBtn : styles.btnGroup} ${
                        styles.btnSubmit
                      }`}
                      htmlType="submit"
                      loading={loadingSubmit}
                      disabled={submit}
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
