import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import TableEmployees from '../TableEmployees';
import TabFilter from '../TabFilter';
import styles from './index.less';

@connect(({ loading, employee }) => ({
  loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
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
      changeTab: false,
      collapsed: true,
      tabId: 1,
      department: [],
      location: [],
      employeeType: [],
      filterName: '',
      tabs: [
        { id: 1, name: formatMessage({ id: 'pages_admin.employees.table.activeEmployeesTab' }) },
        { id: 2, name: formatMessage({ id: 'pages_admin.employees.table.inactiveEmployeesTab' }) },
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

  renderListEmployees = (tabId) => {
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
        <NavLink to="/#" className={styles.buttonAddImport}>
          <img src="/assets/images/addMemberIcon.svg" alt="Import Employee" />
          <p className={styles.buttonAddImport_text}>
            {formatMessage({ id: 'pages_admin.employees.table.importEmployee' })}
          </p>
        </NavLink>
        <NavLink to="/#" className={styles.buttonAddImport}>
          <img src="/assets/images/addMemberIcon.svg" alt="Add Employee" />
          <p className={styles.buttonAddImport_text}>
            {formatMessage({ id: 'pages_admin.employees.table.addEmployee' })}
          </p>
        </NavLink>
        <div className={styles.filterSider} onClick={this.handleToggle}>
          <div
            className={`${styles.filterButton} ${
              collapsed ? '' : `${styles.filterBackgroundButton}`
            }`}
          >
            <img src="/assets/images/iconFilter.svg" alt="filter" />
            <p className={styles.textButtonFilter}>Filter</p>
          </div>
        </div>
      </div>
    );
  };

  handleChange = (valueInput) => {
    this.setDebounce(valueInput);
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { tabs, collapsed, changeTab } = this.state;
    const { loadingListActive, loadingListInActive } = this.props;

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableContent}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton(collapsed)}
          >
            {tabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.managementLayout}>
                  <Content className="site-layout-background">
                    <TableEmployees
                      loading={loadingListActive || loadingListInActive}
                      data={this.renderListEmployees(tab.id)}
                    />
                  </Content>
                  <TabFilter
                    onToggle={this.handleToggle}
                    collapsed={collapsed}
                    FormBox={this.handleFormBox}
                    onHandleChange={this.handleChange}
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

export default TableContainer;
