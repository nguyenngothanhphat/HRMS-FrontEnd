import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Link, NavLink } from 'umi';
import styles from './index.less';
import TopTabs from './TopTabs';
import BotTab from './BotTabs';
import { PlusOutlined } from '@ant-design/icons';
import TableFilter from './TableFilter';

export default class Directory extends Component {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Link to="/directory/employee-profile/0001">Link to profile employee 0001</Link>
          <TopTabs />
          <div className={styles.boxCreate}>
            <NavLink to="/directory" className={styles.buttonCreate}>
              <PlusOutlined />
              <p>Create New Profile</p>
            </NavLink>
            <div className={styles.Text}>
              <p>View Activity log </p>
              <span>(15)</span>
            </div>
          </div>
          <BotTab />
          <TableFilter />
        </div>
      </PageContainer>
    );
  }
}
