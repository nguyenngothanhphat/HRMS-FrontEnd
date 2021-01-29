/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/LayoutEmployeeProfile';
import { connect, history } from 'umi';
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
    const { currentUser } = this.props;
    const routes = [
      { name: 'Getting Started', path: '/account-setup' },
      { name: 'Account Setup', path: '/account-setup/company-profile' },
    ];

    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={styles.root}>
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={
              <Button
                className={styles.btn}
                disabled={currentUser?.firstCreated}
                onClick={() =>
                  history.push({
                    pathname: '/',
                  })
                }
              >
                Finish Setup
              </Button>
            }
          >
            <TabPane tab="Profile Information" key="1">
              <Layout listMenu={listMenu} isCompanyProfile />
            </TabPane>
            <TabPane tab="User Management" key="2" disabled={currentUser?.firstCreated}>
              <UserManagement />
            </TabPane>
            <TabPane tab="Company Documents" key="3">
              <CompanyDocuments />
            </TabPane>
            <TabPane tab="Import Employees" key="4" disabled={currentUser?.firstCreated}>
              <ImportEmployees />
            </TabPane>
          </Tabs>
        </div>
      </>
    );
  }
}

export default CompanyProfile;
