import React, { PureComponent } from 'react';
// import { Card, Row, Col } from 'antd';
import { connect } from 'umi';
import Information from './components/Information';
import HeadquaterAddress from './components/HeadquaterAddress';
import LegalAddress from './components/LegalAddress';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: companyDetailsOrigin = {} },
      tempData: { companyDetails = {} },
    } = {},
  }) => ({ companyDetailsOrigin, companyDetails }),
)
class CompanyInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { companyDetailsOrigin } = this.props;
    const { headQuarterAddress = {}, legalAddress = {} } = companyDetailsOrigin;
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
