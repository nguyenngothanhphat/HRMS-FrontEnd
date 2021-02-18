import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { connect, Redirect } from 'umi';

@connect(({ user: { currentUser: { company: { _id: companyId = '' } = {} } = {} } = {} }) => ({
  companyId,
}))
class BackToCompanyProfile extends PureComponent {
  render() {
    const { companyId = '' } = this.props;
    return (
      <PageContainer>
        <Redirect to={`/account-setup/company-profile/${companyId}`} />
      </PageContainer>
    );
  }
}
export default BackToCompanyProfile;
