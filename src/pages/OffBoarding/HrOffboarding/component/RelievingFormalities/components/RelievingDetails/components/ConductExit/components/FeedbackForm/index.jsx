/* eslint-disable react/jsx-indent */
/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ employeesManagement, loading, offboarding: { currentTemplate = {} } }) => ({
  employeesManagement,
  currentTemplate,
  loading: loading.effects['employeesManagement/removeEmployee'],
}))
class FeedbackForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancelEdit } = this.props;
    this.setState({}, () => handleCancelEdit());
  };

  renderHeaderModal = () => {
    const title = 'Feedback Form';
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  render() {
    const { visible = false, loading, content, disabled = false } = this.props;
    return (
      <Modal
        className={styles.feedbackForm}
        visible={visible}
        style={{ top: '50px' }}
        title={this.renderHeaderModal()}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            Cancel
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            loading={loading}
            className={styles.btnSubmit}
            form="feedbackForm"
            disabled={disabled}
          >
            Submit
          </Button>,
        ]}
      >
        {content}
      </Modal>
    );
  }
}

export default FeedbackForm;
