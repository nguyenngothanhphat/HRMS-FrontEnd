import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

export default class WithdrawModal extends PureComponent {
  render() {
    const { visible, onClose = () => {} } = this.props;
    return (
      <Modal
        className={styles.WithdrawModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <span className={styles.title}>Withdraw timeoff request?</span>
          <p className={styles.subtitle1}>
            Withdrawing request will delete this ticket id and no longer will be kept track of.
          </p>
          <p className={styles.subtitle2}>
            Both your Manager and HR will be notified of this change.
          </p>
          <div className={styles.operationButtons}>
            <Button className={styles.proceedBtn} onClick={() => onClose(false)}>
              Proceed
            </Button>
            <Button className={styles.cancelBtn} onClick={() => onClose(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
