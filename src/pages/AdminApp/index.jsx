/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/LayoutAdminApp';
import { connect } from 'umi';
import CompanyDetails from './components/CompanyDetails';
import WorkLocations from './components/WorkLocations';
import Departments from './components/Departments';
import CompanySignatory from './components/CompanySignatory';
import styles from './index.less';

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
class AdminApp extends Component {
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
      match: { params: { id = '' } = {} },
    } = this.props;
    const routes = [
      { name: 'Home', path: '/dashboard' },
      {
        name: 'Admin App',
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
          name: 'Departments',
          component: <Departments companyId={id} />,
        },
        {
          id: 4,
          name: 'Company Signatory',
          component: <CompanySignatory companyId={id} />,
        },
      ];
    }

    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={styles.root}>
          <Layout listMenu={listMenu} isCompanyProfile />
        </div>
      </>
    );
  }
}

export default AdminApp;
