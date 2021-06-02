import { formatMessage } from 'umi';
import React, { PureComponent } from 'react';
import HintIcon from '@/assets/hint.svg';
import styles from './index.less';

class StatusDetail extends PureComponent {
  render() {
    const { status } = this.props;
    const type = {
      'IN-PROGRESS': {
        color: '#2C6DF9',
        text: 'In Progress',
      },
      ACCEPTED: {
        color: '#006600',
        text: 'Accepted',
      },
      REJECTED: {
        color: '#ff0000',
        text: 'Rejected',
      },
      'ON-HOLD': {
        color: '#6600cc',
        text: 'On-hold',
      },
      DRAFT: {
        color: '#A9A9A9',
        text: 'Draft',
      },
      WITHDRAW: {
        color: '#ffa100',
        text: 'Withdraw',
      },
    };

    return (
      status && (
        <div className={styles.statusDetail}>
          <div className={styles.statusDetail__content}>
            <div className={styles.statusDetail__content__icon}>
              <img src={HintIcon} alt="" />
            </div>
            <div className={styles.statusDetail__content__title}>
              {formatMessage({ id: 'pages.offBoarding.requestStatus' })}
            </div>
          </div>
          <div className={styles.statusDetail__status}>
            Status: &nbsp;
            <span style={{ color: type[status].color }}>&#8226; {type[status].text}</span>
          </div>
        </div>
      )
    );
  }
}

export default StatusDetail;
