import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage, connect } from 'umi';
import LayoutAdminSetting from '@/components/LayoutAdminLeftMenu';
import { Affix, Spin } from 'antd';
import PermissionInfo from './PermissionInfo';
import styles from './index.less';

@connect(({ loading, adminSetting: { idRoles = '' } = {} }) => ({
  idRoles,
  loading: loading.effects['adminSetting/fetchListPermissionOfRole'],
}))
class Permission extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { reId: idRoles = '' } = {} },
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
    const { loading, idRoles } = this.props;
    const listMenu = [
      {
        id: 1,
        name: idRoles,
        component: <PermissionInfo />,
      },
    ];
    if (loading)
      return (
        <div className={styles.Permission}>
          <Spin loading={loading} active size="large" />
        </div>
      );
    return (
      <PageContainer>
        <div className={styles.Permission}>
          <Affix offsetTop={40}>
            <div className={styles.headerText}>
              <span>{formatMessage({ id: 'pages_admin.setting.Permission' })}</span>
            </div>
          </Affix>
          <div>
            <LayoutAdminSetting listMenu={listMenu} />
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default Permission;
