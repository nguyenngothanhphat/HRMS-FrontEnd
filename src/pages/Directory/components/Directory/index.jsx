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
      tabList: {
        active: 'active',
        myTeam: 'myTeam',
        inActive: 'inActive',
      },
      tabId: 'active',
      changeTab: false,
      collapsed: false,
      pageSelected: 1,
      bottabs: [],
      visible: false,
      visibleImportEmployee: false,
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        filterName: query,
      });
    }, 500);
  }

  componentDidMount() {
    this.initDataTable();
    this.initTabId();
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
    this.setState = () => {
      return { tabId: 'active', changeTab: false };
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/ClearFilter',
    });
  }

  // Define tabID to filter
  initTabId = () => {
    const {
      currentUser: { roles = [] },
    } = this.props;
    const tabActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW';
    // const tabMyTeam = 'P_DIRECTORY_T_DIRECTORY_T_MY_TEAM_VIEW';
    const tabInActive = 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_VIEW';

    const groupPermissions = this.generatePermissions(roles);

    const findIndexActive = groupPermissions.indexOf(tabActive);
    // const findIndexMyTeam = groupPermissions.indexOf(tabMyTeam);
    const findIndexInActive = groupPermissions.indexOf(tabInActive);

    let tabId = 'active';

    if (findIndexActive === -1) {
      tabId = 'inActive';
    }

    // Set tabId for myTeam to hide button Filter
    if (findIndexActive === -1 && findIndexInActive === -1) {
      tabId = 'myTeam';
    }

    this.setState({
      tabId,
    });
  };

  renderHrGloBal = () => {
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

  renderHrTeam = () => {
    const { dispatch, currentUser } = this.props;
    const { company, location } = currentUser;
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
      payload: {
        company: company._id,
        location: [location._id],
      },
    });
    dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        company: company._id,
        location: [location._id],
      },
    });
    dispatch({
      type: 'employee/fetchListEmployeeInActive',
      payload: {
        company: company._id,
        location: [location._id],
      },
    });
    dispatch({
      type: 'employeesManagement/fetchRolesList',
    });
    dispatch({
      type: 'employeesManagement/fetchCompanyList',
    });
  };

  initDataTable = () => {
    const { currentUser } = this.props;
    const { roles } = currentUser;
    const filterRoles = roles.filter((item) => item._id === 'HR-GLOBAL');
    if (filterRoles.length > 0) {
      return this.renderHrGloBal();
    }
    return this.renderHrTeam();
  };

  generatePermissions = (roles) => {
    let groupPermissions = [];

    roles.map((role) => {
      const { permissions = [] } = role;
      groupPermissions = [...groupPermissions, ...permissions];
      return null;
    });

    // Remove duplicates
    const permissionsUnique = groupPermissions.filter((v, i, a) => a.indexOf(v) === i);

    return permissionsUnique;
  };

  ChangeTabHrGloBal = (params, tabId) => {
    const {
      tabList: { active, myTeam, inActive },
    } = this.state;
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
    if (tabId === active) {
      dispatch({
        type: 'employee/fetchListEmployeeActive',
        payload,
      });
    }
    if (tabId === myTeam) {
      dispatch({
        type: 'employee/fetchListEmployeeMyTeam',
        payload,
      });
    }
    if (tabId === inActive) {
      dispatch({
        type: 'employee/fetchListEmployeeInActive',
        payload,
      });
    }
  };

  ChangeTabHrTeam = (params, tabId) => {
    const {
      tabList: { active, myTeam, inActive },
    } = this.state;
    const { dispatch, currentUser } = this.props;
    const { company, location } = currentUser;
    const { name, department, employeeType } = params;
    const payload = {
      company: company._id,
      name,
      department,
      location: [location._id],
      employeeType,
    };
    if (tabId === active) {
      dispatch({
        type: 'employee/fetchListEmployeeActive',
        payload,
      });
    }
    if (tabId === myTeam) {
      dispatch({
        type: 'employee/fetchListEmployeeMyTeam',
        payload,
      });
    }
    if (tabId === inActive) {
      dispatch({
        type: 'employee/fetchListEmployeeInActive',
        payload,
      });
    }
  };

  getDataTable = (params, tabId) => {
    const { currentUser } = this.props;
    const { roles } = currentUser;
    const filterRoles = roles.filter((item) => item._id === 'HR-GLOBAL');
    if (filterRoles.length > 0) {
      return this.ChangeTabHrGloBal(params, tabId);
    }
    return this.ChangeTabHrTeam(params, tabId);
  };

  renderListEmployee = (tabId) => {
    const {
      employee: { listEmployeeActive = [], listEmployeeMyTeam = [], listEmployeeInActive = [] },
    } = this.props;
    const {
      tabList: { active, myTeam },
    } = this.state;
    if (tabId === active) {
      return listEmployeeActive;
    }
    if (tabId === myTeam) {
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
      tabId,
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

  rightButton = (roles, collapsed) => {
    const { tabId } = this.state;
    const permissionImport = 'P_DIRECTORY_T_DIRECTORY_B_IMPORT_EMPLOYEES_VIEW';
    const permissionAdd = 'P_DIRECTORY_T_DIRECTORY_B_ADD_EMPLOYEE_VIEW';

    const groupPermissions = this.generatePermissions(roles);

    const findIndexImport = groupPermissions.indexOf(permissionImport);
    const findIndexAdd = groupPermissions.indexOf(permissionAdd);

    return (
      <div className={styles.tabBarExtra}>
        {findIndexImport !== -1 && (
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
        )}

        {findIndexAdd !== -1 && (
          <div className={styles.buttonAddImport} onClick={this.addEmployee}>
            <img src="/assets/images/addMemberIcon.svg" alt="Add Employee" />
            <p className={styles.buttonAddImport_text}>
              {formatMessage({ id: 'pages_admin.employees.table.addEmployee' })}
            </p>
          </div>
        )}

        {this.renderButtonFilter(tabId, collapsed)}
      </div>
    );
  };

  renderButtonFilter = (tabId, collapsed) => {
    const { checkRoleEmployee } = this.props;
    const {
      tabList: { myTeam },
    } = this.state;
    if (!checkRoleEmployee && tabId !== myTeam) {
      return (
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
      );
    }
    return null;
  };

  renderTabPane = () => {
    const {
      tabList: { active, myTeam, inActive },
    } = this.state;
    const {
      loadingListActive,
      loadingListMyTeam,
      loadingListInActive,
      checkRoleEmployee,
      currentUser: { roles = [] },
    } = this.props;

    const tabActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW';
    const tabMyTeam = 'P_DIRECTORY_T_DIRECTORY_T_MY_TEAM_VIEW';
    const tabInActive = 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_VIEW';
    const showLocationActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW';
    const showLocationInActive =
      'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW';

    const groupPermissions = this.generatePermissions(roles);

    const findIndexActive = groupPermissions.indexOf(tabActive);
    const findIndexMyTeam = groupPermissions.indexOf(tabMyTeam);
    const findIndexInActive = groupPermissions.indexOf(tabInActive);
    const findIndexShowLocationActive = groupPermissions.indexOf(showLocationActive);
    const findIndexShowLocationInActive = groupPermissions.indexOf(showLocationInActive);

    return (
      <>
        {findIndexActive !== -1 &&
          this.renderTab(
            formatMessage({ id: 'pages.directory.directory.activeEmployeesTab' }),
            active,
            loadingListActive,
            findIndexShowLocationActive,
          )}
        {findIndexMyTeam !== -1 &&
          !checkRoleEmployee &&
          this.renderTab(
            formatMessage({ id: 'pages.directory.directory.myTeamTab' }),
            myTeam,
            loadingListMyTeam,
          )}
        {findIndexMyTeam !== -1 && checkRoleEmployee && (
          <>
            {this.renderTab(
              formatMessage({ id: 'pages.directory.directory.myTeamTab' }),
              myTeam,
              loadingListMyTeam,
            )}
          </>
        )}
        {findIndexInActive !== -1 &&
          this.renderTab(
            formatMessage({ id: 'pages.directory.directory.inactiveEmployeesTab' }),
            inActive,
            loadingListInActive,
            findIndexShowLocationInActive,
          )}
      </>
    );
  };

  renderTab = (tabName, key, loading, indexShowLocation) => {
    const { checkRoleEmployee } = this.props;
    const {
      tabId,
      collapsed,
      changeTab,
      tabList: { myTeam },
    } = this.state;
    return (
      <TabPane tab={tabName} key={key}>
        <Layout className={styles.directoryLayout_inner}>
          <Content className="site-layout-background">
            <DirectoryTable
              checkRoleEmployee={checkRoleEmployee}
              loading={loading}
              list={this.renderListEmployee(key)}
            />
          </Content>
          {key !== myTeam && (
            <TableFilter
              onToggle={this.handleToggle}
              collapsed={collapsed}
              onHandleChange={this.handleChange}
              FormBox={this.handleFormBox}
              changeTab={changeTab}
              tabName={tabId}
              checkLocation={indexShowLocation}
            />
          )}
        </Layout>
      </TabPane>
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      visibleImportEmployee: false,
    });
    this.initDataTable();
  };

  render() {
    const {
      currentUser: { company, roles = [] },
    } = this.props;
    const { collapsed, visible, visibleImportEmployee } = this.state;

    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.contentContainer}>
          <Tabs
            // defaultActiveKey="active"
            className={styles.TabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton(roles, collapsed)}
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
          titleModal="Import Employees"
          visible={visibleImportEmployee}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
