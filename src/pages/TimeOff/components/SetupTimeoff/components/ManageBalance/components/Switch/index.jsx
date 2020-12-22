import React, { PureComponent } from 'react';
import icon from '@/assets/excel.svg';
// import Upload from '@/components/UploadImage';
import ImportCSV from '../ImportExcel';
import ExportCSV from '../ExportExel';

import styles from './index.less';

class Switch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: 'DownloadExcel',
      customers: [
        {
          name: 'minh',
          age: '13',
        },
        {
          name: 'duc',
          age: '17',
          contact: '123',
        },
      ],
    };
  }

  render() {
    const { customers, fileName } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.title}>Switch</div>
        <div className={styles.subText}>
          Keep current employee timeoff balances, but move them to new policies
        </div>
        <img src={icon} alt="" />
        <ExportCSV csvData={customers} fileName={fileName} />
        <div className={styles.straightLine} />
        <div className={styles.import}>
          <ImportCSV />
        </div>
      </div>
    );
  }
}
export default Switch;
