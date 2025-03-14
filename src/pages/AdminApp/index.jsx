/* eslint-disable react/jsx-curly-newline */
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Layout from '@/components/LayoutAdminApp';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import CompanyDetails from './components/CompanyDetails';
import WorkLocations from './components/WorkLocations';
import PlanInfo from './components/PlanInfo';
import BillingPayments from './components/BillingPayments';
import Integrations from './components/Integrations';
import Administrator from './components/Administrator';
import styles from './index.less';

@connect(
  ({
    user: { currentUser = {} } = {},
    departmentManagement: { listByCompany: listDepartment = [] } = {},
  }) => ({
    currentUser,
    listDepartment,
  }),
)
class AdminApp extends Component {
  componentDidMount() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    if (!tabName) {
      history.replace(`/admin-app/company-details`);
    } else {
      const { dispatch } = this.props;
      const id = getCurrentCompany();
      if (id) {
        dispatch({
          type: 'companiesManagement/fetchCompanyDetails',
          payload: { id, tenantId: getCurrentTenant() },
        });
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
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
    const id = getCurrentCompany();

    const listMenu = [
      {
        id: 1,
        name: 'Company Details',
        component: <CompanyDetails companyId={id} />,
        link: 'company-details',
      },
      {
        id: 2,
        name: 'Work Locations',
        component: <WorkLocations companyId={id} />,
        link: 'work-locations',
      },
      {
        id: 3,
        name: 'Administrator',
        component: <Administrator companyId={id} />,
        link: 'administrator',
      },
      {
        id: 4,
        name: 'Plan info',
        component: <PlanInfo companyId={id} />,
        link: 'plan-info',
      },
      {
        id: 5,
        name: 'Billing & Payments',
        component: <BillingPayments companyId={id} />,
        link: 'billing-payments',
      },
      {
        id: 6,
        name: 'Permission',
        link: 'permission',
      },
      {
        id: 7,
        name: 'Integrations',
        component: <Integrations companyId={id} />,
        link: 'integrations',
      },
    ];

    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    if (!tabName) return '';
    return (
      <PageContainer>
        <div className={styles.root}>
          <Layout listMenu={listMenu} tabName={tabName} />
        </div>
      </PageContainer>
    );
  }
}

export default AdminApp;
