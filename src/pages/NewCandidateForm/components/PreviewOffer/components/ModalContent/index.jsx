import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import img2 from './images/modal_img_2.png';

class ModalContent extends PureComponent {
  getHeader = (type) => {
    if (type === 'send-for-approval') {
      return 'Final offer has been sent to HR Manager for approval';
    }
    if (type === 'needs-changes') {
      return 'The needs changes request is submitted successfully';
    }
    if (type === 'needs-changes-for-approval') {
      return 'The needs changes are updated';
    }
    if (type === 'release') {
      return 'Final offer has been sent to candidate';
    }
    // if (type === 'candidate') {
    //   return 'Final offer has been sent HR';
    // }
    // if (type === 'reject') {
    //   return 'Final offer has been rejected';
    // }
    // if (type === 'reject') {
    //   return 'Final offer has been rejected';
    // }
    if (type === 'withdraw') {
      return 'Final offer has been withdrawn';
    }
    if (type === 'extend') {
      return 'Final offer date has been extended';
    }
    return '';
  };

  getContent = (type, mail) => {
    if (type === 'send-for-approval') {
      return 'Final offer has been sent to HR Manager';
    }
    if (type === 'needs-changes') {
      return 'The needs changes request has been sent to HR';
    }
    if (type === 'needs-changes-for-approval') {
      return 'Final offer has been sent to HR Manager for approval';
    }
    if (type === 'release') {
      return `Final offer has been sent to ${mail}`;
    }
    // if (type === 'candidate') {
    //   return 'Final offer has been sent HR';
    // }
    // if (type === 'reject') {
    //   return 'Final offer has been rejected by HR Manager';
    // }
    if (type === 'withdraw') {
      return 'Final offer has been withdrawn by HR Manager';
    }
    if (type === 'extend') {
      return 'Final offer date has been extended by HR Manager';
    }
    return '';
  };

  render() {
    const { closeModal, candidateEmail, type = '' } = this.props;

    return (
      <div className={styles.modalContent}>
        <div className={styles.imgContainer}>
          <img src={img2} alt="send mail" />
        </div>
        <div className={styles.contentContainer}>
          <h2 className={styles.header}>{this.getHeader(type)}</h2>
          <p className={styles.content}>{this.getContent(type, candidateEmail)}</p>
          <div className={styles.btnContainer}>
            <Button className={styles.btn} onClick={closeModal}>
              OK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalContent;
