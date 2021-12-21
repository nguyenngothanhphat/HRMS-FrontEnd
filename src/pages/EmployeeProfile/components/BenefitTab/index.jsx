import React, { PureComponent } from 'react';
import { Skeleton, Tabs } from 'antd';
import { formatMessage, connect } from 'umi';
import IconAdd from './components/DependentTabs/Edit/assets/AddIcon.svg';
import HealthWellbeing from './components/HealthWellbeing';
// import Financial from './components/Financial';
// import Legal from './components/Legal';
import DependentTabs from './components/DependentTabs';
import ModalAddDependant from './components/DependentTabs/ModalAddDependant';
// import ModalEditDependant from './components/DependentTabs/Edit';
import styles from './styles.less';

const { TabPane } = Tabs;
const data = [
  {
    title: 'Medical',
    coverageEndDate: [{ '2020 Open Access Plus - Choice Plan': '20 Jun 2020' }],
  },
  { title: 'Dental', coverageEndDate: [{ '2020 Voluntary Dental': '20 Jun 2020' }] },
  {
    title: 'Life',
    coverageEndDate: [{ '2020 Basic Life': '20 Jun 2020' }],
  },
  { title: 'Vision', coverageEndDate: [{ '2020 Open Access Plus - Choice Plan': '20 Jun 2020' }] },
];
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
    loading:
      loading.effects['employeeProfile/fetchEmployeeDependentDetails'] ||
      loading.effects['employeeProfile/getBenefitPlans'],
  }),
)
class BenefitTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isAdding: false,
      addDependant: false,
      activeKey: '1',
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
    const { isEditing, isAdding, addDependant, activeKey } = this.state;
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
                {/* {!isEditing && !isAdding && (
                  <div className={styles.editButton} onClick={this.setAddingOrEditing}>
                    <EditFilled />
                    <span className={styles.editText}>Edit</span>
                  </div>
                )} */}
                {/** Edit after update data */}
                {/* {!isEmpty(dependents) ? (
                  <>
                    {!isEditing && !isAdding && (
                      <div className={styles.editButton} onClick={this.handleEditDependant}>
                        <EditFilled />
                        <span className={styles.editText}>Edit</span>
                      </div>
                    )}
                  </>
                ) : (
                  ''
                )}
                <ModalEditDependant
                  data={dependents}
                  visible={editDependant}
                  onClose={() => this.setState({ editDependant: false })}
                  mode="multiple"
                /> */}
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
          {/* <div className={styles.sideTab}>
            <div>
              <span className={styles.headings}>
                {formatMessage({ id: 'pages.employeeProfile.BenefitTab.kycDetails' })}
              </span>
              <KYC
                kycStat="Complete"
                walletStat="Active"
                adhaar="8947-9866-9999-9999"
                paytm="+91-7876534261"
              />
            </div>
          </div> */}

          <div className={styles.sideTab}>
            <h3 className={styles.headings}>
              {formatMessage({ id: 'pages.employeeProfile.BenefitTab.electedCoverage' })}
            </h3>
            <div>
              <Tabs activeKey={activeKey} onTabClick={(key) => this.setState({ activeKey: key })}>
                <TabPane tab="Health & Wellbeing" key="1">
                  {/* {data.map((item) => {
                    return (
                      <HealthWellbeing key={Math.random().toString(36).substring(7)} data={item} />
                    );
                  })} */}
                </TabPane>
                {/*  <TabPane tab="Financial" key="2">
                  <Financial />
                </TabPane>
                <TabPane tab="Legal" key="3">
                  <Legal />
                </TabPane> */}
              </Tabs>
            </div>
          </div>
          {/* <div className={styles.sideTab}>
            <Collapse
              accordion
              bordered={false}
              expandIcon={({ isActive }) =>
                isActive ? (
                  // <img src={MinusIcon} alt="collapse" />
                  <MinusOutlined className={styles.minusIcon} />
                ) : (
                  <img src={AddIcon} alt="expand" />
                )}
              className="site-collapse-custom-collapse"
              expandIconPosition="right"
            >
              <Collapse.Panel
                header={formatMessage({ id: 'pages.employeeProfile.BenefitTab.availablePlans' })}
                key="1"
                className="site-collapse-custom-panel"
              >
                <div>
                  <h1 className={styles.subHeadings}>
                    {formatMessage({ id: 'pages.employeeProfile.BenefitTab.forGlobalEmployees' })}
                  </h1>
                  <div className={styles.content}>
                    {data.map((item) => {
                      return (
                        <GroupInfoType2 key={Math.random().toString(36).substring(7)} data={item} />
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h1 className={styles.subHeadings}>
                    {formatMessage({ id: 'pages.employeeProfile.BenefitTab.forIndianEmployees' })}
                  </h1>
                  <div className={styles.content}>
                    {data.map((item) => {
                      return (
                        <GroupInfoType2 key={Math.random().toString(36).substring(7)} data={item} />
                      );
                    })}
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div> */}
        </div>
      </div>
    );
  }
}
export default BenefitTab;
