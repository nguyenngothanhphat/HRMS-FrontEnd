/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import styles from './index.less';

class ModalUploadDocument extends Component {
  onOk = () => {
    const { handleSubmit = () => {} } = this.props;
    handleSubmit('test values');
  };

  render() {
    const { visible = false, handleCancel = () => {}, loading = false } = this.props;
    return (
      <Modal
        className={styles.root}
        destroyOnClose
        visible={visible}
        title="Upload a new document"
        onOk={this.onOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" className={styles.btnDone} loading={loading} onClick={this.onOk}>
            Done
          </Button>,
        ]}
      >
        Content modal
      </Modal>
    );
  }
}

export default ModalUploadDocument;
