/* eslint-disable compat/compat */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ usersManagement }) => ({
  usersManagement,
}))
class ResetPasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
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
    const { workEmail = '', dispatch, handleCancel = () => {} } = this.props;
    dispatch({
      type: 'usersManagement/resetPasswordByEmail',
      email: workEmail,
    }).then(() => {
      this.setState({
        loading: true,
      });
      setTimeout(() => {
        handleCancel();
      }, 1300);
      this.setState({
        loading: false,
      });
    });
  };

  render() {
    const { visible = false } = this.props;
    const { loading } = this.state;
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
              Reset
            </Button>,
          ]}
        >
          <div className={styles.resetPasswordContent}>
            <p>Are you sure to reset password of this user?</p>
            {/* <Space direction="horizontal">
              <Input disabled defaultValue={workEmail} />
              <Input.Password
                placeholder="input password"
                defaultValue="12345678@Tc"
                iconRender={(eyeVisible) =>
                  eyeVisible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Space> */}
          </div>
        </Modal>
      </div>
    );
  }
}

export default ResetPasswordModal;
