import React, { PureComponent } from 'react';
import DownloadTemplate from '@/components/DownloadEmployeeTemplate';
import UploadListEmployee from '@/components/UploadListEmployee';
import s from './index.less';

class ImportEmployees extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.viewDownload}>
          <DownloadTemplate />
        </div>

        <UploadListEmployee />
      </div>
    );
  }
}

export default ImportEmployees;
