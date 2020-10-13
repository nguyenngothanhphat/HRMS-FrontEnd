import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage } from 'umi';
import { Affix } from 'antd';
import LayoutAdminSetting from '@/components/LayoutAdminLeftMenu';
import Department from './Components/Department';
import Position from './Components/Position';
import Location from './Components/Location';
import RolesPermission from './Components/RolesPermission';
import styles from './index.less';

class SettingTab extends PureComponent {
  render() {
    const listMenu = [
      {
        id: 1,
        name: formatMessage({ id: 'pages_admin.setting.RolesPermission' }),
        component: <RolesPermission />,
      },
      {
        id: 2,
        name: formatMessage({ id: 'pages_admin.setting.Department' }),
        component: <Department />,
      },
      {
        id: 3,
        name: formatMessage({ id: 'pages_admin.setting.Positions' }),
        component: <Position />,
      },
      {
        id: 4,
        name: formatMessage({ id: 'pages_admin.setting.Location' }),
        component: <Location />,
      },
      { id: 5, name: formatMessage({ id: 'pages_admin.setting.Emailtemplates' }), component: '' },
    ];
    return (
      <PageContainer>
        <div className={styles.containerUsers}>
          <Affix offsetTop={40}>
            <div className={styles.headerText}>
              <span>{formatMessage({ id: 'pages_admin.setting.title' })}</span>
            </div>
          </Affix>
          <LayoutAdminSetting listMenu={listMenu} />
        </div>
      </PageContainer>
    );
  }
}

export default SettingTab;
