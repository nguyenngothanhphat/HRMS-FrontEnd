import React, { Component } from 'react';
import { connect } from 'umi';
import { Form, Input } from 'antd';
import styles from './index.less';

@connect(() => {})
class FeedbackFormContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  handleChange = () => {};

  renderContent = () => {
    const { TextArea } = Input;
    return (
      <Form name="feedbackForm" layout="vertical">
        <Form.Item
          label="1. Please describe your general feelings about working here. If possible, please tell us why you are leaving.
"
        >
          <TextArea placeholder="Input your answer" />
        </Form.Item>
        <Form.Item
          label="2. What did you enjoy most about working here?
"
        >
          <TextArea placeholder="Input your answer" />
        </Form.Item>
      </Form>
    );
  };

  render() {
    return (
      <div className={styles.ModalContent}>
        {this.renderContent()}
        {/* {loadingTemplate ? <Skeleton className={styles.spin} /> : this.renderContent()} */}
      </div>
    );
  }
}

export default FeedbackFormContent;
