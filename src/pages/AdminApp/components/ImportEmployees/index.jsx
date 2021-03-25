import React, { PureComponent } from 'react';
import DownloadTemplate from '@/components/DownloadEmployeeTemplate';
import UploadListEmployee from '@/components/UploadListEmployee';
import s from './index.less';

class ImportEmployees extends PureComponent {
  render() {
    const { companyId } = this.props;
    return (
      <div className={s.root}>
        <div className={s.viewDownload}>
          <DownloadTemplate />
        </div>

        <UploadListEmployee companyId={companyId} />
      </div>
    );
  }
}

export default ImportEmployees;
