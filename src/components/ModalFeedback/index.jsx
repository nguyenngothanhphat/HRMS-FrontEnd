import React, { Component } from 'react';
import { connect } from 'umi';
import { Modal, Input, Form, Button, Radio, Divider } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import ScreenCapture from './ScreenCapture';

import styles from './index.less';

const { TextArea } = Input;

@connect()
class ModalFeedback extends Component {
  // const [form] = Form.useForm();

  constructor(props) {
    super(props);
    this.state = {
      on: false,
      valueRadio: null,
      feedback: null,
      screenCapture: null,
      submit: false,
    };
  }

  onChange = (e) => {
    this.setState({
      valueRadio: e.target.value,
    });
  };

  destroyOnClose = () => {
    const { handleCandelModal = () => {} } = this.props;
    this.setState({
      on: false,
      feedback: null,
      screenCapture: null,
      valueRadio: null,
    });
    handleCandelModal();
  };

  handleFinish = (data) => {
    const { feedback: feedbackContent } = data;
    const { screenCapture, valueRadio } = this.state;

    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();
    const type = valueRadio === 1 ? 'REPORT' : 'SUGGEST';

    const payload = {
      company: companyId,
      tenantId,
      content: feedbackContent,
      type,
      images: [
        {
          url: screenCapture,
          name: 'abc',
        },
      ],
    };

    console.log(screenCapture);
    console.log(payload);
    // setLoadingSubmit(true);
    // setTimeout(() => {
    //   setSubmit(true);
    //   setLoadingSubmit(false);
    // }, 1000);

    // setTimeout(() => {
    //   destroyOnClose();
    //   setSubmit(false);
    // }, 2500);
  };

  handleChange = (objValue) => {
    if ('feedback' in objValue) {
      this.setState({
        feedback: objValue.feedback,
      });
    }
  };

  handleUploadToServer = () => {
    const { dispatch, getResponse = () => {} } = this.props;
    const { croppedImage } = this.state;
    const formData = new FormData();
    formData.append('uri', croppedImage);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
      isUploadAvatar: true,
    }).then((resp) => {
      getResponse(resp);
    });
  };

  handleScreenCapture = (img) => {
    const { openFeedback = () => {} } = this.props;
    openFeedback();
    this.setState({
      screenCapture: img,
      on: false,
    });
    document.body.style.overflow = 'scroll';
  };

  handleBack = () => {
    this.setState({
      screenCapture: null,
    });
  };

  render() {
    const { visible = false, handleCandelModal = () => {} } = this.props;
    const { screenCapture, on, submit, valueRadio, feedback } = this.state;

    return (
      <div>
        <Modal
          visible={visible}
          className={`${styles.feedbackModal} ${
            screenCapture ? styles.mainModal2 : styles.mainModal
          }`}
          title={false}
          onCancel={this.destroyOnClose}
          destroyOnClose={this.destroyOnClose}
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
                  // form={form}
                  onFinish={this.handleFinish}
                  onValuesChange={this.handleChange}
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
                          <Radio.Group onChange={this.onChange} value={valueRadio}>
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
                            also pinpoint areas of the current page that relate to your feedback
                            with the &quot;Highlight Page&quot; tool.
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
                            onClick={this.handleBack}
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
                              this.setState({
                                on: true,
                              });
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
                        // loading={loadingSubmit}
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
        {on ? <ScreenCapture onEndCapture={this.handleScreenCapture} /> : null}
      </div>
    );
  }
}

export default ModalFeedback;
