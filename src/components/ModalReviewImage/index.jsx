import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import s from './index.less';

export default class ModalReviewImage extends Component {
  render() {
    const { visible, handleCancel = () => {}, link = '' } = this.props;
    return (
      <Modal
        title="Review Image"
        visible={visible}
        onOk={this.handleOk}
        onCancel={handleCancel}
        className={s.root}
        destroyOnClose
        footer={[
          <div className={s.btnCancel} onClick={handleCancel}>
            Cancel
          </div>,
          <Button className={s.btnDownload} type="primary">
            Download
          </Button>,
        ]}
      >
        <p>{link}</p>
      </Modal>
    );
  }
}
