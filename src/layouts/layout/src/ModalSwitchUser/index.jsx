import React, { Component } from 'react';
import { Button, Modal, notification } from 'antd';

class SwitchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose = () => {} } = this.props;
    return (
      <Modal
        destroyOnClose
        centered
        visible={visible}
        footer={null}
        onCancel={() => onClose(false)}
      >
        <div>ABC</div>
      </Modal>
    );
  }
}

export default SwitchUser;
