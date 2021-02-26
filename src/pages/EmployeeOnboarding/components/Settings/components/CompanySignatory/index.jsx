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
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, companyId = '' } = this.props;
    dispatch({
      type: 'companiesManagement/fetchCompanyDetails',
      payload: {
        id: companyId,
      },
    });
  };

  showAddSignatoryModal = (value) => {
    this.setState({
      addModalVisible: value,
    });
  };

  render() {
    const { companyId = '' } = this.props;
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
