import React, { PureComponent } from 'react';
import { connect, NavLink } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import DirectotyTable from '@/components/DirectotyTable';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(({ loading, employee }) => ({
  loading: loading.effects['login/login'],
  employee,
}))
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchListEmployeeActive',
    });
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
    });
    dispatch({
      type: 'employee/fetchListEmployeeInActive',
    });
  }

  renderDirectoryTable = () => {};

  render() {
    const { TabPane } = Tabs;
    const { bottabs } = this.state;
    const {
      employee: { listEmployeeActive = [] },
    } = this.props;
    // console.log('listEmployeeActive', listEmployeeActive);
    // console.log('listEmployeeMyTeam', listEmployeeMyTeam);
    // console.log('listEmployeeInActive', listEmployeeInActive);
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
            <TabPane tab={tab.name} key={tab.id}>
              <DirectotyTable list={listEmployeeActive} />
            </TabPane>
          ))}
        </Tabs>
        <TableFilter />
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
