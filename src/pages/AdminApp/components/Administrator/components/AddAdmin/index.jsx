import React, { PureComponent } from 'react';
import SelectRoles from './components/SelectRoles';
import SelectUser from './components/SelectUser';

import styles from './index.less';

export default class AddAdmin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
    };
  }

  onContinue = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  render() {
    const { handleAddAdmin = () => {} } = this.props;
    const { currentStep } = this.state;
    return (
      <div className={styles.AddAdmin}>
        {currentStep === 1 && (
          <SelectRoles handleAddAdmin={handleAddAdmin} onContinue={this.onContinue} />
        )}
        {currentStep === 2 && <SelectUser handleAddAdmin={handleAddAdmin} />}
      </div>
    );
  }
}
