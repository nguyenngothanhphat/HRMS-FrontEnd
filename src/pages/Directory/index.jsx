import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
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

@connect(
  ({
    user: { currentUser: { roles = [], signInRole = [], manageTenant = [] } = {} } = {},
    employee: { filterList = {} } = {},
  }) => ({
    roles,
    signInRole,
    manageTenant,
    filterList,
  }),
)
class Directory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      roles: {
        employee: 'EMPLOYEE',
      },
    };
  }

  componentDidMount = async () => {
    const {
      match: { params: { tabName = '' } = {} },
      dispatch,
      roles = [],
      signInRole = [],
      filterList = {},
    } = this.props;
    const checkRoleEmployee = this.checkRoleEmployee(roles, signInRole);

    if (!tabName) {
      if (isOwner()) {
        history.replace(`/employees/list`);
      } else if (checkRoleEmployee) history.replace(`/directory/org-chart`);
      else history.replace(`/directory/list`);
    } else {
      if (Object.keys(filterList).length > 0 && filterList) {
        await dispatch({
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
      // dispatch({
      //   type: 'employee/fetchSkillList',
      // });
      // dispatch({
      //   type: 'employee/fetchEmployeeType',
      // });
      // dispatch({
      //   type: 'employee/fetchEmployeeListSingleCompanyEffect',
      // });
    }
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
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

  checkRoleEmployee = (roles = [], signInRole = []) => {
    let flag = false;
    const getAuth = getAuthority();
    const isEmployee = getAuth[0] === 'employee';

    const { roles: rolesConst } = this.state;
    const checkRole = (obj) => obj === rolesConst.employee;
    if (roles.length === 1 && roles.some(checkRole)) {
      flag = true;
    }

    if (signInRole[0] === 'ADMIN' && isEmployee) {
      flag = true;
    }
    return flag;
  };

  handleLogClick = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { TabPane } = Tabs;
    const {
      match: { params: { tabName = '' } = {} },
      roles = [],
      signInRole = [],
    } = this.props;

    const checkRoleEmployee = this.checkRoleEmployee(roles, signInRole);

    if (!tabName) return '';
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Tabs
            activeKey={checkRoleEmployee && !tabName ? 'org-chart' : tabName || 'list'}
            onChange={(key) => {
              history.push(isOwner() ? `/employees/${key}` : `/directory/${key}`);
            }}
            destroyInactiveTabPane
          >
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
  }
}

export default Directory;
