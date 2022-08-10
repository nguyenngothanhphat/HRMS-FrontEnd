import { Affix } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import LayoutAdminSetting from '@/components/LayoutAdminLeftMenu';
import Department from './components/Department';
import Grade from './components/Grade';
import Position from './components/Position';
import RolePermission from './components/RolePermission';
import styles from './index.less';
import Domain from './components/Domain';
import TicketManagement from './components/TicketManagement';

@connect(() => ({}))
class Settings extends PureComponent {
  render() {
    const listMenu = [
      {
        id: 1,
        name: formatMessage({ id: 'pages_admin.setting.RolesPermission' }),
        component: <RolePermission />,
        link: 'roles-permissions',
      },
      {
        id: 2,
        name: formatMessage({ id: 'pages_admin.setting.Department' }),
        component: <Department />,
        link: 'departments',
      },
      {
        id: 3,
        name: formatMessage({ id: 'pages_admin.setting.Positions' }),
        component: <Position />,
        link: 'positions',
      },
      {
        id: 4,
        name: 'Grades',
        component: <Grade />,
        link: 'grades',
      },
      {
        id: 5,
        name: 'Domain',
        component: <Domain />,
        link: 'domain',
      },
      {
        id: 6,
        name: 'Ticket Management',
        component: <TicketManagement />,
        link: 'ticket-management',
      },
    ];

    const { match: { params: { tabName = '', roleId = '' } = {} } = {} } = this.props;
    return (
      <PageContainer>
        <div className={styles.Settings}>
          <Affix offsetTop={42}>
            <div className={styles.headerText}>
              <span>Settings</span>
            </div>
          </Affix>
          <LayoutAdminSetting listMenu={listMenu} tabName={tabName} roleId={roleId} />
        </div>
      </PageContainer>
    );
  }
}

export default Settings;
