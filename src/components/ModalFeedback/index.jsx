import React, { Component } from 'react';
import { connect } from 'umi';
import { Modal, Input, Form, Button, Radio, Divider } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import ScreenCapture from './ScreenCapture';

import styles from './index.less';

const { TextArea } = Input;

@connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
  loadingSubmit: loading.effects['feedback/submitFeedback'],
}))
class ModalFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      on: false,
      valueRadio: null,
      feedback: null,
      screenCapture: null,
      submit: false,
      dataScreenshot: [],
    };
  }

  onChangeRadio = (e) => {
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
    const { dispatch } = this.props;
    const { valueRadio, dataScreenshot } = this.state;
    const { feedback: feedbackContent } = data;
    let url = '';
    let name = '';

    dataScreenshot.forEach((item) => {
      url = item.url;
      name = item.name;
    });

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
          url,
          name,
        },
      ],
    };

    dispatch({
      type: 'feedback/submitFeedback',
      payload,
    }).then((statusCode = 0) => {
      if (statusCode === 200) {
        this.setState({
          submit: true,
        });
      }

      setTimeout(() => {
        this.destroyOnClose();
        this.setState({
          submit: false,
        });
      }, 2500);
    });
  };

  handleChangeForm = (objValue) => {
    if ('feedback' in objValue) {
      this.setState({
        feedback: objValue.feedback,
      });
    }
  };

  dataURItoBlob = (dataURI) => {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i));
    }
    // eslint-disable-next-line compat/compat
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleScreenCapture = (img) => {
    const { openFeedback = () => {}, dispatch } = this.props;

    const formData = new FormData();
    const file = this.dataURItoBlob(img);
    formData.append('blob', file, 'screenshot.jpeg');

    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then(({ data }) => {
      openFeedback();
      this.setState({
        screenCapture: img,
        on: false,
        dataScreenshot: data,
      });
    });
    // document.body.style.overflow = 'scroll';
  };

  handleBack = () => {
    this.setState({
      screenCapture: null,
    });
  };

  render() {
    const { visible = false, handleCandelModal = () => {}, loadingSubmit, loading } = this.props;
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
                  onValuesChange={this.handleChangeForm}
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
                          <Radio.Group onChange={this.onChangeRadio} value={valueRadio}>
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
                        loading={loadingSubmit || loading}
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
