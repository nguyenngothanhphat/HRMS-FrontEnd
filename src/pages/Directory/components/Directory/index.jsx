import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import DirectoryTable from '@/components/DirectoryTable';
import { debounce } from 'lodash';
import AddEmployeeForm from '@/pages_admin/EmployeesManagement/components/TableContainer/components/AddEmployeeForm';
import ModalImportEmployee from '@/pages_admin/EmployeesManagement/components/TableContainer/components/ModalImportEmployee';
import styles from './index.less';
import TableFilter from '../TableFilter';

const { Content } = Layout;
const { TabPane } = Tabs;
@connect(({ loading, employee, user: { currentUser = {} } }) => ({
  loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
  loadingListMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
  loadingListInActive: loading.effects['employee/fetchListEmployeeInActive'],
  employee,
  currentUser,
}))
class DirectoryComponent extends PureComponent {
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
      collapsed: false,
      pageSelected: 1,
      bottabs: [],
      visible: false,
      visibleImportEmployee: false,
      roles: {
        HR: 'HR',
      },
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        filterName: query,
      });
    }, 500);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    const { roles = [] } = currentUser;
    if (this.checkRole(roles)) {
      this.setState({
        tabId: 1,
        bottabs: [
          { id: 1, name: formatMessage({ id: 'pages.directory.directory.activeEmployeesTab' }) },
          { id: 2, name: formatMessage({ id: 'pages.directory.directory.myTeamTab' }) },
          { id: 3, name: formatMessage({ id: 'pages.directory.directory.inactiveEmployeesTab' }) },
        ],
      });
    } else {
      this.setState({
        tabId: 2,
        bottabs: [{ id: 2, name: formatMessage({ id: 'pages.directory.directory.myTeamTab' }) }],
      });
    }
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

  componentWillUnmount() {
    this.setState({
      tabId: 1,
    });
  }

  initDataTable = () => {
    const { dispatch, currentUser } = this.props;
    const { company } = currentUser;
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
      payload: {
        company: company._id,
      },
    });
    dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        company: company._id,
      },
    });
    dispatch({
      type: 'employee/fetchListEmployeeInActive',
      payload: {
        company: company._id,
      },
    });
    dispatch({
      type: 'employeesManagement/fetchRolesList',
    });
    dispatch({
      type: 'employeesManagement/fetchCompanyList',
    });
  };

  getDataTable = (params, tabId) => {
    const { dispatch, currentUser } = this.props;
    const { company } = currentUser;
    const { name, department, location, employeeType } = params;
    const payload = {
      company: company._id,
      name,
      department,
      location,
      employeeType,
    };
    if (tabId === 1) {
      dispatch({
        type: 'employee/fetchListEmployeeActive',
        payload,
      });
    }
    if (tabId === 2) {
      dispatch({
        type: 'employee/fetchListEmployeeMyTeam',
        payload,
      });
    }
    if (tabId === 3) {
      dispatch({
        type: 'employee/fetchListEmployeeInActive',
        payload,
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

  importEmployees = () => {
    this.openFormImportEmployees();
  };

  openFormImportEmployees = () => {
    this.setState({
      visibleImportEmployee: true,
    });
  };

  addEmployee = () => {
    this.openFormAddEmployee();
  };

  openFormAddEmployee = () => {
    this.setState({
      visible: true,
    });
  };

  checkRole = (roles) => {
    let flag = false;
    const { roles: rolesConst } = this.state;
    const checkRoleHR = (obj) => obj._id === rolesConst.HR;
    // const checkRoleHRManager = (obj) => obj._id === rolesConst.HR_MANAGER;
    if (roles.some(checkRoleHR)) {
      flag = true;
    }
    return flag;
  };

  rightButton = (collapsed) => {
    const { currentUser } = this.props;
    const { roles = [] } = currentUser;
    return (
      <div className={styles.tabBarExtra}>
        {this.checkRole(roles) ? (
          <>
            {' '}
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
          </>
        ) : (
          ''
        )}
        <div className={styles.filterSider} onClick={this.handleToggle}>
          {collapsed ? (
            <div className={styles.filterBackgroundButton_isCollapsed} />
          ) : (
            <div className={styles.filterBackgroundButton} />
          )}
          <div className={styles.filterButton}>
            <img src="/assets/images/iconFilter.svg" alt="filter" />
            <p className={styles.textButtonFilter}>Filter</p>
          </div>
        </div>
      </div>
    );
  };

  renderTabPane = () => {
    const { bottabs, collapsed, changeTab } = this.state;
    const { loadingListActive, loadingListMyTeam, loadingListInActive } = this.props;
    return bottabs.map((tab) => (
      <TabPane tab={tab.name} key={tab.id}>
        <Layout className={styles.directoryLayout_inner}>
          <Content className="site-layout-background">
            <DirectoryTable
              loading={loadingListActive || loadingListMyTeam || loadingListInActive}
              list={this.renderListEmployee(tab.id)}
            />
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
    ));
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      visibleImportEmployee: false,
    });
    this.initDataTable();
  };

  render() {
    const { currentUser } = this.props;
    const { company } = currentUser;
    const { collapsed, visible, visibleImportEmployee } = this.state;

    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.contentContainer}>
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton(collapsed)}
          >
            {this.renderTabPane()}
          </Tabs>
        </div>
        <AddEmployeeForm
          company={company}
          titleModal="Add Employee"
          visible={visible}
          handleCancel={this.handleCancel}
          getResponse={this.getResponse}
        />
        <ModalImportEmployee
          company={company}
          titleModal="Import Employee"
          visible={visibleImportEmployee}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
