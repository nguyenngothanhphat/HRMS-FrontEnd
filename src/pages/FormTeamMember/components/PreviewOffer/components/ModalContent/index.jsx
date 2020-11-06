import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import img2 from './images/modal_img_2.png';

class ModalContent extends PureComponent {
  getHeader = (type) => {
    if (type === 'hr') {
      return 'Final offer has been sent to HR Manager for approval';
    }
    if (type === 'hrManager') {
      return 'Final offer has been sent to candidate';
    }
    if (type === 'candidate') {
      return 'Final offer has been sent HR';
    }
    return '';
  };

  getContent = (type, mail) => {
    if (type === 'hr') {
      return 'Final offer has been sent to HR Manager';
    }
    if (type === 'hrManager') {
      return `Final offer has been sent to ${mail}`;
    }
    if (type === 'candidate') {
      return 'Final offer has been sent HR';
    }
    return '';
  };

  render() {
    const { closeModal, candidateEmail, type = 'hr' } = this.props;

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
