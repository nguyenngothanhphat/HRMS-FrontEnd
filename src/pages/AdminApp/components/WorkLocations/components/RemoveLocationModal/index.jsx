import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

export default class RemoveLocationModal extends PureComponent {
  render() {
    const { visible, onClose = () => {}, onProceed = () => {}, loading = false } = this.props;
    return (
      <Modal
        className={styles.RemoveLocationModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <span className={styles.title}>Are you sure to delete this location?</span>
          <p className={styles.subtitle1}>This process can not be undone.</p>
          {/* <p className={styles.subtitle2}></p> */}
          <div className={styles.operationButtons}>
            <Button
              loading={loading}
              className={styles.proceedBtn}
              onClick={() => onProceed(false)}
            >
              Remove
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
