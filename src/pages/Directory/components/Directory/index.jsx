import React, { PureComponent } from 'react';
import { NavLink, connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Tabs, Layout } from 'antd';
import DirectotyTable from '@/components/DirectotyTable';
import { debounce } from 'lodash';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(({ loading, employee }) => ({
  loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
  loadingListMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
  loadingListInActive: loading.effects['employee/fetchListEmployeeInActive'],
  employee,
}))
class DirectoryComponent extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('employee' in nextProps) {
      const { employee } = nextProps;
      const { filter } = employee;
      console.log(filter);
      let employeeType = [];
      let department = [];
      let location = [];
      filter.map((item) => {
        if (item.actionFilter.name === 'Employment Type') {
          employeeType = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === 'Department') {
          department = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === 'Location') {
          location = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { employeeType, department, location };
      });
      return {
        ...prevState,
        department,
        location,
        employeeType,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      department: [],
      location: [],
      employeeType: [],
      filterName: '',
      tabId: 1,
      changeTab: false,
      collapsed: false,
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        filterName: query,
      });
    }, 500);
  }

  componentDidMount() {
    this.initDataTable();
  }

  componentDidUpdate(prevProps, prevState) {
    const { department, location, employeeType, filterName, tabId } = this.state;
    const params = {
      name: filterName,
      department,
      location,
      employeeType,
    };

    if (
      prevState.tabId !== tabId ||
      prevState.department.length !== department.length ||
      prevState.location.length !== location.length ||
      prevState.employeeType.length !== employeeType.length ||
      prevState.filterName !== filterName
    ) {
      this.getDataTable(params, tabId);
    }
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
    });
    dispatch({
      type: 'employee/fetchListEmployeeActive',
    });
    dispatch({
      type: 'employee/fetchListEmployeeInActive',
    });
  };

  getDataTable = (params, tabId) => {
    const { dispatch } = this.props;
    if (tabId === 1) {
      dispatch({
        type: 'employee/fetchListEmployeeActive',
        payload: params,
      });
    }
    if (tabId === 2) {
      dispatch({
        type: 'employee/fetchListEmployeeMyTeam',
        payload: params,
      });
    }
    if (tabId === 3) {
      dispatch({
        type: 'employee/fetchListEmployeeInActive',
        payload: params,
      });
    }
  };

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

  handleToggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  handleChange = (valueInput) => {
    this.setDebounce(valueInput);
  };

  handleClickTabPane = (tabId) => {
    this.setState({
      tabId: Number(tabId),
      changeTab: true,
      filterName: '',
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/ClearFilter',
    });
    setTimeout(() => {
      this.setState({
        changeTab: false,
      });
    }, 5);
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs, collapsed, changeTab } = this.state;
    const { loadingListActive, loadingListMyTeam, loadingListInActive } = this.props;

    return (
      <div className={styles.DirectoryComponent}>
        <Layout>
          <div className={styles.filterSider}>
            <NavLink to="/directory" className={styles.buttonCreate}>
              <PlusOutlined />
              <p className={styles.NameNewProfile}>Set Up New Profile</p>
            </NavLink>
            <TableFilter
              onToggle={this.handleToggle}
              collapsed={collapsed}
              onHandleChange={this.handleChange}
              FormBox={this.handleFormBox}
              changeTab={changeTab}
            />
            {collapsed ? <div className={styles.openSider} onClick={this.handleToggle} /> : ''}
          </div>

          <div className={styles.contentContainer}>
            <Tabs defaultActiveKey="1" className={styles.Tab} onTabClick={this.handleClickTabPane}>
              {bottabs.map((tab) => (
                <TabPane tab={tab.name} key={tab.id}>
                  <Content className="site-layout-background">
                    <DirectotyTable
                      loading={loadingListActive || loadingListMyTeam || loadingListInActive}
                      list={this.renderListEmployee(tab.id)}
                    />
                  </Content>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </Layout>
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
