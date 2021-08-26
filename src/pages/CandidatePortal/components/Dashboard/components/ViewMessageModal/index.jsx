import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

@connect(() => ({}))
class ViewMessageModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  renderModalHeader = () => {
    const { title = 'Message' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalContent = () => {
    const { icon = '', item = {} } = this.props;
    return (
      <>
        <div className={styles.eachItem}>
          <div className={styles.messageIcon}>
            <img src={icon} alt="message" />
          </div>
          <div className={styles.messageContent}>
            <span className={styles.messageTitle}>{item?.title || ''}</span>
            <span className={styles.message}>{item?.content || ''}</span>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { visible = false } = this.props;

    return (
      <>
        <Modal
          className={styles.ViewMessageModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              onClick={this.handleCancel}
            >
              Okay
            </Button>,
          ]}
          title={this.renderModalHeader()}
          centered
          visible={visible}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default ViewMessageModal;
