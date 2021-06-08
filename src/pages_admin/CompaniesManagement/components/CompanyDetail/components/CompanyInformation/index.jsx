import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import Information from './components/Information';
import HeadquaterAddress from './components/HeadquaterAddress';
import LegalAddress from './components/LegalAddress';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { company: companyDetailsOrigin = {} } = {} },
      tempData: { companyDetails: { company: companyDetails = {} } = {} },
    } = {},
    loading,
  }) => ({
    companyDetailsOrigin,
    companyDetails,
    loadingDetails: loading.effects['companiesManagement/fetchCompanyDetails'],
  }),
)
class CompanyInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { companyDetailsOrigin, loadingDetails } = this.props;
    const { headQuarterAddress = {}, legalAddress = {} } = companyDetailsOrigin;
    if (loadingDetails) {
      return (
        <div>
          <Skeleton active />
        </div>
      );
    }
    return (
      <div>
        <Information information={companyDetailsOrigin} />
        <HeadquaterAddress headQuarterAddress={headQuarterAddress} />
        <LegalAddress legalAddress={legalAddress} />
      </div>
    );
  }
}

export default CompanyInformation;
