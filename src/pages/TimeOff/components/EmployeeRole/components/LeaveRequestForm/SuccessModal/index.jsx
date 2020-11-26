import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import Icon from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

export default class SuccessModal extends PureComponent {
  render() {
    const { visible, onClose = () => {} } = this.props;
    return (
      <Modal
        className={styles.SuccessModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <img src={Icon} alt="success-icon" />
          <p>Leave request submitted to the HR and your manager.</p>
          <Button onClick={() => onClose(false)}>OK</Button>
        </div>
      </Modal>
    );
  }
}
