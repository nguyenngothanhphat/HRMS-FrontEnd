import { Affix } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
import { PageContainer } from '@/layouts/layout/src';
import BenefitTab from '@/pages/EmployeeProfile/components/BenefitTab';
import EmploymentTab from '@/pages/EmployeeProfile/components/EmploymentTab';
// import PerformanceHistory from '@/pages/EmployeeProfile/components/PerformanceHistory';
import { getCurrentCompany, getCurrentTenant, isOwner } from '@/utils/authority';
// import AccountsPaychecks from './components/Accounts&Paychecks';
import Compensation from './components/Compensation';
// import Test from './components/test';
import Documents from './components/Documents';
import GeneralInfo from './components/GeneralInfo';
import PerformanceHistory from './components/PerformanceHistory';
import styles from './index.less';

const EmployeeProfile = (props) => {
  const {
    dispatch,
    match: { params: { tabName = '', reId = '' } = {} },
    currentUser: { employee: { generalInfo: { userId = '' } = {} } = {} },
    permissions = {},
    location: { state: { location = '' } = {} } = {},
    listEmployeeActive = [],
    // loadingFetchEmployee,
    // employeeProfile,
  } = props;

  const [isProfileOwner, setIsProfileOwner] = useState(false);

  const checkProfileOwner = (currentUserID, employeeID) => {
    if (currentUserID === employeeID) {
      return true;
    }
    return false;
  };

  const fetchData = async (employee) => {
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
    }
  };

  const refreshData = () => {
    dispatch({
      type: 'employeeProfile/fetchEmployeeIdByUserId',
      payload: {
        userId: reId,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        fetchData(res.data);
      }
    });
  };
  useEffect(() => {
    if (!tabName) {
      const link = isOwner() ? 'employees' : 'directory';
      history.replace(`/${link}/employee-profile/${reId}/general-info`);
    } else {
      refreshData();
    }
    return () => {
      localStorage.removeItem('tenantCurrentEmployee');
      localStorage.removeItem('companyCurrentEmployee');
      localStorage.removeItem('idCurrentEmployee');
      dispatch({
        type: 'employeeProfile/clearState',
      });
    };
  }, []);

  const firstRun = useRef(true);

  useEffect(() => {
    const isProfileOwnerTemp = checkProfileOwner(userId, reId);
    setIsProfileOwner(isProfileOwnerTemp);

    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    refreshData();
  }, [reId]);

  const renderListMenu = () => {
    const listMenu = [];
    listMenu.push({
      id: 1,
      name: 'General Info',
      component: <GeneralInfo permissions={permissions} profileOwner={isProfileOwner} />,
      link: 'general-info',
    });
    if (permissions.viewTabEmployment !== -1 || isProfileOwner) {
      listMenu.push({
        id: 2,
        name: `Employment Info`,
        component: (
          <EmploymentTab listEmployeeActive={listEmployeeActive} profileOwner={isProfileOwner} />
        ),
        link: 'employment-info',
      });
    }

    if (permissions.viewTabEmployment !== -1 || isProfileOwner) {
      listMenu.push({
        id: 3,
        name: `Compensation`,
        component: <Compensation profileOwner={isProfileOwner} />,
        link: 'compensation',
      });
    }

    if (permissions.viewTabAccountPaychecks !== -1 || isProfileOwner) {
      listMenu.push({
        id: 4,
        name: 'Performance History',
        component: <PerformanceHistory />,
        link: 'performance-history',
      });
    }
    // if (permissions.viewTabAccountPaychecks !== -1 || isProfileOwner) {
    //   listMenu.push({
    //     id: 5,
    //     name: 'Accounts and Paychecks',
    //     component: <AccountsPaychecks />,
    //     link: 'accounts-paychecks',
    //   });
    // }
    if (permissions.viewTabDocument !== -1 || isProfileOwner) {
      listMenu.push({ id: 5, name: 'Documents', component: <Documents />, link: 'documents' });
    }
    // if (permissions.viewTabTimeSchedule !== -1 || isProfileOwner) {
    //   listMenu.push({ id: 5, name: 'Time & Scheduling', component: <Test /> });
    // }
    if (permissions.viewTabBenefitPlans !== -1 || isProfileOwner) {
      listMenu.push({
        id: 6,
        name: 'Benefits',
        component: <BenefitTab profileOwner={isProfileOwner} />,
        link: 'benefits',
      });
    }

    return listMenu;
  };

  const listMenu = renderListMenu(reId, userId);

  if (!tabName) return '';
  return (
    <PageContainer>
      <div className={styles.containerEmployeeProfile}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Employee Profile</p>
          </div>
        </Affix>

        <LayoutEmployeeProfile
          listMenu={listMenu}
          tabName={tabName}
          reId={reId}
          employeeLocation={location}
          permissions={permissions}
          profileOwner={isProfileOwner}
        />
      </div>
    </PageContainer>
  );
};

export default connect(
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
)(EmployeeProfile);
