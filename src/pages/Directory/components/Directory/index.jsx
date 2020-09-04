import React, { PureComponent } from 'react';
import { NavLink } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import styles from './index.less';
import TableFilter from '../TableFilter';

class DirectoryComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
  }

  render() {
    const { TabPane } = Tabs;
    const { bottabs } = this.state;
    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.boxCreate}>
          <NavLink to="/directory" className={styles.buttonCreate}>
            <PlusOutlined />
            <p className={styles.NameNewProfile}>Create New Profile</p>
          </NavLink>
          <div className={styles.Text}>
            <p className={styles.ViewText}>View Activity log </p>
            <span className={styles.ViewNumber}>(15)</span>
          </div>
        </div>
        <Tabs defaultActiveKey="1" className={styles.Tab}>
          {bottabs.map((tab) => (
            <TabPane tab={tab.name} key={tab.id} />
          ))}
        </Tabs>
        <TableFilter />
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
