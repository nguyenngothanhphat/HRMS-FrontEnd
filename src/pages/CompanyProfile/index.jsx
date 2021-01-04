import React, { PureComponent } from 'react';

export default class CompanyProfile extends PureComponent {
  render() {
    const {
      match: { params: { reId: companyId = '' } = {} },
    } = this.props;
    return <div>CompanyProfile {companyId}</div>;
  }
}
