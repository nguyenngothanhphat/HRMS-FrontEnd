import React, { PureComponent } from 'react';
import { Collapse, Skeleton } from 'antd';
import { formatMessage, connect } from 'umi';
import { EditFilled, MinusOutlined } from '@ant-design/icons';
import PlusIcon from '@/assets/plusIcon1.svg';
import AddIcon from '@/assets/add-symbols.svg';
import MinusIcon from '@/assets/minusIcon1.svg';
import styles from './styles.less';
import GroupInfoType2 from '../../../../components/GroupInfoType2';
import DependentTabs from './components/DependentTabs';
import KYC from './components/KYC';

const data = [
  {
    title: 'Medical',
    plans: [{ 'Medical stuff': '07.20.21' }, { 'Medical stuff': '07.20.21' }],
  },
  { title: 'Life', plans: [{ 'Life stuff': '07.20.21' }, { 'Life stuff': '07.20.21' }] },
  {
    title: 'Money',
    plans: [{ 'Medical money stuff': '07.20.21' }, { 'Money stuff': '07.20.21' }],
  },
  { title: 'Lunch', plans: [{ 'Food stuff': '07.20.21' }, { 'Soup stuff': '07.20.21' }] },
  { title: 'Over Time', plans: [{ 'Over Time stuff': '07.20.21' }] },
];

// const dependentData = [
//   {
//     name: 'John Doe',
//     gender: 'Not sure',
//     relationship: 'Married to Susan',
//     dob: '21-5-1995',
//   },
//   {
//     name: 'Mary Doe',
//     gender: 'Lesbian',
//     relationship: 'Married to John',
//     dob: '21-5-1995',
//   },
// ];

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

  render() {
    const { loading, dependentDetails: { dependents = [] } = {} } = this.props;
    const { isEditing, isAdding } = this.state;
    if (loading) return <Skeleton />;
    return (
      <div style={{ backgroundColor: '#f6f7f9' }}>
        <div className={styles.benefitTab}>
          <div className={styles.sideTab}>
            <div>
              <div className={styles.header}>
                <span className={styles.headingText}>
                  {formatMessage({ id: 'pages.employeeProfile.BenefitTab.dependentDetails' })}
                </span>
                {!isEditing && !isAdding && (
                  <div className={styles.editButton} onClick={this.setAddingOrEditing}>
                    <EditFilled />
                    {dependents.length > 0 ? (
                      <span className={styles.editText}>Edit</span>
                    ) : (
                      <span className={styles.editText}>Add new</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <DependentTabs
                  key={Math.random().toString(36).substring(7)}
                  data={dependents}
                  isEditing={isEditing}
                  setEditing={this.setEditing}
                  isAdding={isAdding}
                  setAdding={this.setAdding}
                />
              </div>
            </div>
          </div>
          <div className={styles.sideTab}>
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
          </div>

          <div className={styles.sideTab}>
            <h3 className={styles.headings}>
              {formatMessage({ id: 'pages.employeeProfile.BenefitTab.optedPlans' })}
            </h3>
            <div className={styles.content}>
              {data.map((item) => {
                return <GroupInfoType2 key={Math.random().toString(36).substring(7)} data={item} />;
              })}
            </div>
          </div>
          <div className={styles.sideTab}>
            <Collapse
              accordion
              bordered={false}
              expandIcon={({ isActive }) =>
                isActive ? (
                  // <img src={MinusIcon} alt="collapse" />
                  <MinusOutlined className={styles.minusIcon} />
                ) : (
                  <img src={AddIcon} alt="expand" />
                )
              }
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
          </div>
        </div>
      </div>
    );
  }
}
export default BenefitTab;
