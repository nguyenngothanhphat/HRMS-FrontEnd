/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ documentsManagement }) => ({
  documentsManagement,
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
    const { titleModal = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  handleRemoveToServer = () => {
    const { dispatch, id = '' } = this.props;
    dispatch({
      type: 'documentsManagement/deleteDocument',
      id,
    }).then(() => {
      this.handleCancel();
      dispatch({
        type: 'documentsManagement/fetchListDocuments',
      });
    });
  };

  render() {
    const { visible = false, loading = false, name = '' } = this.props;
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
          Are you sure to remove &quot;{name}&quot; document?
        </Modal>
      </div>
    );
  }
}

export default ConfirmRemoveModal;
