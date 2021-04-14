import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

export default class EmailExistModal extends PureComponent {
  render() {
    const { visible, onContinue = () => {}, onLogin = () => {} } = this.props;
    return (
      <Modal
        className={styles.EmailExistModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <p className={styles.alert}>Your email address is registered already</p>
          <p>If you want too add another company, please login and add new company information.</p>
          <p>If not, please input a new email address.</p>
          <div className={styles.buttons}>
            <Button onClick={() => onContinue()} className={styles.continueBtn}>Continue to signup</Button>
            <Button onClick={() => onLogin()}>Login</Button>
          </div>
        </div>
      </Modal>
    );
  }
}
