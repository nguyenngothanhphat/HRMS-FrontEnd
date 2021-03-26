import React, { PureComponent } from 'react';
import SelectRoles from './components/SelectRoles';
import SelectUser from './components/SelectUser';

import styles from './index.less';

export default class AddAdmin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      adminRoles: [],
      adminInfo: {},
    };
  }

  onContinue = (step, values) => {
    const { handleAddAdmin = () => {} } = this.props;

    if (step === 1) {
      this.setState({
        currentStep: step + 1,
        adminRoles: values,
      });
    }

    if (step === 2) {
      this.setState({
        adminInfo: values,
      });
      handleAddAdmin(false);
    }
  };

  render() {
    const { handleAddAdmin = () => {} } = this.props;
    const { currentStep, adminRoles, adminInfo } = this.state;
    console.log('admin', adminRoles, adminInfo);
    return (
      <div className={styles.AddAdmin}>
        {currentStep === 1 && (
          <SelectRoles handleAddAdmin={handleAddAdmin} onContinue={this.onContinue} />
        )}
        {currentStep === 2 && (
          <SelectUser handleAddAdmin={handleAddAdmin} onContinue={this.onContinue} />
        )}
      </div>
    );
  }
}
