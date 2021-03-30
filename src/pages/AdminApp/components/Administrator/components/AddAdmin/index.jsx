import React, { PureComponent } from 'react';
import { connect } from 'umi';
import SelectRoles from './components/SelectRoles';
import SelectUser from './components/SelectUser';

import styles from './index.less';

@connect(
  ({ adminApp, companiesManagement: { originData: { companyDetails = {} } = {} } = {} }) => ({
    adminApp,
    companyDetails,
  }),
)
class AddAdmin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      adminRoles: [],
      // adminInfo: {},
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
        adminRoles: values,
      });
    }

    if (step === 2) {
      const { dispatch } = this.props;
      const { firstName = '', email = '', name1 = '' } = values;
      const { adminRoles = [] } = this.state;
      const tenantId = localStorage.getItem('tenantId');
      const company = localStorage.getItem('currentCompanyId');
      const payload = {
        firstName: firstName || name1,
        email,
        company,
        tenantId,
        permissionAdmin: adminRoles,
      };

      const res = await dispatch({
        type: 'adminApp/addNewAdmin',
        payload,
      });
      const { statusCode = 0 } = res;
      if (statusCode === 200) handleAddAdmin(false);
    }
  };

  render() {
    const { handleAddAdmin = () => {}, companyDetails = {}, permissionList = [] } = this.props;
    const companyName = companyDetails?.company?.name;
    const { currentStep } = this.state;

    return (
      <div className={styles.AddAdmin}>
        {currentStep === 1 && (
          <SelectRoles
            permissionList={permissionList}
            handleAddAdmin={handleAddAdmin}
            onContinue={this.onContinue}
          />
        )}
        {currentStep === 2 && (
          <SelectUser
            handleAddAdmin={handleAddAdmin}
            onContinue={this.onContinue}
            companyName={companyName}
          />
        )}
      </div>
    );
  }
}
export default AddAdmin;
