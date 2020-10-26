/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ usersManagement }) => ({
  usersManagement,
}))
class ConfirmRemoveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
    const { dispatch, user = {} } = this.props;
    const { _id = '' } = user;
    dispatch({
      type: 'usersManagement/removeEmployee',
      id: _id,
    }).then((statusCode) => {
      if (statusCode === 200) {
        this.handleCancel();
      }
    });
  };

  render() {
    const { visible = false, loading = false, user = {} } = this.props;
    const { generalInfo: { firstName = '', lastName = '', employeeId = '' } = {} } = user;
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
          Are you sure to remove &quot;{employeeId} - {firstName} {lastName}&quot;?
        </Modal>
      </div>
    );
  }
}

export default ConfirmRemoveModal;
