import React, { PureComponent } from 'react';
import SelectRoles from './components/SelectRoles';
import SelectUser from './components/SelectUser';

import styles from './index.less';

export default class EditAdmin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      // adminRoles: [],
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

  onContinue = (step, values) => {
    const { handleEditAdmin = () => {} } = this.props;

    if (step === 1) {
      this.setState({
        currentStep: step + 1,
        // adminRoles: values,
      });
    }

    if (step === 2) {
      // this.setState({
      //   adminInfo: values,
      // });
      handleEditAdmin(false);
    }
  };

  render() {
    const { handleEditAdmin = () => {}, dataAdmin = {}, permissionList = [] } = this.props;
    const { currentStep } = this.state;
    return (
      <div className={styles.EditAdmin}>
        {currentStep === 1 && (
          <SelectRoles
            dataAdmin={dataAdmin}
            permissionList={permissionList}
            handleEditAdmin={handleEditAdmin}
            onContinue={this.onContinue}
          />
        )}
        {currentStep === 2 && (
          <SelectUser
            dataAdmin={dataAdmin}
            handleEditAdmin={handleEditAdmin}
            onContinue={this.onContinue}
          />
        )}
      </div>
    );
  }
}
