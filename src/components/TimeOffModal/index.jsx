import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import Icon from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

export default class TimeOffModal extends PureComponent {
  render() {
    const { visible, content = '', submitText = '', onOk = () => {} } = this.props;
    return (
      <Modal
        className={styles.TimeOffModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <img src={Icon} alt="success-icon" />
          <p>{content}</p>
          <Button onClick={() => onOk()}>{submitText}</Button>
        </div>
      </Modal>
    );
  }
}
