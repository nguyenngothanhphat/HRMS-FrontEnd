/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Input } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

@connect(({ offboarding: { relievingDetails: { _id: ticketId = '' } } }) => ({
  ticketId,
}))
class FeedbackFormContent extends PureComponent {
  submitFormFeedBack = (values) => {
    const {
      dispatch,
      itemFeedBack: { settings = [], templateRelieving: templateId = '' } = {},
      ticketId,
      handleCancelEdit = () => {},
    } = this.props;
    const cloneSetting = [...settings];
    const createArrayValues = Object.values(values);
    const newSettings = cloneSetting.map((item, index) => {
      return { ...item, answer: [createArrayValues[index]] };
    });
    const payload = {
      ticketId,
      settings: newSettings,
      packageType: 'EXIT-INTERVIEW-FEEDBACKS',
      templateId,
    };
    dispatch({
      type: 'offboarding/saveOffBoardingPackage',
      payload,
    });
    handleCancelEdit();
  };

  render() {
    const {
      itemFeedBack: { settings = [] },
      disabled = false,
    } = this.props;
    const initialValues = {};
    settings.map((item, index) => {
      const { answer = [] } = item;
      const [value] = answer;
      initialValues[index] = value;
      return null;
    });
    return (
      <div className={styles.ModalContent}>
        <Form
          id="feedbackForm"
          layout="vertical"
          onFinish={this.submitFormFeedBack}
          initialValues={initialValues}
        >
          {settings.map((item, index) => (
            <Form.Item
              label={`${index + 1}. ${item?.question}`}
              key={index}
              name={index}
              rules={[
                {
                  required: true,
                  message: 'Input cannot be empty!',
                },
              ]}
            >
              <TextArea placeholder="Input your answer" disabled={disabled} />
            </Form.Item>
          ))}
        </Form>
      </div>
    );
  }
}

export default FeedbackFormContent;
