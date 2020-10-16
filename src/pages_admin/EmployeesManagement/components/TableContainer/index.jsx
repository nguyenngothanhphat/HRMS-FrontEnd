import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import TableEmployees from '../TableEmployees';
import TabFilter from '../TabFilter';
import AddEmployeeForm from './components/AddEmployeeForm';
import styles from './index.less';

@connect(({ loading, employee, employeesManagement }) => ({
  loadingActiveList: loading.effects['employeesManagement/fetchActiveEmployeesList'],
  loadingInActiveList: loading.effects['employeesManagement/fetchInActiveEmployeesList'],
  employee,
  employeesManagement,
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
      visible: false,
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
      type: 'employeesManagement/fetchActiveEmployeesList',
    });
    dispatch({
      type: 'employeesManagement/fetchInActiveEmployeesList',
    });
    dispatch({
      type: 'employeesManagement/fetchCompanyList',
    });
    dispatch({
      type: 'employeesManagement/fetchLocationList',
    });
    dispatch({
      type: 'employeesManagement/fetchDepartmentList',
    });
    dispatch({
      type: 'employeesManagement/fetchJobTitleList',
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
      employeesManagement: { activeEmployeesList = [], inActiveEmployeesList = [] },
    } = this.props;
    if (tabId === 1) {
      return activeEmployeesList;
    }
    return inActiveEmployeesList;
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
        <div className={styles.buttonAddImport} onClick={this.importEmployees}>
          <img
            className={styles.buttonAddImport_imgImport}
            src="/assets/images/import.svg"
            alt="Import Employee"
          />
          <p className={styles.buttonAddImport_text}>
            {formatMessage({ id: 'pages_admin.employees.table.importEmployees' })}
          </p>
        </div>
        <div className={styles.buttonAddImport} onClick={this.addEmployee}>
          <img src="/assets/images/addMemberIcon.svg" alt="Add Employee" />
          <p className={styles.buttonAddImport_text}>
            {formatMessage({ id: 'pages_admin.employees.table.addEmployee' })}
          </p>
        </div>
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

  importEmployees = () => {
    alert('Import Employee');
  };

  addEmployee = () => {
    this.openFormAddEmployee();
  };

  openFormAddEmployee = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (valueInput) => {
    this.setDebounce(valueInput);
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { tabs, collapsed, changeTab, visible } = this.state;
    const { loadingActiveList, loadingInActiveList } = this.props;

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
                      loading={loadingActiveList || loadingInActiveList}
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
          <AddEmployeeForm
            titleModal="Add Employee"
            visible={visible}
            handleCancel={this.handleCancel}
            getResponse={this.getResponse}
          />
        </div>
      </div>
    );
  }
}

export default TableContainer;
