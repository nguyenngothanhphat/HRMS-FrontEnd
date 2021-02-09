import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import { formatMessage, connect } from 'umi';
import { EditFilled } from '@ant-design/icons';
import PlusIcon from '@/assets/plusIcon1.svg';
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

@connect(({ employeeProfile: { originData: { dependentDetails, benefitPlans } }, loading }) => ({
  dependentDetails,
  benefitPlans,
  loading:
    loading.effects['employeeProfile/fetchEmployeeDependentDetails'] ||
    loading.effects['employeeProfile/getBenefitPlans'],
}))
class BenefitTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  setEditing = (value) => {
    this.setState({
      isEditing: value,
    });
  };

  render() {
    const { loading, dependentDetails } = this.props;
    const { isEditing } = this.state;
    if (loading) return <div>Loading...</div>;
    return (
      <div style={{ backgroundColor: '#f6f7f9' }}>
        <div className={styles.benefitTab}>
          <div className={styles.sideTab}>
            <div>
              <div className={styles.header}>
                <span className={styles.headingText}>
                  {formatMessage({ id: 'pages.employeeProfile.BenefitTab.dependentDetails' })}
                </span>
                {!isEditing && (
                  <div className={styles.editButton} onClick={() => this.setEditing(true)}>
                    <EditFilled />
                    <span className={styles.editText}>Edit</span>
                  </div>
                )}
              </div>
              <div>
                {dependentDetails.length === 0 ? (
                  <div style={{ marginBottom: '10px' }}>No data</div>
                ) : (
                  <>
                    <DependentTabs
                      key={Math.random().toString(36).substring(7)}
                      data={dependentDetails}
                      isEditing={isEditing}
                      setEditing={this.setEditing}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.sideTab}>
            <div>
              <h3 className={styles.headings}>
                {formatMessage({ id: 'pages.employeeProfile.BenefitTab.kycDetails' })}
              </h3>
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
                  <img src={MinusIcon} alt="collapse" />
                ) : (
                  <img src={PlusIcon} alt="expand" />
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
          </div>
        </div>
      </div>
    );
  }
}
export default BenefitTab;
