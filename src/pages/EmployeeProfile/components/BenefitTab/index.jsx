import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import { formatMessage, connect } from 'umi';
import PlusIcon from '@/assets/plusIcon1.svg';
import MinusIcon from '@/assets/minusIcon1.svg';
import styles from './styles.less';
import GroupInfoType2 from '../../../../components/GroupInfoType2';
import DependentTabs from './components/DependentTabs';
import KYC from './components/KYC';

const data = [
  {
    title: 'Medical',
    plans: [{ 'Medical stuff': '20 July 2020' }, { 'Medical stuff': '20 July 2021' }],
  },
  { title: 'Life', plans: [{ 'Life stuff': '20 July 2020' }, { 'Life stuff': '20 July 2021' }] },
  {
    title: 'Money',
    plans: [{ 'Medical money stuff': '20 July 2020' }, { 'Money stuff': '20 July 2021' }],
  },
  { title: 'Lunch', plans: [{ 'Food stuff': '20 July 2020' }, { 'Soup stuff': '20 July 2021' }] },
  { title: 'Over Time', plans: [{ 'Over Time stuff': '20 July 2020' }] },
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

@connect(({ employeeProfile: { originData: { dependentDetails } }, loading }) => ({
  dependentDetails,
  loading: loading.effects['employeeProfile/fetchEmployeeDependentDetails'],
}))
class BenefitTab extends PureComponent {
  render() {
    const { loading, dependentDetails } = this.props;
    if (loading) return <div>Loading...</div>;
    return (
      <div style={{ backgroundColor: '#f6f7f9' }}>
        <div className={styles.benefitTab}>
          <div className={styles.sideTab}>
            <div>
              <h3 className={styles.headings}>
                {formatMessage({ id: 'pages.employeeProfile.BenefitTab.dependentDetails' })}
              </h3>
              <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                {dependentDetails.map((item, idx) => {
                  return (
                    <DependentTabs
                      key={Math.random().toString(36).substring(7)}
                      index={idx}
                      data={item}
                    />
                  );
                })}
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
