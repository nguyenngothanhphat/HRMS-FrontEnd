/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import noticeIcon from '@/assets/notice-icon.svg';
import styles from './index.less';

class ModalNoticeSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  handleRemoveToServer = () => {
    console.log('handleRemoveToServer');
  };

  render() {
    const { visible = false, loading, modalContent } = this.props;
    return (
      <Modal
        className={styles.modal}
        visible={visible}
        title={false}
        onOk={this.handleRemoveToServer}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={false}
      >
        <div className={styles.modal__content}>
          <img src={noticeIcon} alt="notice-icon" />
          <p>{modalContent}</p>
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={styles.btnSubmit}
            onClick={this.handleRemoveToServer}
          >
            OK
          </Button>
        </div>
      </Modal>
    );
  }
}

export default ModalNoticeSuccess;
