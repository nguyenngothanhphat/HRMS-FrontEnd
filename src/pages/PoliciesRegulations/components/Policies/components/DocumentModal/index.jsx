import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';

import styles from './index.less';

class DocumentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  render() {
    const { visible } = this.props;
    const renderModalContent = () => {
      return (
        <iframe
          src="http://www.africau.edu/images/default/sample.pdf"
          style={{ width: '100%', height: '100vh' }}
          frameBorder="0"
        />
      );
    };
    return (
      <>
        <Modal
          className={`${styles.DocumentModal} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={800}
          footer={null}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default DocumentModal;
