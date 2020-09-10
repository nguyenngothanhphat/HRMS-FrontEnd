import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import styles from './styles.less';
import GroupInfoType2 from '../../../../components/GroupInfoType2';
import DependentTabs from './components/DependentTabs';

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
          <h3 className={styles.headings}>Employee Dependent Details</h3>
          <div>
            {dependentData.map((item, idx) => {
              return <DependentTabs index={idx} data={item} />;
            })}
          </div>
        </Sider>
        <Content
          style={{
            paddingLeft: '24px',
          }}
        >
          <h3 className={styles.headings}>Opted Benefit Plans</h3>
          <div className={styles.content}>
            {data.map((item) => {
              return <GroupInfoType2 data={item} />;
            })}
          </div>
        </Content>
      </Layout>
    );
  }
}

BenefitTab.propTypes = {};
