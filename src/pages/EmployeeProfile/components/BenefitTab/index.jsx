import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import styles from './styles.less';

const { Sider, Content } = Layout;

export default class BenefitTab extends PureComponent {
  render() {
    return (
      <Layout className={styles.BenefitTab}>
        <Sider breakpoint="md" collapsedWidth="0" width={606} className={styles.SideTab}>
          <h3 className={styles.Headings}>Employee Dependent Details</h3>
          <div>
            {[1, 2].map((item) => {
              return <div className={styles.Tab}>Hello Sidebar number {item}</div>;
            })}
          </div>
        </Sider>
        <Content>Content</Content>
      </Layout>
    );
  }
}

BenefitTab.propTypes = {};
