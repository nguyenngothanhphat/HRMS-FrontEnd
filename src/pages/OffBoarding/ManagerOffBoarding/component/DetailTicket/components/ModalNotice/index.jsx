import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';
import noticeIcon from '@/assets/notice-icon.svg';
import styles from './index.less';

class ModalNotice extends PureComponent {
  render() {
    const { visible = false, type = '', handleCancel = () => {} } = this.props;
    const renderText = {
      'ON-HOLD': 'Your decision to put this request On hold has been recorded.',
      REJECTED: 'Your rejection of the request has been recorded and all parties will be notified',
      ACCEPTED: 'Your acceptance of the request has been recorded and all parties will be notified',
    };
    return (
      <Modal
        className={styles.modal}
        visible={visible}
        title={false}
        onOk={handleCancel}
        onCancel={handleCancel}
        destroyOnClose
        footer={false}
      >
        <div className={styles.modal__content}>
          <img src={noticeIcon} alt="notice-icon" />
          <p>{renderText[type]}</p>
          <Button key="submit" type="primary" className={styles.btnSubmit} onClick={handleCancel}>
            OK
          </Button>
        </div>
      </Modal>
    );
  }
}

export default ModalNotice;
