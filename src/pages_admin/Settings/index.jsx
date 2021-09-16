import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import { Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import LayoutAdminSetting from '@/components/LayoutAdminLeftMenu';
// import Department from './Components/Department';
// import Position from './Components/Position';
// import Location from './Components/Location';
// import RolesPermission from './Components/RolesPermission';
import styles from './index.less';
import RolePermission from './components/RolePermission';
import Department from './components/Department';

@connect(({ loading }) => ({ loading: loading.effects['adminSetting/fetchListRoles'] }))
class Settings extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'employee/fetchLocation',
    });
    // dispatch({
    //   type: 'adminSetting/fetchListTitle',
    // });
    dispatch({
      type: 'companiesManagement/fetchCompaniesList',
    });
  }

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
        // component: <Position />,
        link: 'positions',
      },
      {
        id: 4,
        name: 'Grades',
        // component: <Location />,
        link: 'grades',
      },
    ];

    const { match: { params: { tabName = '', roleId = '' } = {} } = {} } = this.props;
    return (
      <PageContainer>
        <div className={styles.Settings}>
          <Affix offsetTop={30}>
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
