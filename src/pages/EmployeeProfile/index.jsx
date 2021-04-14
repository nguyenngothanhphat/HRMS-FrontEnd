import React, { Component } from 'react';
import { Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { connect } from 'umi';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
import BenefitTab from '@/pages/EmployeeProfile/components/BenefitTab';
import EmploymentTab from '@/pages/EmployeeProfile/components/EmploymentTab';
// import PerformanceHistory from '@/pages/EmployeeProfile/components/PerformanceHistory';
import GeneralInfo from './components/GeneralInfo';
import AccountsPaychecks from './components/Accounts&Paychecks';
// import Test from './components/test';
import Documents from './components/Documents';
import styles from './index.less';

@connect(({ employeeProfile, user: { currentUser = {}, permissions = {} } }) => ({
  employeeProfile,
  currentUser,
  permissions,
}))
class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {
      employeeProfile,
      match: { params: { reId: employee = '' } = {} },
      dispatch,
    } = this.props;
    dispatch({
      type: 'employeeProfile/fetchGeneralInfo',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchCompensation',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchPassPort',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchVisa',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchAdhaardCard',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchCountryList',
    });
    dispatch({
      type: 'employeeProfile/fetchEmploymentInfo',
      payload: employee,
    });
    dispatch({
      type: 'employeeProfile/fetchPRReport',
      payload: { employee },
    });
    // dispatch({
    //   type: 'employeeProfile/fetchDocuments',
    //   payload: { employee },
    // });
    dispatch({
      type: 'employeeProfile/fetchPayslips',
      payload: { employee, employeeGroup: 'Payslip' },
    });
    dispatch({
      type: 'employeeProfile/fetchBank',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchTax',
      payload: { employee },
    });
    dispatch({ type: 'employeeProfile/fetchLocations' });
    dispatch({ type: 'employeeProfile/fetchEmployeeTypes' });
    dispatch({
      type: 'employeeProfile/fetchDepartments',
      payload: { company: employeeProfile?.originData?.compensationData?.company },
    });
    dispatch({ type: 'employeeProfile/fetchEmployees' });
    dispatch({ type: 'employeeProfile/fetchChangeHistories', payload: { employee } });
    dispatch({ type: 'employeeProfile/fetchEmployeeDependentDetails', payload: { employee } });
    dispatch({ type: 'employeeProfile/getBenefitPlans' });
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
    const { permissions } = this.props;
    listMenu.push({
      id: 1,
      name: 'General Info',
      component: <GeneralInfo permissions={permissions} profileOwner={profileOwner} />,
    });
    if (permissions.viewTabEmployment !== -1 || profileOwner) {
      listMenu.push({
        id: 2,
        name: `Employment & Compensation`,
        component: <EmploymentTab />,
      });
    }
    if (permissions.viewTabAccountPaychecks !== -1 || profileOwner) {
      listMenu.push({ id: 3, name: 'Accounts and Paychecks', component: <AccountsPaychecks /> });
    }
    if (permissions.viewTabDocument !== -1 || profileOwner) {
      listMenu.push({ id: 4, name: 'Documents', component: <Documents /> });
    }
    // if (permissions.viewTabTimeSchedule !== -1 || profileOwner) {
    //   listMenu.push({ id: 5, name: 'Time & Scheduling', component: <Test /> });
    // }
    if (permissions.viewTabBenefitPlans !== -1 || profileOwner) {
      listMenu.push({ id: 5, name: 'Benefit Plans', component: <BenefitTab /> });
    }

    return listMenu;
  };

  render() {
    const {
      match: { params: { reId: employee = '' } = {} },
      currentUser: { employee: currentEmployee = {} },
      permissions = {},
      location: { state: { location = '' } = {} } = {},
    } = this.props;

    const listMenu = this.renderListMenu(employee, currentEmployee._id);

    const profileOwner = this.checkProfileOwner(currentEmployee._id, employee);

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
            employeeLocation={location}
            permissions={permissions}
            profileOwner={profileOwner}
          />
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeProfile;
