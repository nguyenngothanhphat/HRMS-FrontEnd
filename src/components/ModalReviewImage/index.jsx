import React, { Component } from 'react';
import { Modal, Image } from 'antd';
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
        footer={null}
      >
        <Image style={{ cursor: 'pointer' }} width="100%" height="auto" src={link} />
      </Modal>
    );
  }
}
