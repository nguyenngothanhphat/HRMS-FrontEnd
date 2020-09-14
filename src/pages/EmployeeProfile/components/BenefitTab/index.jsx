import React, { PureComponent } from 'react';
import { Layout, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './styles.less';
import GroupInfoType2 from '../../../../components/GroupInfoType2';
import DependentTabs from './components/DependentTabs';
import KYC from './components/KYC';

const { Sider, Content } = Layout;
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

const dependentData = [
  {
    name: 'John Doe',
    gender: 'Not sure',
    relationship: 'Single but open for opportunities',
    dob: '21-5-1995',
  },
  {
    name: 'Mary Doe',
    gender: 'Lesbian',
    relationship: 'Married to John',
    dob: '21-5-1995',
  },
];

export default class BenefitTab extends PureComponent {
  render() {
    return (
      <Layout className={styles.benefitTab}>
        <Sider breakpoint="md" collapsedWidth="0" width={606} className={styles.sideTab}>
          {Math.floor(Math.random() * 10) > 5 ? (
            <div>
              <h3 className={styles.headings}>
                {formatMessage({ id: 'pages.employeeProfile.BenefitTab.dependentDetails' })}
              </h3>
              <div>
                {dependentData.map((item, idx) => {
                  return <DependentTabs index={idx} data={item} />;
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
        </Sider>
        <Content
          style={{
            paddingLeft: '24px',
            width: '988px',
          }}
        >
          <h3 className={styles.headings}>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.optedPlans' })}
          </h3>
          <div className={styles.content}>
            {data.map((item) => {
              return <GroupInfoType2 data={item} />;
            })}
          </div>

          <Collapse
            accordion
            bordered={false}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
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
                    return <GroupInfoType2 data={item} />;
                  })}
                </div>
              </div>
              <div>
                <h1 className={styles.subHeadings}>
                  {formatMessage({ id: 'pages.employeeProfile.BenefitTab.forIndianEmployees' })}
                </h1>
                <div className={styles.content}>
                  {data.map((item) => {
                    return <GroupInfoType2 data={item} />;
                  })}
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        </Content>
      </Layout>
    );
  }
}
