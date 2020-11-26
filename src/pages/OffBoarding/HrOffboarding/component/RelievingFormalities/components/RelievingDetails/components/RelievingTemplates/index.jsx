/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Skeleton, Form, Input } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
@connect(({ employeesManagement, loading, offboarding: { currentTemplate = {} } }) => ({
  employeesManagement,
  currentTemplate,
  loading: loading.effects['employeesManagement/removeEmployee'],
}))
class RelievingTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancelEdit } = this.props;
    this.setState({}, () => handleCancelEdit());
  };

  renderHeaderModal = (template) => {
    const { title = '' } = template;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>Questions for {title}</p>
      </div>
    );
  };

  handleRemoveToServer = () => {
    const { dispatch, employee = {} } = this.props;
    const { _id = '' } = employee;
    dispatch({
      type: 'employeesManagement/removeEmployee',
      id: _id,
    }).then((statusCode) => {
      if (statusCode === 200) {
        this.handleCancel();
      }
    });
  };

  render() {
    const { visible = false, loading, template, content } = this.props;
    return (
      <Modal
        className={styles.modalRelievingTemplates}
        visible={visible}
        style={{ top: '50px' }}
        title={this.renderHeaderModal(template)}
        onOk={this.handleRemoveToServer}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
            Cancel
          </div>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={styles.btnSubmit}
            // onClick={this.handleRemoveToServer}
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

export default RelievingTemplates;
