import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import { formatMessage, connect } from 'umi';
import IconAdd from './components/DependentTabs/Edit/assets/AddIcon.svg';
import ElectedCoverage from './components/ElectedCoverage';
import DependentTabs from './components/DependentTabs';
import ModalAddDependant from './components/DependentTabs/ModalAddDependant';
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
      isEditing: false,
      isAdding: false,
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

  setEditing = (value) => {
    this.setState({
      isEditing: value,
    });
  };

  setAdding = (value) => {
    this.setState({
      isAdding: value,
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
    const { loading, dependentDetails = [] } = this.props;
    const { isEditing, isAdding, addDependant } = this.state;
    if (loading) return <Skeleton />;
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
                <DependentTabs
                  key={Math.random().toString(36).substring(7)}
                  data={dependentDetails}
                  isEditing={isEditing}
                  setEditing={this.setEditing}
                  isAdding={isAdding}
                  setAdding={this.setAdding}
                />
              </div>
            </div>
            <div className={styles.addIcon}>
              <div onClick={this.handeAddDependant}>
                <img src={IconAdd} alt="add" />
                <span>Add Dependant</span>
              </div>
            </div>
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
