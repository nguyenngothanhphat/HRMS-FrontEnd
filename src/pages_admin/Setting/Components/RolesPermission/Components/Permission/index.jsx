import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage, connect } from 'umi';
import LayoutAdminSetting from '@/components/LayoutRoles&PermissionLeftMenu';
import { Affix, Spin } from 'antd';
import PermissionInfo from './PermissionInfo';
import styles from './index.less';

@connect(
  ({ loading, adminSetting: { idRoles = '', tempData: { formatData = [] } = {} } = {} }) => ({
    idRoles,
    formatData,
    loadingRoles: loading.effects['adminSetting/fetchListRoles'],
    loading: loading.effects['adminSetting/fetchListPermissionOfRole'],
  }),
)
class Permission extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      // match: { params: { reId: idRoles = '' } = {} },
      idRoles,
    } = this.props;
    dispatch({
      type: 'adminSetting/fetchListRoles',
    });
    dispatch({
      type: 'adminSetting/fetchListPermissionOfRole',
      payload: { idRoles },
    });
  }

  render() {
    const {
      loading,
      match: { params: { roleId = '' } = {} },
    } = this.props;

    const dataRoles = JSON.parse(localStorage.getItem('dataRoles'));
    const listMenuRoles = dataRoles.map((item, index) => {
      const { RolesID, Rolesname } = item;
      return {
        id: index + 1,
        name: Rolesname,
        component: <PermissionInfo id={RolesID} />,
        link: Rolesname.toLowerCase(),
      };
    });
    if (loading)
      return (
        <div className={styles.Permission}>
          <Spin loading={loading} active size="large" />
        </div>
      );
    return (
      <PageContainer>
        <div className={styles.Permission}>
          <Affix offsetTop={30}>
            <div className={styles.headerText}>
              <span>{formatMessage({ id: 'pages_admin.setting.Permission' })}</span>
            </div>
          </Affix>
          <div>
            <LayoutAdminSetting listMenu={listMenuRoles} roleId={roleId} />
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default Permission;
