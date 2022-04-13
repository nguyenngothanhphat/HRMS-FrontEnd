import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import { Skeleton } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentCompany, getCurrentTenant, isOwner } from '@/utils/authority';
import styles from './index.less';
import TableContainer from './components/TableContainer';

@connect(
  ({
    loading,
    locationSelection: { companyLocationList = [] } = {},
    user: {
      companiesOfUser = [],
      currentUser: { roles = [], signInRole = [], manageTenant = [] } = {},
    } = {},
  }) => ({
    roles,
    signInRole,
    manageTenant,
    companiesOfUser,
    companyLocationList,
    loadingFetchLocations:
      loading.effects['locationSelection/fetchLocationsByCompany'] ||
      loading.effects['locationSelection/fetchLocationListByParentCompany'],
  }),
)
class UsersManagement extends PureComponent {
  componentDidMount = async () => {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    // const checkIsOwner = isOwner();
    await dispatch({
      type: 'usersManagement/fetchFilterList',
      payload: {
        id: company,
        tenantId,
      },
    });
    this.fetchData();
  };

  fetchData = async () => {
    const { dispatch, manageTenant = [] } = this.props;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    const checkIsOwner = isOwner();

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

    dispatch({
      type: 'usersManagement/fetchRoleList',
    });
  };

  componentWillUnmount = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'usersManagement/save',
      payload: {
        activeEmployeesList: [],
        inActiveEmployeesList: [],
        employeeDetail: [],
        filterList: {},
      },
    });
  };

  operations = () => {
    return <div />;
  };

  render() {
    const { loadingFetchLocations = false, companyLocationList = [] } = this.props;
    return (
      <PageContainer>
        <div className={styles.containerUsers}>
          <div className={styles.headerText}>
            <span>{formatMessage({ id: 'pages_admin.users.title' })}</span>
          </div>
          {loadingFetchLocations && companyLocationList.length === 0 ? (
            <div style={{ padding: '24px' }}>
              <Skeleton />
            </div>
          ) : (
            <TableContainer />
          )}
        </div>
      </PageContainer>
    );
  }
}
export default UsersManagement;
