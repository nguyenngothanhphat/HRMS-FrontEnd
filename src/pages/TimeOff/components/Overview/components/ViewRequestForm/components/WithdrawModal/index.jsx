import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const { DRAFTS } = TIMEOFF_STATUS;
export default class WithdrawModal extends PureComponent {
  render() {
    const {
      visible,
      onClose = () => {},
      onProceed = () => {},
      status = '',
      loading = false,
    } = this.props;
    let header = 'Withdraw timeoff request?';
    let content1 = 'Are you sure you want to withdraw your leave request?';
    let content2 = 'Both your Manager and HR will be notified of this change.';
    if (status === DRAFTS) {
      header = 'Discard draft request?';
      content1 = 'Discarding draft will delete this ticket id and no longer will be kept track of.';
      content2 = '';
    }
    return (
      <Modal
        className={styles.WithdrawModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <span className={styles.title}>{header}</span>
          <p className={styles.subtitle1}>{content1}</p>
          {content2 && <p className={styles.subtitle2}>{content2}</p>}
          <div className={styles.operationButtons}>
            <Button
              loading={loading}
              className={styles.proceedBtn}
              onClick={() => onProceed(false)}
            >
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
