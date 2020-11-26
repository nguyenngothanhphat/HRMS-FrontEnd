/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Skeleton } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ employeesManagement, loading }) => ({
  employeesManagement,
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

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
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
        this.refreshUsersList();
      }
    });
  };

  refreshUsersList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/fetchActiveEmployeesList',
    });
    dispatch({
      type: 'employeesManagement/fetchInActiveEmployeesList',
    });
  };

  render() {
    const { visible = false, loading } = this.props;
    return (
      <Modal
        className={styles.modalRelievingTemplates}
        visible={visible}
        title={this.renderHeaderModal()}
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
        Relieving Templates
      </Modal>
    );
  }
}

export default RelievingTemplates;
