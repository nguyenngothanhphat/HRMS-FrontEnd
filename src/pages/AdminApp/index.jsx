/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import Layout from '@/components/LayoutAdminApp';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import CompanyDetails from './components/CompanyDetails';
import WorkLocations from './components/WorkLocations';
import PlanInfo from './components/PlanInfo';
import BillingPayments from './components/BillingPayments';
import Integrations from './components/Integrations';
import Administrator from './components/Administrator';
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
    const { dispatch } = this.props;
    const id = getCurrentCompany();
    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'departmentManagement/fetchListDefaultDepartment',
    });
    dispatch({
      type: 'user/fetchCompanyOfUser',
    });
    dispatch({
      type: 'companiesManagement/fetchCompanyTypeList',
    });
    dispatch({
      type: 'companiesManagement/fetchIndustryList',
    });
    if (id) {
      dispatch({
        type: 'companiesManagement/fetchCompanyDetails',
        payload: { id },
      });
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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
    const id = getCurrentCompany();

    const listMenu = [
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
      {
        id: 3,
        name: 'Administrator',
        component: <Administrator companyId={id} />,
      },
      {
        id: 4,
        name: 'Plan info',
        component: <PlanInfo companyId={id} />,
      },
      {
        id: 5,
        name: 'Billing & Payments',
        component: <BillingPayments companyId={id} />,
      },
      {
        id: 6,
        name: 'Permission',
        // component: <CompanySignatory companyId={id} />,
      },
      {
        id: 7,
        name: 'Integrations',
        component: <Integrations companyId={id} />,
      },
    ];

    return (
      <PageContainer>
        <div className={styles.root}>
          {/* <div className={styles.titlePage}>Admin App</div> */}
          <Layout listMenu={listMenu} />
        </div>
      </PageContainer>
    );
  }
}

export default AdminApp;
