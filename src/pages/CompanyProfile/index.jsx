import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import Layout from '@/components/LayoutEmployeeProfile';
import UserManagement from './components/UserManagement';
import CompanyDetails from './components/CompanyDetails';
import WorkLocations from './components/WorkLocations';
import Departments from './components/Departments';
import CompanySignatory from './components/CompanySignatory';
import BillingPayments from './components/BillingPayments';
import PlanInfo from './components/PlanInfo';
import Integrations from './components/Integrations';
import styles from './index.less';

const { TabPane } = Tabs;

const listMenu = [
  {
    id: 1,
    name: 'Company Details',
    component: <CompanyDetails />,
  },
  {
    id: 2,
    name: 'Work Locations',
    component: <WorkLocations />,
  },
  {
    id: 3,
    name: 'Departments',
    component: <Departments />,
  },
  {
    id: 4,
    name: 'Company Signatory',
    component: <CompanySignatory />,
  },
  {
    id: 5,
    name: 'Billing & Payments',
    component: <BillingPayments />,
  },
  {
    id: 6,
    name: 'Plan info',
    component: <PlanInfo />,
  },
  {
    id: 7,
    name: 'Integrations',
    component: <Integrations />,
  },
];

export default class CompanyProfile extends PureComponent {
  render() {
    // const {
    //   match: { params: { reId: companyId = '' } = {} },
    // } = this.props;

    // console.log('companyid', companyId);
    return (
      <div className={styles.root}>
        <div className={styles.titlePage}>Company Profile</div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile Information" key="1">
            <Layout listMenu={listMenu} isCompanyProfile />
          </TabPane>
          <TabPane tab="User Management" key="2">
            <UserManagement />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
