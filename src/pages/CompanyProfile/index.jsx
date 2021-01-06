import Layout from '@/components/LayoutEmployeeProfile';
import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import CompanyDetails from './components/CompanyDetails';
import UserManagement from './components/UserManagement';
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
    component: <CompanyDetails />,
  },
  {
    id: 3,
    name: 'Departments',
    component: <CompanyDetails />,
  },
  {
    id: 4,
    name: 'Company Signatory',
    component: <CompanyDetails />,
  },
  {
    id: 5,
    name: 'Billing & Payments',
    component: <CompanyDetails />,
  },
  {
    id: 6,
    name: 'Plan info',
    component: <CompanyDetails />,
  },
  {
    id: 7,
    name: 'Integrations',
    component: <CompanyDetails />,
  },
];

export default class CompanyProfile extends PureComponent {
  render() {
    const {
      match: { params: { reId: companyId = '' } = {} },
    } = this.props;

    console.log('companyid', companyId);
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
