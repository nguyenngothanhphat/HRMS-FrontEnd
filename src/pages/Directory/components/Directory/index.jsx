import React, { PureComponent } from 'react';
import { connect, NavLink } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Tabs, Layout } from 'antd';
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
      collapsed: false,
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('filter' in nextProps) {
      return { currency: nextProps.currency };
    }
    return null;
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

  handleToggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  // handleChange = (valueInput) => {
  //   const newFilter = employeesState.filter((value) =>
  //     value.generalInfo.fullName.toLowerCase().includes(valueInput.toLowerCase()),
  //   );
  //   this.setState({ filter: newFilter });
  // };

  renderListEmployee = (tabId) => {
    const {
      employee: { listEmployeeActive = [], listEmployeeMyTeam = [], listEmployeeInActive = [] },
    } = this.props;
    if (tabId === 1) {
      return listEmployeeActive;
    }
    if (tabId === 2) {
      return listEmployeeMyTeam;
    }
    return listEmployeeInActive;
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs, collapsed } = this.state;

    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.boxCreate}>
          <NavLink to="/directory" className={styles.buttonCreate}>
            <PlusOutlined />
            <p className={styles.NameNewProfile}>Set Up New Profile</p>
          </NavLink>
          <div className={styles.Text}>
            <p className={styles.ViewText}>View Activity log </p>
            <span className={styles.ViewNumber}>(15)</span>
          </div>
        </div>
        <Tabs defaultActiveKey="1" className={styles.Tab}>
          <TableFilter
            onToggle={this.handleToggle}
            collapsed={collapsed}
            onHandleChange={this.handleChange}
            FormBox={this.handleFormBox}
          />
          {bottabs.map((tab) => (
            <TabPane tab={tab.name} key={tab.id}>
              <Layout>
                {collapsed ? <div className={styles.openSider} onClick={this.handleToggle} /> : ''}
                <Content
                  className="site-layout-background"
                  style={{
                    maxHeight: 702,
                    backgroundColor: '#f7f7f7',
                  }}
                >
                  <DirectotyTable list={this.renderListEmployee(tab.id)} />
                  {/* <DirectotyTable list={employeesState} /> */}
                </Content>
              </Layout>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
