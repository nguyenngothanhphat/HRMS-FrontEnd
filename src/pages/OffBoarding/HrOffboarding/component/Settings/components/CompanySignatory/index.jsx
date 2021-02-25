import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CompanySignatoryHeader from './components/CompanySignatoryHeader';
import CompanySignatoryForm from './components/CompanySignatoryForm';

import styles from './index.less';

@connect(
  ({
    loading,
    user: { currentUser: { company: { _id: companyId = '' } = {} } = {} } = {},
    companiesManagement: { originData: { companyDetails } = {} } = {},
  }) => ({
    loading: loading.effects['companiesManagement/updateCompany'],
    companyDetails,
    companyId,
  }),
)
class CompanySignatory extends PureComponent {
  componentDidMount = () => {
    const { dispatch, companyId = '' } = this.props;
    dispatch({
      type: 'companiesManagement/fetchCompanyDetails',
      payload: {
        id: companyId,
      },
    });
  };

  render() {
    const { companyDetails: { companySignature = [] } = {}, companyId = '' } = this.props;
    return (
      <div className={styles.CompanySignatory}>
        <CompanySignatoryHeader />
        <CompanySignatoryForm companyId={companyId} />
      </div>
    );
  }
}

export default CompanySignatory;
