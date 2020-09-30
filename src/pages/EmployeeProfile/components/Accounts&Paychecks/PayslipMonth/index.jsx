import React, { PureComponent } from 'react';
import Icon from '@ant-design/icons';
import DownloadIcon from './icon.js';
import styles from './index.less';

class PaySlipMonth extends PureComponent {
  handleClick = () => {};

  render() {
    const monthNames = [
      { id: 1, name: 'January' },
      { id: 2, name: 'February' },
      { id: 3, name: 'March' },
      { id: 4, name: 'April' },
      { id: 5, name: 'May' },
      { id: 6, name: 'June' },
      { id: 7, name: 'July' },
      { id: 8, name: 'August' },
      //   'September',
      //   'October',
      //   'November',
      //   'December',
    ];
    // const month = new Date();
    return monthNames.reverse().map((item) => {
      return (
        <div key={item.id} className={styles.PaySlipMonth}>
          <p className={styles.nameMonth}>{`Payslip for ${item.name}`}</p>
          <div className={styles.downLoad}>
            <p className={styles.downLoadText}>View</p>
            <Icon
              component={DownloadIcon}
              onClick={this.handleClick}
              className={styles.downLoadIcon}
            />
          </div>
        </div>
      );
    });
  }
}

export default PaySlipMonth;
