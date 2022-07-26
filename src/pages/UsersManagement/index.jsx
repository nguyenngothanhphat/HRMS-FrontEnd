import { Skeleton, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentCompany, getCurrentTenant, isOwner } from '@/utils/authority';
import { goToTop } from '@/utils/utils';
import DirectoryComponent from './components/Directory';
import styles from './index.less';

const { TabPane } = Tabs;

const UsersManagement = (props) => {
  const { dispatch, loadingMain = false } = props;

  const companyId = getCurrentCompany();
  const tenantId = getCurrentTenant();
  const checkIsOwner = isOwner();

  const fetchData = async () => {
    if (checkIsOwner) {
      dispatch({
        type: 'location/fetchLocationListByParentCompany',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    } else {
      dispatch({
        type: 'location/fetchLocationsByCompany',
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

  useEffect(() => {
    dispatch({
      type: 'usersManagement/fetchFilterList',
      payload: {
        id: companyId,
        tenantId,
      },
    });
    fetchData();
    goToTop();
    return () => {
      dispatch({
        type: 'usersManagement/save',
        payload: {
          employeeList: [],
          employeeDetail: [],
          filterList: {},
        },
      });
    };
  }, []);

  return (
    <PageContainer>
      <div className={styles.containerDirectory}>
        <Tabs activeKey="list" destroyInactiveTabPane>
          <TabPane tab="Users Management" key="list">
            {loadingMain ? (
              <div style={{ padding: 24 }}>
                <Skeleton />
              </div>
            ) : (
              <DirectoryComponent />
            )}
          </TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default connect(
  ({
    user: {
      permissions = {},
      companiesOfUser = [],
      currentUser: { roles = [], signInRole = [], manageTenant = [] } = {},
    } = {},
    location: { companyLocationList = [] } = {},
    loading,
  }) => ({
    roles,
    signInRole,
    companyLocationList,
    companiesOfUser,
    manageTenant,
    permissions,
    loadingMain:
      loading.effects['location/fetchLocationsByCompany'] ||
      loading.effects['location/fetchLocationListByParentCompany'] ||
      loading.effects['user/fetchCompanyOfUser'],
  }),
)(UsersManagement);
