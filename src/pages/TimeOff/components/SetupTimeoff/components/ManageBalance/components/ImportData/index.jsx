import React, { PureComponent } from 'react';
import icon from '@/assets/excel.svg';
// import Upload from '@/components/UploadImage';
import ImportCSV from '../ImportExcel';
import ExportCSV from '../ExportExel';

import styles from './index.less';

class ImportData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: 'DownloadExcel',
      customers: [
        {
          name: 'ds',
          ange: 'fd',
        },
        {
          name: 'ds',
          ange: 'ffdfdsfdsd',
          minh: 'dsfafsde',
        },
      ],
    };
  }

  render() {
    const { customers, fileName } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.title}>Import Data</div>
        <div className={styles.subText}>Import new timeoff balances for employees.</div>
        <img src={icon} alt="" />
        <div>
          <ExportCSV csvData={customers} fileName={fileName} />
        </div>
        <div className={styles.import}>
          <ImportCSV />
        </div>
      </div>
    );
  }
}
export default ImportData;
