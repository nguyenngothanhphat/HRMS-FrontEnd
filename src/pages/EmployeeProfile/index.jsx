import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { connect } from 'umi';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
import GeneralInfo from './components/GeneralInfo';
import AccountsPaychecks from './components/Accounts&Paychecks';
import Test from './components/test';
import Documents from './components/Documents';
import styles from './index.less';

@connect(({ employeeProfile }) => ({
  employeeProfile,
}))
class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // fetch employee by id
    const {
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
  }

  render() {
    const listMenu = [
      {
        id: 1,
        name: 'General Info',

        component: <GeneralInfo />,
      },
      {
        id: 2,
        name: `Employment & Compensation`,
        component: <Test />,
      },
      {
        id: 3,
        name: 'Performance History',
        component: <Test />,
      },
      { id: 4, name: 'Accounts and Paychecks', component: <AccountsPaychecks /> },
      { id: 5, name: 'Documents', component: <Documents /> },
      { id: 6, name: 'Work Eligibility & I-9', component: <Test /> },
      { id: 7, name: 'Time & Scheduling', component: <Test /> },
      { id: 8, name: 'Benefit Plans', component: <Test /> },
    ];
    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Employee Profile</p>
          </div>
          <LayoutEmployeeProfile listMenu={listMenu} />
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeProfile;
