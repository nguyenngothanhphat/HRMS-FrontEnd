import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
// import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
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

const dependentData = [
  {
    name: 'John Doe',
    gender: 'Not sure',
    relationship: 'Married to Susan',
    dob: '05.21.95',
  },
  {
    name: 'Mary Doe',
    gender: 'Lesbian',
    relationship: 'Married to John',
    dob: '05.21.95',
  },
];

export default class BenefitTab extends PureComponent {
  render() {
    return (
      <div style={{ backgroundColor: '#f6f7f9' }}>
        <div className={styles.benefitTab}>
          <div className={styles.sideTab}>
            {Math.floor(Math.random() * 10) > 5 ? (
              <div>
                <h3 className={styles.headings}>
                  {formatMessage({ id: 'pages.employeeProfile.BenefitTab.dependentDetails' })}
                </h3>
                <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  {dependentData.map((item, idx) => {
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
            ) : (
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
            )}
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
                  // <MinusOutlined style={{ color: '#2c6df9', fontSize: '30px' }} />
                  <img src={PlusIcon} alt="expand" />
                  // <PlusOutlined style={{ color: '#2c6df9', fontSize: '30px' }} />
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
