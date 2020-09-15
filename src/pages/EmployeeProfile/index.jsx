import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
import BenefitTab from '@/pages/EmployeeProfile/components/BenefitTab';
import Test from './components/test';
import styles from './index.less';

class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // fetch employee by id
    // const {
    //   match: { params: { reId = '' } = {} },
    // } = this.props;
  }

  render() {
    const listMenu = [
      {
        id: 1,
        name: 'General Info',

        component: <Test />,
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
      { id: 4, name: 'Accounts and Paychecks', component: <Test /> },
      { id: 5, name: 'Documents', component: <Test /> },
      { id: 6, name: 'Work Eligibility & I-9', component: <Test /> },
      { id: 7, name: 'Time & Scheduling', component: <Test /> },
      { id: 8, name: 'Benefit Plans', component: <BenefitTab /> },
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
