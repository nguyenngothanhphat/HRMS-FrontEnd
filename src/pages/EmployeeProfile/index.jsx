import React, { Component } from 'react';
import { Affix, Skeleton } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { connect, history } from 'umi';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
import BenefitTab from '@/pages/EmployeeProfile/components/BenefitTab';
import EmploymentTab from '@/pages/EmployeeProfile/components/EmploymentTab';
// import PerformanceHistory from '@/pages/EmployeeProfile/components/PerformanceHistory';
import { getCurrentCompany, getCurrentTenant, isOwner } from '@/utils/authority';
import GeneralInfo from './components/GeneralInfo';
import AccountsPaychecks from './components/Accounts&Paychecks';
// import Test from './components/test';
import Documents from './components/Documents';
import styles from './index.less';
import PerformanceHistory from './components/PerformanceHistory';

@connect(
  ({
    employee: { listEmployeeActive = [] } = {},
    employeeProfile,
    user: { currentUser = {}, permissions = {} },
    loading,
  }) => ({
    employeeProfile,
    currentUser,
    listEmployeeActive,
    permissions,
    loadingFetchEmployee: loading.effects['employeeProfile/fetchGeneralInfo'],
  }),
)
class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    const { dispatch, match: { params: { reId = '' } = {} } = {} } = this.props;
    // const tenantCurrentEmployee = localStorage.getItem('tenantCurrentEmployee');
    // const companyCurrentEmployee = localStorage.getItem('companyCurrentEmployee');
    // const idCurrentEmployee = localStorage.getItem('idCurrentEmployee');
    await dispatch({
      type: 'employeeProfile/fetchEmployeeIdByUserId',
      payload: {
        userId: reId,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    });
    // await dispatch({
    //   type: 'employeeProfile/save',
    //   payload: {
    //     tenantCurrentEmployee,
    //     companyCurrentEmployee,
    //     idCurrentEmployee,
    //   },
    // });

    // if (!tabName) {
    //   const link = isOwner() ? 'employees' : 'directory';
    //   history.replace(`/${link}/employee-profile/${reId}/general-info`);
    // } else {
    this.fetchData();
    // }
  };

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      // this.fetchData();
    }
  }

  fetchData = async () => {
    const {
      employeeProfile: { employee = '' } = {},
      // match: { params: { reId: employee = '' } = {} },
      dispatch,
      // employeeProfile: {
      //   tenantCurrentEmployee: tenantId1 = '',
      //   companyCurrentEmployee = ''
      // } = {},
    } = this.props;
    let tenantId1 = localStorage.getItem('tenantCurrentEmployee');
    tenantId1 = tenantId1 && tenantId1 !== 'undefined' ? tenantId1 : '';

    const res = await dispatch({
      type: 'employeeProfile/fetchEmploymentInfo',
      payload: { id: employee, tenantId: tenantId1 || getCurrentTenant() },
    });

    const tenantId = getCurrentTenant();
    dispatch({
      type: 'employeeProfile/fetchGeneralInfo',
      payload: { employee, tenantId },
    });

    const { statusCode } = res;
    if (statusCode === 200) {
      const companyCurrentEmployee = getCurrentCompany();

      dispatch({
        type: 'employeeProfile/fetchCompensation',
        payload: { employee, tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchPassPort',
        payload: { employee, tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchVisa',
        payload: { employee, tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchAdhaardCard',
        payload: { employee, tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchCountryList',
      });

      dispatch({
        type: 'employeeProfile/fetchPRReport',
        payload: { employee, tenantId },
      });
      // dispatch({
      //   type: 'employeeProfile/fetchDocuments',
      //   payload: { employee },
      // });
      dispatch({
        type: 'employeeProfile/fetchPayslips',
        payload: { employee, employeeGroup: 'Payslip', tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchBank',
        payload: { employee, tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchTax',
        payload: { employee, tenantId },
      });
      dispatch({ type: 'employeeProfile/fetchLocations' });
      dispatch({
        type: 'employeeProfile/fetchEmployeeTypes',
        payload: { tenantId },
      });
      dispatch({
        type: 'employeeProfile/fetchDepartments',
        payload: { company: companyCurrentEmployee, tenantId },
      });
      // dispatch({ type: 'employeeProfile/fetchEmployees'});
      dispatch({ type: 'employeeProfile/fetchChangeHistories', payload: { employee, tenantId } });
      dispatch({
        type: 'employeeProfile/fetchEmployeeDependentDetails',
        payload: { employee, tenantId },
      });
      dispatch({
        type: 'employeeProfile/getBenefitPlans',
        payload: {
          tenantId,
          company: companyCurrentEmployee,
        },
      });
    }
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    localStorage.removeItem('tenantCurrentEmployee');
    localStorage.removeItem('companyCurrentEmployee');
    localStorage.removeItem('idCurrentEmployee');
    dispatch({
      type: 'employeeProfile/clearState',
    });
  };

  checkProfileOwner = (currentUserID, employeeID) => {
    if (currentUserID === employeeID) {
      return true;
    }
    return false;
  };

  renderListMenu = (employee, _id) => {
    const listMenu = [];
    const profileOwner = this.checkProfileOwner(_id, employee);
    const { permissions, listEmployeeActive } = this.props;
    listMenu.push({
      id: 1,
      name: 'General Info',
      component: <GeneralInfo permissions={permissions} profileOwner={profileOwner} />,
      link: 'general-info',
    });
    if (permissions.viewTabEmployment !== -1 || profileOwner) {
      listMenu.push({
        id: 2,
        name: `Employment & Compensation`,
        component: <EmploymentTab listEmployeeActive={listEmployeeActive} />,
        link: 'employment-compensation',
      });
    }
    if (permissions.viewTabAccountPaychecks !== -1 || profileOwner) {
      listMenu.push({
        id: 3,
        name: 'Performance History',
        component: <PerformanceHistory />,
        link: 'performance-history',
      });
    }
    if (permissions.viewTabAccountPaychecks !== -1 || profileOwner) {
      listMenu.push({
        id: 4,
        name: 'Accounts and Paychecks',
        component: <AccountsPaychecks />,
        link: 'accounts-paychecks',
      });
    }
    if (permissions.viewTabDocument !== -1 || profileOwner) {
      listMenu.push({ id: 5, name: 'Documents', component: <Documents />, link: 'documents' });
    }
    // if (permissions.viewTabTimeSchedule !== -1 || profileOwner) {
    //   listMenu.push({ id: 5, name: 'Time & Scheduling', component: <Test /> });
    // }
    if (permissions.viewTabBenefitPlans !== -1 || profileOwner) {
      listMenu.push({
        id: 6,
        name: 'Benefit Plans',
        component: <BenefitTab />,
        link: 'benefit-plans',
      });
    }

    return listMenu;
  };

  render() {
    const {
      match: { params: { reId: employee = '', tabName = '' } = {} },
      currentUser: { employee: currentEmployee = {} },
      permissions = {},
      location: { state: { location = '' } = {} } = {},
      loadingFetchEmployee,
      // employeeProfile,
    } = this.props;

    const listMenu = this.renderListMenu(employee, currentEmployee?._id);

    const profileOwner = this.checkProfileOwner(currentEmployee?._id, employee);

    const tenant = localStorage.getItem('tenantCurrentEmployee');
    const company = localStorage.getItem('companyCurrentEmployee');
    const id = localStorage.getItem('idCurrentEmployee');

    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Employee Profile</p>
            </div>
          </Affix>
          {tenant && company && id && !loadingFetchEmployee ? (
            <LayoutEmployeeProfile
              listMenu={listMenu}
              tabName={tabName}
              reId={employee}
              employeeLocation={location}
              permissions={permissions}
              profileOwner={profileOwner}
            />
          ) : (
            <div style={{ padding: '24px' }}>
              <Skeleton />
            </div>
          )}
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeProfile;
