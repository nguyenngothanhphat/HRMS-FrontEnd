/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button, Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './index.less';

class ResetPasswordModal extends Component {
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
    // eslint-disable-next-line no-console
    console.log('handleRemoveToServer');
  };

  render() {
    const { visible = false, loading = false, user = {} } = this.props;
    const {
      generalInfo: { firstName = '', lastName = '', employeeId = '', workEmail = '' } = {},
    } = user;
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
          <div className={styles.resetPasswordContent}>
            <p>
              Are you sure to reset the password of &quot;{employeeId} - {firstName} {lastName}
              &quot;?
            </p>
            <Space direction="horizontal">
              <Input disabled defaultValue={workEmail} />
              <Input.Password
                placeholder="input password"
                defaultValue="12345678@Tc"
                iconRender={(eyeVisible) =>
                  eyeVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Space>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ResetPasswordModal;
