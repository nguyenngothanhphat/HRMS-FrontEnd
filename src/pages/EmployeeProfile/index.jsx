import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
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
        name: 'Basic Information',
        key: 'basicInformation',
        component: <Test />,
      },
      { id: 2, name: 'Job Details', key: 'jobDetails', component: <Test /> },
      {
        id: 3,
        name: 'Eligibility Documents',
        key: 'eligibilityDocuments',
        component: <Test />,
      },
      { id: 4, name: 'Offer Details', key: 'offerDetails', component: <Test /> },
      { id: 5, name: 'Benefits', key: 'benefits', component: <Test /> },
      { id: 6, name: 'Salary Structure', key: 'salaryStructure', component: <Test /> },
      { id: 7, name: 'Payroll Settings', key: 'customFields', component: <Test /> },
      { id: 8, name: 'Custom Fields', key: 'additionalOptions', component: <Test /> },
      {
        id: 9,
        name: 'Additional Options',
        key: 'additionalOptions',
        component: <Test />,
      },
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
