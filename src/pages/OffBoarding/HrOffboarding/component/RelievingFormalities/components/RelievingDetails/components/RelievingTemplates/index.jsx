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
class RelievingTemplates extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancelEdit } = this.props;
    this.setState({}, () => handleCancelEdit());
  };

  renderHeaderModal = (template) => {
    const { packageName = '' } = template;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>Questions for {packageName}</p>
      </div>
    );
  };

  render() {
    const { visible = false, loading, template, content, mode } = this.props;
    return (
      <Modal
        className={styles.modalRelievingTemplates}
        visible={visible}
        style={{ top: '50px' }}
        title={this.renderHeaderModal(template)}
        // onOk={this.handleRemoveToServer}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={
          mode === 'Edit'
            ? [
                <div key="cancel" className={styles.btnCancel} onClick={this.handleCancel}>
                  Cancel
                </div>,
                <Button
                  key="submit"
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                  className={styles.btnSubmit}
                  form="relievingTemplates"
                >
                  Save
                </Button>,
              ]
            : false
        }
      >
        {content}
      </Modal>
    );
  }
}

export default RelievingTemplates;
