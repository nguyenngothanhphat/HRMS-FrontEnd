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
      employee: props.employee,
      collapsed: false,
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ('employee' in nextProps) {
      const { employee } = nextProps;
      const { filter } = employee;
      let employmentType = [];
      let department = [];
      let location = [];
      filter.map((item) => {
        if (item.actionFilter.name === 'Employment Type') {
          employmentType = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === 'Department') {
          department = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === 'Location') {
          location = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { employmentType, department, location };
      });
      console.log('nextProps', nextProps);
      console.log('employmentType', employmentType);
      console.log('department', department);
      console.log('location', location);
      if (nextProps.employee === prevState.employee) {
        console.log('nextProps.employee', nextProps.employee);
        console.log('prevState.employee', prevState.employee);
        // const { dispatch } = nextProps;
        // const params = {
        //   department, location
        // }
        // dispatch({
        //   type: 'employee/fetchListEmployeeActive',
        //   payload: params
        // });
      }
      // const { dispatch } = nextProps;
      // const params = {
      //   department, location
      // }
      // dispatch({
      //   type: 'employee/fetchListEmployeeActive',
      //   payload: params
      // });
      // dispatch({
      //   type: 'employee/fetchListEmployeeMyTeam',
      //   payload: params
      // });
      // dispatch({
      //   type: 'employee/fetchListEmployeeInActive',
      //   payload: params
      // });
    }
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

  handleClickTabPane = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/ClearFilter',
    });
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
        <Tabs defaultActiveKey="1" className={styles.Tab} onTabClick={this.handleClickTabPane}>
          {bottabs.map((tab) => (
            <TabPane tab={tab.name} key={tab.id}>
              <Layout>
                <TableFilter
                  onToggle={this.handleToggle}
                  collapsed={collapsed}
                  onHandleChange={this.handleChange}
                  FormBox={this.handleFormBox}
                />
                {collapsed ? <div className={styles.openSider} onClick={this.handleToggle} /> : ''}
                <Content
                  className="site-layout-background"
                  style={{
                    maxHeight: 702,
                    backgroundColor: '#f7f7f7',
                  }}
                >
                  <DirectotyTable list={this.renderListEmployee(tab.id)} />
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
