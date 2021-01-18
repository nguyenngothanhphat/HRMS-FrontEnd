import React, { PureComponent } from 'react';
import { Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ApproveIcon from '@/assets/approveTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import styles from './index.less';

class MultipleCheckTablePopup extends PureComponent {
  render() {
    const {
      onApprove = () => {},
      onReject = () => {},
      loading3,
      loading4,
      // length = 0,
    } = this.props;
    const loadingGraphic = <LoadingOutlined style={{ fontSize: 18, color: '#fff' }} spin />;
    return (
      <div className={styles.MultipleCheckTablePopup}>
        <div className={styles.container}>
          <Tooltip title="Approve">
            <div className={styles.button1} onClick={onApprove}>
              <div className={styles.icon}>
                {!loading3 ? (
                  <img src={ApproveIcon} alt="approve" />
                ) : (
                  <Spin indicator={loadingGraphic} />
                )}
              </div>
              {/* <span className={styles.approve}>Approve</span> */}
            </div>
          </Tooltip>
          <Tooltip title="Reject">
            <div className={styles.button2} onClick={onReject}>
              <div className={styles.icon}>
                {!loading4 ? (
                  <img src={CancelIcon} alt="cancel" />
                ) : (
                  <Spin indicator={loadingGraphic} />
                )}
              </div>
              {/* <span className={styles.reject}>Reject</span> */}
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default MultipleCheckTablePopup;
