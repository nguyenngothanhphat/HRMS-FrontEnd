import React, { PureComponent } from 'react';
import { connect } from 'umi';
import SelectRoles from './components/SelectRoles';
import SelectUser from './components/SelectUser';

import styles from './index.less';

@connect(
  ({
    adminApp,
    companiesManagement: { originData: { companyDetails = {} } = {} } = {},
    loading,
  }) => ({
    adminApp,
    companyDetails,
    loadingAddAdmin: loading.effects['adminApp/addNewAdmin'],
  }),
)
class AddAdmin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      // adminRoles: [],
      adminInfo: {},
    };
  }

  componentDidMount = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  onContinue = async (step, values) => {
    const { handleAddAdmin = () => {} } = this.props;

    if (step === 1) {
      this.setState({
        currentStep: step + 1,
        // adminRoles: values,
        adminInfo: values,
      });
    }

    if (step === 2) {
      const { dispatch } = this.props;
      const { adminInfo = {} } = this.state;
      const { firstName = '', email = '', name1 = '' } = adminInfo;
      // eslint-disable-next-line no-restricted-globals
      const formatAdminRoles = values.filter((x) => isNaN(x));
      const tenantId = localStorage.getItem('tenantId');
      const company = localStorage.getItem('currentCompanyId');
      const payload = {
        firstName: firstName || name1,
        email: email || 'lewis.nguyen@mailinator.com',
        company,
        tenantId,
        permissionAdmin: formatAdminRoles,
      };

      const res = await dispatch({
        type: 'adminApp/addNewAdmin',
        payload,
      });
      const { statusCode = 0 } = res;
      if (statusCode === 200) handleAddAdmin(false);
    }
  };

  onGoBack = () => {
    this.setState({
      currentStep: 1,
    });
  };

  render() {
    const {
      handleAddAdmin = () => {},
      companyDetails = {},
      permissionList = [],
      loadingAddAdmin = false,
    } = this.props;
    const companyName = companyDetails?.company?.name;
    const { currentStep, adminInfo } = this.state;
    const { firstName = '', name1 = '' } = adminInfo;

    return (
      <div className={styles.AddAdmin}>
        {currentStep === 1 && (
          <SelectUser
            handleAddAdmin={handleAddAdmin}
            onContinue={this.onContinue}
            companyName={companyName}
            onBackValues={adminInfo}
          />
        )}
        {currentStep === 2 && (
          <SelectRoles
            permissionList={permissionList}
            handleAddAdmin={handleAddAdmin}
            onContinue={this.onContinue}
            loadingAddAdmin={loadingAddAdmin}
            name={firstName || name1}
            onBack={this.onGoBack}
          />
        )}
      </div>
    );
  }
}
export default AddAdmin;
