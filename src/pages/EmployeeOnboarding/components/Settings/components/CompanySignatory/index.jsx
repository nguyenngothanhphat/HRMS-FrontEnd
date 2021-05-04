import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import CompanySignatoryHeader from './components/CompanySignatoryHeader';
import CompanySignatoryForm from './components/CompanySignatoryForm';

import styles from './index.less';

@connect(({ loading, companiesManagement: { originData: { companyDetails } = {} } = {} }) => ({
  loading: loading.effects['companiesManagement/updateCompany'],
  companyDetails,
}))
class CompanySignatory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/fetchCompanyDetails',
      payload: {
        id: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    });
  };

  showAddSignatoryModal = (value) => {
    this.setState({
      addModalVisible: value,
    });
  };

  render() {
    const companyId = getCurrentCompany();
    const { addModalVisible } = this.state;
    return (
      <div className={styles.CompanySignatory}>
        <CompanySignatoryHeader showAddSignatoryModal={this.showAddSignatoryModal} />
        <CompanySignatoryForm
          addModalVisible={addModalVisible}
          showAddSignatoryModal={this.showAddSignatoryModal}
          companyId={companyId}
        />
      </div>
    );
  }
}

export default CompanySignatory;
