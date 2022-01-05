import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import DependentTabs from './components/DependentTabs';
import IconAdd from './components/DependentTabs/Edit/assets/AddIcon.svg';
import ModalAddDependant from './components/DependentTabs/ModalAddDependant';
import ElectedCoverage from './components/ElectedCoverage';
import styles from './styles.less';

@connect(
  ({
    employeeProfile: {
      tenantCurrentEmployee = '',
      idCurrentEmployee = '',
      originData: { dependentDetails, benefitPlans },
    },
    loading,
  }) => ({
    dependentDetails,
    benefitPlans,
    tenantCurrentEmployee,
    idCurrentEmployee,
    loading: loading.effects['employeeProfile/fetchEmployeeDependentDetails'],
  }),
)
class BenefitTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addDependant: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, tenantCurrentEmployee = '', idCurrentEmployee = '' } = this.props;
    dispatch({
      type: 'employeeProfile/fetchEmployeeDependentDetails',
      payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
    });
  };

  setAddingOrEditing = () => {
    const { dependentDetails: { dependents = [] } = {} } = this.props;
    if (dependents.length === 0) {
      this.setAdding(true);
    } else this.setEditing(true);
  };

  handeAddDependant = () => {
    this.setState({ addDependant: true });
  };

  render() {
    const { dependentDetails = [], profileOwner = false } = this.props;
    const { addDependant } = this.state;
    return (
      <div style={{ backgroundColor: '#f6f7f9' }}>
        <div className={styles.benefitTab}>
          <div className={styles.sideTab}>
            <div>
              <div className={styles.header}>
                <span className={styles.headingText}>
                  {formatMessage({ id: 'pages.employeeProfile.BenefitTab.coveredIndividuals' })}
                </span>
              </div>
              <div>
                <DependentTabs data={dependentDetails} />
              </div>
            </div>
            {profileOwner && (
              <div className={styles.addIcon}>
                <div onClick={this.handeAddDependant}>
                  <img src={IconAdd} alt="add" />
                  <span>Add Dependant</span>
                </div>
              </div>
            )}
            <ModalAddDependant
              data={dependentDetails}
              visible={addDependant}
              onClose={() => this.setState({ addDependant: false })}
              mode="multiple"
            />
          </div>
          <ElectedCoverage />
        </div>
      </div>
    );
  }
}
export default BenefitTab;
