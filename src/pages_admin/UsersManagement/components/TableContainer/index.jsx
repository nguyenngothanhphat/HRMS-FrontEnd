import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import Icon, { FilterOutlined } from '@ant-design/icons';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import TableUsers from '../TableUsers';
import addUser from './icon.js';
import styles from './index.less';
import TableFilter from '../TableFilter';

const data = [
  {
    key: '1',
    userId: '8097',
    employeeId: 'PSI 2090',
    joinedDate: 'Aug-7,2020',
    email: 'aaaamatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '2',
    userId: '1231',
    employeeId: 'PSI 2011',
    joinedDate: 'Aug-8,2020',
    email: 'sdasmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '3',
    userId: '4423',
    employeeId: 'PSI 2089',
    joinedDate: 'Aug-25,2020',
    email: 'dssmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '4',
    userId: '4324',
    employeeId: 'PSI 2077',
    joinedDate: 'Jan-7,2020',
    email: 'uuyer@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '5',
    userId: '6456',
    employeeId: 'PSI 2454',
    joinedDate: 'Aug-7,2020',
    email: 'tuasdna@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '6',
    userId: '1235',
    employeeId: 'PSI 1245',
    joinedDate: 'Aug-7,2020',
    email: 'hahahahh@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '7',
    userId: '3453',
    employeeId: 'PSI 4565',
    joinedDate: 'Aug-7,2020',
    email: 'test1@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '8',
    userId: '4444',
    employeeId: 'PSI 4564',
    joinedDate: 'Aug-7,2020',
    email: 'billgates@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '9',
    userId: '5435',
    employeeId: 'PSI 1111',
    joinedDate: 'Aug-7,2020',
    email: 'mark@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '10',
    userId: '2363',
    employeeId: 'PSI 1235',
    joinedDate: 'Aug-7,2020',
    email: 'alibaba@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '11',
    userId: '9785',
    employeeId: 'PSI 7895',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '12',
    userId: '3454',
    employeeId: 'PSI 1112',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '13',
    userId: '7645',
    employeeId: 'PSI 3232',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
];

@connect(({ loading, employee }) => ({
  loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
  loadingListMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
  loadingListInActive: loading.effects['employee/fetchListEmployeeInActive'],
  employee,
}))
class TableContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('employee' in nextProps) {
      const { employee: { filter = [] } = {} } = nextProps;
      let employeeType = [];
      let department = [];
      let location = [];
      const employeeTypeConst = 'Employment Type';
      const departmentConst = 'Department';
      const locationConst = 'Location';
      filter.map((item) => {
        if (item.actionFilter.name === employeeTypeConst) {
          employeeType = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === departmentConst) {
          department = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === locationConst) {
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
      collapsed: true,
      pageSelected: 1,
      bottabs: [
        { id: 1, name: formatMessage({ id: 'pages_admin.users.userTable.activeUsersTab' }) },
        { id: 2, name: formatMessage({ id: 'pages_admin.users.userTable.inactiveUsersTab' }) },
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
        type: 'employee/fetchListEmployeeInActive',
        payload: params,
      });
    }
  };

  renderListEmployee = (tabId) => {
    const {
      employee: { listEmployeeActive = [], listEmployeeInActive = [] },
    } = this.props;
    if (tabId === 1) {
      return listEmployeeActive;
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

  rightButton = (collapsed) => {
    return (
      <div className={styles.tabBarExtra}>
        <NavLink to="/#" className={styles.buttonAddUser}>
          <Icon component={addUser} />
          <p className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages_admin.users.userTable.addUser' })}
          </p>
        </NavLink>
        <div className={styles.filterSider} onClick={this.handleToggle}>
          <div
            className={`${styles.filterButton} ${
              collapsed ? '' : `${styles.filterBackgroundButton}`
            }`}
          >
            <FilterOutlined />
            <p className={styles.textButtonFilter}>Filter</p>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs, collapsed, changeTab } = this.state;

    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.contentContainer}>
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton(collapsed)}
          >
            {bottabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.directoryLayout_inner}>
                  <Content className="site-layout-background">
                    <TableUsers data={data} />
                  </Content>
                  <TableFilter
                    onToggle={this.handleToggle}
                    collapsed={collapsed}
                    onHandleChange={this.handleChange}
                    FormBox={this.handleFormBox}
                    changeTab={changeTab}
                  />
                </Layout>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
