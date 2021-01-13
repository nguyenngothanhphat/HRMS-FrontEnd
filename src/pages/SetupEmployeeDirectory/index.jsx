import Breadcrumb from '@/components/Breadcrumb';
import DownloadTemplate from '@/components/DownloadEmployeeTemplate';
import UploadListEmployee from '@/components/UploadListEmployee';
import React from 'react';
import s from './index.less';

class SetupEmployeeDirectory extends React.PureComponent {
  render() {
    const {
      match: { params: { reId: companyId = '' } = {} },
    } = this.props;
    const routes = [
      { name: 'Getting Started', path: '/account-setup/get-started' },
      {
        name: 'Setup Employee Directory',
        path: '/account-setup/get-started/setup-employee-directory',
      },
    ];
    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={s.root}>
          <div className={s.titlePage}>Setup Employee Directory</div>
          <div className={s.content}>
            <DownloadTemplate />
            <UploadListEmployee companyId={companyId} />
          </div>
        </div>
      </>
    );
  }
}

export default SetupEmployeeDirectory;
