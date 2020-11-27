/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Skeleton } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ employeesManagement, loading }) => ({
  employeesManagement,
  loading: loading.effects['employeesManagement/removeEmployee'],
}))
class ModalConfirmRemove extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
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
    const { visible = false, loading, employee, loadingEmployeeProfile } = this.props;
    const { generalInfo: { firstName = '', lastName = '', employeeId = '' } = {} } = employee;
    return (
      <Modal
        className={styles.modalUpload}
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
            onClick={this.handleRemoveToServer}
          >
            Confirm
          </Button>,
        ]}
      >
        {loadingEmployeeProfile ? (
          <Skeleton paragraph={{ rows: 1 }} active />
        ) : (
          <>
            {' '}
            Are you sure to remove &quot;{employeeId} - {firstName} {lastName}&quot;?
          </>
        )}
      </Modal>
    );
  }
}

export default ModalConfirmRemove;
