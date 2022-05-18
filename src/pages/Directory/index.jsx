import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import {
  getAuthority,
  getCurrentCompany,
  getCurrentTenant,
  isOwner,
  // isAdmin,
} from '@/utils/authority';
import DirectoryComponent from './components/Directory';
import OrganizationChart from './components/OrganisationChart';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

const { TabPane } = Tabs;

const Directory = (props) => {
  const {
    match: { params: { tabName = '' } = {} },
    roles = [],
    signInRole = [],
    permissions = {},
    dispatch,
    filterList = {},
  } = props;

  const [isOnlyEmployee, setIsOnlyEmployee] = useState(false);

  const viewTabActive = permissions.viewTabActive !== -1;
  const viewTabMyTeam = permissions.viewTabMyTeam !== -1;
  const viewTabInActive = permissions.viewTabInActive !== -1;

  const checkRoleEmployee = () => {
    let flag = false;
    const getAuth = getAuthority();
    const isEmployee = getAuth[0] === 'employee';
    if (roles.length === 1 && roles.some((obj) => obj.toLowerCase() === 'employee')) {
      flag = true;
    }
    if (signInRole[0] === 'ADMIN' && isEmployee) {
      flag = true;
    }
    return flag;
  };

  useEffect(() => {
    const check = checkRoleEmployee();
    setIsOnlyEmployee(check);
  }, [JSON.stringify(roles)]);

  const fetchData = () => {
    if (Object.keys(filterList).length > 0 && filterList) {
      dispatch({
        type: 'employee/save',
        payload: {
          filterList: {},
        },
      });
    }
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    dispatch({
      type: 'employee/fetchFilterList',
      payload: {
        id: company,
        tenantId,
      },
    });
    dispatch({
      type: 'employee/fetchEmployeeType',
    });
  };

  useEffect(() => {
    if (!viewTabActive && !viewTabInActive && !viewTabMyTeam) {
      history.replace(`/directory/org-chart`);
    } else if (!tabName) {
      if (isOwner()) {
        history.replace(`/employees/list`);
      } else if (isOnlyEmployee) history.replace(`/directory/org-chart`);
      else history.replace(`/directory/list`);
    } else {
      fetchData();
    }
    goToTop();

    return () => {
      dispatch({
        type: 'employee/save',
        payload: {
          listEmployeeMyTeam: [],
          listEmployeeActive: [],
          listEmployeeInActive: [],
          filterList: {},
        },
      });
    };
  }, []);

  if (!tabName) return '';
  return (
    <PageContainer>
      <div className={styles.containerDirectory}>
        <Tabs
          activeKey={checkRoleEmployee() && !tabName ? 'org-chart' : tabName || 'list'}
          onChange={(key) => {
            history.push(isOwner() ? `/employees/${key}` : `/directory/${key}`);
          }}
          destroyInactiveTabPane
        >
          {(viewTabActive || viewTabInActive || viewTabMyTeam) && (
            <TabPane
              tab={
                isOwner()
                  ? 'Employees Management'
                  : formatMessage({ id: 'pages.directory.directoryTab' })
              }
              key="list"
            >
              <DirectoryComponent />
            </TabPane>
          )}
          <TabPane
            tab={formatMessage({ id: 'pages.directory.organisationChartTab' })}
            key="org-chart"
          >
            <OrganizationChart />
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
      currentUser: { roles = [], signInRole = [], manageTenant = [] } = {},
    } = {},
    employee: { filterList = {} } = {},
  }) => ({
    roles,
    signInRole,
    manageTenant,
    filterList,
    permissions,
  }),
)(Directory);
