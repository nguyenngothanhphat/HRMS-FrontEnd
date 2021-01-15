import React, { PureComponent } from 'react';
import ApproveIcon from '@/assets/approveTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import styles from './index.less';

class MultipleCheckTablePopup extends PureComponent {
  render() {
    const { onApprove = () => {}, onReject = () => {} } = this.props;
    return (
      <div className={styles.MultipleCheckTablePopup}>
        <div className={styles.container}>
          <div className={styles.button1} onClick={onApprove}>
            <div className={styles.icon}>
              <img src={ApproveIcon} alt="approve" />
            </div>
            <span className={styles.approve}>Approve tickets</span>
          </div>
          <div className={styles.button2} onClick={onReject}>
            <div className={styles.icon}>
              <img src={CancelIcon} alt="cancel" />
            </div>
            <span className={styles.reject}>Reject tickets</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MultipleCheckTablePopup;
