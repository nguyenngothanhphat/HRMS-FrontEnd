import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage, connect } from 'umi';
import { Affix } from 'antd';
import ComponyInformation from './components/CompanyInformation';
import WorkLocation from './components/WorkLocation';
import OwnerContact from './components/OwnerContact';
import LicenseAndPayment from './components/LicenseAndPayment';
import LayoutCompanyDetail from './components/LayoutCompanyDetail';
import styles from './index.less';

@connect(() => ({}))
class CompanyDetail extends Component {
  componentDidMount() {
    const {
      match: { params: { reId: companyID = '' } = {} },
      dispatch,
    } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'companiesManagement/fetchCompanyDetails',
      payload: { companyID },
    });
  }

  render() {
    const listMenu = [
      {
        id: 1,
        name: formatMessage({ id: 'pages_admin.company.information' }),
        component: <ComponyInformation />,
      },
      {
        id: 2,
        name: formatMessage({ id: 'pages_admin.companies.table.workLocation' }),
        component: <WorkLocation />,
      },
      {
        id: 3,
        name: formatMessage({ id: 'pages_admin.company.ownerContact' }),
        component: <OwnerContact />,
      },
      {
        id: 4,
        name: formatMessage({ id: 'pages_admin.company.licensePayment' }),
        component: <LicenseAndPayment />,
      },
    ];
    return (
      <div className={styles.companyDetail}>
        <PageContainer>
          <div className={styles.companyDetailContent}>
            <Affix offsetTop={40}>
              <div className={styles.titlePage}>
                <p className={styles.titlePage_text}>
                  {formatMessage({ id: 'pages_admin.companies.companyDetail' })}
                </p>
              </div>
            </Affix>
            <LayoutCompanyDetail listMenu={listMenu} />
          </div>
        </PageContainer>
      </div>
    );
  }
}

export default CompanyDetail;
