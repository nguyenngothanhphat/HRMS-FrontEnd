import React, { Component } from 'react';
import { Tabs } from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/LayoutEmployeeProfile';
import { connect } from 'umi';
import UserManagement from './components/UserManagement';
import CompanyDetails from './components/CompanyDetails';
import WorkLocations from './components/WorkLocations';
import Departments from './components/Departments';
import CompanySignatory from './components/CompanySignatory';
import CompanyDocuments from './components/CompanyDocuments';
import ImportEmployees from './components/ImportEmployees';
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
];

@connect(
  ({
    user: { currentUser = {} } = {},
    departmentManagement: { listByCompany: listDepartment = [] } = {},
  }) => ({
    currentUser,
    listDepartment,
  }),
)
class CompanyProfile extends Component {
  componentDidMount() {
    const { dispatch, currentUser: { company: { _id: id = '' } = {} } = {} } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'companiesManagement/fetchLocationsList',
      payload: { company: id },
    });
    dispatch({
      type: 'departmentManagement/fetchListDefaultDepartment',
      payload: { company: id },
    });
    dispatch({
      type: 'departmentManagement/fetchListDepartmentByCompany',
      payload: { company: id },
    });
    dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        company: id,
      },
    });
  }

  render() {
    const { listDepartment = [] } = this.props;
    const routes = [
      { name: 'Getting Started', path: '/account-setup' },
      { name: 'Account Setup', path: '/account-setup/company-profile' },
    ];

    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={styles.root}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Profile Information" key="1">
              <Layout
                listMenu={listMenu}
                isCompanyProfile
                disableSetupDirectory={listDepartment.length === 0}
              />
            </TabPane>
            <TabPane tab="User Management" key="2" disabled={listDepartment.length === 0}>
              <UserManagement />
            </TabPane>
            <TabPane tab="Company Documents" key="3">
              <CompanyDocuments />
            </TabPane>
            <TabPane tab="Import Employees" key="4" disabled={listDepartment.length === 0}>
              <ImportEmployees />
            </TabPane>
          </Tabs>
        </div>
      </>
    );
  }
}

export default CompanyProfile;
