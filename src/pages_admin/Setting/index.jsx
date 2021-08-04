import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage, connect } from 'umi';
import { Affix } from 'antd';
import LayoutAdminSetting from '@/components/LayoutAdminLeftMenu';
import Department from './Components/Department';
import Position from './Components/Position';
// import Location from './Components/Location';
import RolesPermission from './Components/RolesPermission';
import styles from './index.less';

@connect(({ loading }) => ({ loading: loading.effects['adminSetting/fetchListRoles'] }))
class SettingTab extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchListRoles',
    });
    dispatch({
      type: 'adminSetting/fetchDepartment',
    });
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
        component: <RolesPermission />,
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
        link: 'position',
      },
      // {
      //   id: 4,
      //   name: formatMessage({ id: 'pages_admin.setting.Location' }),
      //   component: <Location />,
      // },
      // { id: 5, name: formatMessage({ id: 'pages_admin.setting.Emailtemplates' }), component: '' },
    ];

    const { match: { params: { tabName = '', roleId = '' } = {} } = {} } = this.props;
    return (
      <PageContainer>
        <div className={styles.containerUsers}>
          <Affix offsetTop={30}>
            <div className={styles.headerText}>
              <span>{formatMessage({ id: 'pages_admin.setting.title' })}</span>
            </div>
          </Affix>
          <LayoutAdminSetting listMenu={listMenu} tabName={tabName} roleId={roleId} />
        </div>
      </PageContainer>
    );
  }
}

export default SettingTab;
