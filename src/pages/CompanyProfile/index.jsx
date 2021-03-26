/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { Tabs, Button, Spin } from 'antd';
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
import Administrator from './components/Administrator';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    departmentManagement: { listByCompany: listDepartment = [] } = {},
  }) => ({
    currentUser,
    listDepartment,
    loading: loading.effects['companiesManagement/fetchCompanyDetails'],
  }),
)
class CompanyProfile extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: { params: { id = '' } = {} },
    } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'departmentManagement/fetchListDefaultDepartment',
    });
    dispatch({
      type: 'user/fetchCompanyOfUser',
    });
    if (id) {
      dispatch({
        type: 'companiesManagement/fetchCompanyDetails',
        payload: { id },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/saveOrigin',
      payload: { companyDetails: {} },
    });
    dispatch({
      type: 'companiesManagement/saveTemp',
      payload: { companyDetails: {} },
    });
  }

  render() {
    const {
      currentUser,
      match: { params: { id = '' } = {} },
      loading = false,
    } = this.props;
    const routes = [
      { name: 'Getting Started', path: '/account-setup' },
      {
        name: id ? 'Account Setup' : 'Add new company',
        path: id ? `/account-setup/company-profile/${id}` : '/account-setup/add-company',
      },
    ];

    let listMenu = [
      {
        id: 1,
        name: 'Company Details',
        component: <CompanyDetails companyId={id} />,
      },
      {
        id: 2,
        name: 'Work Locations',
        component: <WorkLocations companyId={id} />,
      },
    ];

    if (id) {
      listMenu = [
        ...listMenu,
        {
          id: 3,
          name: 'Administrator',
          component: <Administrator companyId={id} />,
        },
        {
          id: 4,
          name: 'Departments',
          component: <Departments companyId={id} />,
        },
        {
          id: 5,
          name: 'Company Signatory',
          component: <CompanySignatory companyId={id} />,
        },
      ];
    }

    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={styles.root}>
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={
              id && (
                <Button
                  className={styles.btn}
                  disabled={currentUser?.firstCreated}
                  onClick={() =>
                    history.push({
                      pathname: '/select-location',
                    })
                  }
                >
                  Finish Setup
                </Button>
              )
            }
          >
            <TabPane tab="Profile Information" key="1">
              {loading ? (
                <div className={styles.viewLoading}>
                  <Spin size="large" />
                </div>
              ) : (
                <Layout listMenu={listMenu} isCompanyProfile />
              )}
            </TabPane>
            {id && (
              <>
                <TabPane tab="User Management" key="2" disabled={currentUser?.firstCreated}>
                  <UserManagement companyId={id} />
                </TabPane>
                <TabPane tab="Company Documents" key="3">
                  <CompanyDocuments companyId={id} />
                </TabPane>
                <TabPane tab="Import Employees" key="4" disabled={currentUser?.firstCreated}>
                  <ImportEmployees companyId={id} />
                </TabPane>
              </>
            )}
          </Tabs>
        </div>
      </>
    );
  }
}

export default CompanyProfile;
