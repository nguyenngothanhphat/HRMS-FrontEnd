import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import DownloadTemplate from '@/components/DownloadEmployeeTemplate';
import s from './index.less';

class SetupEmployeeDirectory extends React.PureComponent {
  render() {
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
          </div>
        </div>
      </>
    );
  }
}

export default SetupEmployeeDirectory;
