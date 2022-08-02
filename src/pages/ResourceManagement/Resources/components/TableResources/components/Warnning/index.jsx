import React, { Component } from 'react';
import { Modal, Button } from 'antd'
import WarnningChangeManager from '@/assets/resourceManagement/WarnningChangeManager.svg';
import styles from './index.less';

class ChangeManagerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFooter = () => {
    return (
      <div className={styles.footer}>
        <Button>Submit</Button>
      </div>
    );
  }

  render() {
    const { onClose = () => {}, onClick = () => {} , visible } = this.props;
    return (
      <div>
        <Modal
          visible={visible}
          className={styles.WarnningChangeManager}
          footer={null}
          width="396px"
          onCancel={onClose}
        >
          <div className={styles.warnningImage}>
            <img src={WarnningChangeManager} alt="warnning" />
          </div>
          <p className={styles.warnningcontent}>The employee is assigned to multiple projects.</p>
          <p className={styles.warnningcontent}>Are you sure you want to change the manager ?</p>
          <div className={styles.footerModalWarnning}>
            <Button onClick={onClick} className={styles.btnSubmit}>
              Submit
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ChangeManagerModal;
