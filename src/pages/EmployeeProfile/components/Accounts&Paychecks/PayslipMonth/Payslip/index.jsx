import React, { PureComponent } from 'react';
import Icon from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import DownloadFile from '@/components/DownloadFile';
import DownloadIcon from './icon.js';
import styles from '../index.less';

@connect(({ employeeProfile: { paySlip = [] } }) => ({
  paySlip,
}))
class Payslips extends PureComponent {
  handleViewFile = (urlFile) => {
    const { getViewFile = () => {} } = this.props;
    getViewFile(urlFile);
  };

  render() {
    const { paySlip } = this.props;
    const renderDownloadIcon = () => (
      <Icon component={DownloadIcon} className={styles.downLoadIcon} />
    );
    return (
      <div>
        {paySlip.length === 0
          ? formatMessage({ id: 'pages.employeeProfile.Payslip' })
          : paySlip.map((item, index) => {
              return (
                <div key={`${item.key} ${index + 1}`} className={styles.PaySlipMonth}>
                  <p className={styles.nameMonth}>{`${item.key}`}</p>
                  <div className={styles.downLoad}>
                    <p
                      className={styles.downLoadText}
                      onClick={() =>
                        this.handleViewFile(item.attachment ? item.attachment.url : '')
                      }
                    >
                      View
                    </p>

                    <div className={styles.downloadFile}>
                      <DownloadFile
                        content={renderDownloadIcon()}
                        url={item.attachment ? item.attachment.url : ''}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    );
  }
}

export default Payslips;
