import React, { PureComponent } from 'react';
import icon from '@/assets/excel.svg';
// import Upload from '@/components/UploadImage';
import ImportCSV from '../ImportExcel';
// import ExportCSV from '../ExportExel';

import styles from './index.less';

class Switch extends PureComponent {
  downloadFile = () => {
    window.location.href =
      'http://api-stghrms.paxanimi.ai/api/attachments/5fc9aaccd0fba236930fddf6/BALANCE%20TEMPLATE.xlsx';
  };

  render() {
    const { tab, name, content } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.title}>{name}</div>
        <div className={styles.subText}>{content}</div>
        <div>
          <img src={icon} alt="" />
          {/* <ExportCSV csvData={customers} fileName={fileName} /> */}
          <div onClick={this.downloadFile} className={styles.navLink}>
            Download spreadsheet
          </div>
        </div>
        <div className={styles.straightLine} />
        <div className={styles.import}>
          <ImportCSV tab={tab} />
        </div>
      </div>
    );
  }
}
export default Switch;
