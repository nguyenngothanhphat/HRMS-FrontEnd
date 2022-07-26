/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Skeleton } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    usersManagement,
    usersManagement: { selectedUserId = '', selectedUserTenant = '', employeeDetail = {} } = {},
    loading,
  }) => ({
    usersManagement,
    selectedUserTenant,
    selectedUserId,
    employeeDetail,
    loadingEmployeeProfile: loading.effects['usersManagement/fetchEmployeeDetail'],
  }),
)
class ConfirmRemoveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getEmployeeDetail = async () => {
    const { dispatch, selectedUserId = '', selectedUserTenant = '' } = this.props;

    if (selectedUserId && selectedUserTenant) {
      await dispatch({
        type: 'usersManagement/fetchEmployeeDetail',
        payload: {
          id: selectedUserId,
          tenantId: selectedUserTenant,
        },
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    const { selectedUserId = '', visible = false } = this.props;
    if (prevProps.selectedUserId !== selectedUserId && visible) {
      this.getEmployeeDetail();
    }
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  renderHeaderModal = () => {
    const { titleModal = 'Delete Confirm' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  handleRemoveToServer = () => {
    const { dispatch, employeeDetail = {} } = this.props;
    const { _id = '', tenant } = employeeDetail;
    dispatch({
      type: 'usersManagement/removeEmployee',
      payload: {
        id: _id,
        tenantId: tenant,
        status: 'INACTIVE',
      },
    }).then((statusCode) => {
      if (statusCode === 200) {
        this.handleCancel();
      }
    });
  };

  render() {
    const {
      visible = false,
      loading = false,
      employeeDetail = {},
      loadingEmployeeProfile = false,
    } = this.props;
    const { employeeId = '', generalInfo: { firstName = '', lastName = '' } = {} } = employeeDetail;
    return (
      <div>
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
            <Skeleton />
          ) : (
            <>
              <span>
                Are you sure to remove &quot;{employeeId} - {firstName} {lastName}&quot;?
              </span>
            </>
          )}
        </Modal>
      </div>
    );
  }
}

export default ConfirmRemoveModal;
