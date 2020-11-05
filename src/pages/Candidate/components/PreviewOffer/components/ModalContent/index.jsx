import React, { PureComponent } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import img2 from './images/modal_img_2.png';

class ModalContent extends PureComponent {
  render() {
    const { closeModal } = this.props;
    return (
      <div className={styles.modalContent}>
        <div className={styles.imgContainer}>
          <img src={img2} alt="send mail" />
        </div>
        <div className={styles.contentContainer}>
          <h2 className={styles.header}>Final offer has been sent to HR</h2>
          <p className={styles.content}>Final offer has been sent to HR</p>
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
