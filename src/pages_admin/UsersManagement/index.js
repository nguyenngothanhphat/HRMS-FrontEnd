import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage, connect } from 'umi';
import { getCurrentCompany, getCurrentTenant, isOwner } from '@/utils/authority';
import styles from './index.less';
import TableContainer from './components/TableContainer';

@connect(
  ({ user: { currentUser: { roles = [], signInRole = [], manageTenant = [] } = {} } = {} }) => ({
    roles,
    signInRole,
    manageTenant,
  }),
)
class UsersManagement extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    // const checkIsOwner = isOwner();
    dispatch({
      type: 'employee/fetchFilterList',
      payload: {
        id: company,
        tenantId,
      },
    });

    this.fetchData();
  }

  fetchData = async () => {
    const { dispatch, manageTenant = [] } = this.props;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    const checkIsOwner = isOwner();

    dispatch({
      type: 'usersManagement/fetchRoleList',
    });

    if (checkIsOwner) {
      await dispatch({
        type: 'locationSelection/fetchLocationListByParentCompany',
        payload: {
          company: companyId,
          tenantIds: manageTenant,
        },
      });
    } else {
      await dispatch({
        type: 'locationSelection/fetchLocationsByCompany',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }
  };

  operations = () => {
    return <div />;
  };

  render() {
    return (
      <PageContainer>
        <div className={styles.containerUsers}>
          <div className={styles.headerText}>
            <span>{formatMessage({ id: 'pages_admin.users.title' })}</span>
          </div>
          <TableContainer />
        </div>
      </PageContainer>
    );
  }
}
export default UsersManagement;
