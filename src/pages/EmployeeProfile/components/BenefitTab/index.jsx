import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import styles from './styles.less';
import GroupInfoType2 from '../../../../components/GroupInfoType2';

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

export default class BenefitTab extends PureComponent {
  render() {
    return (
      <Layout className={styles.benefitTab}>
        <Sider breakpoint="md" collapsedWidth="0" width={606} className={styles.sideTab}>
          <h3 className={styles.headings}>Employee Dependent Details</h3>
          <div>
            {[1, 2].map((item) => {
              return <div className={styles.tab}>Hello Sidebar number {item}</div>;
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
