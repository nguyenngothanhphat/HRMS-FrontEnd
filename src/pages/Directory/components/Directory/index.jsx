import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import { Tabs, Layout, Skeleton } from 'antd';
import DirectoryTable from '@/components/DirectoryTable';
import { getCurrentCompany, getCurrentLocation, isOwner } from '@/utils/authority';

import { debounce } from 'lodash';
import AddEmployeeForm from '@/pages_admin/EmployeesManagement/components/TableContainer/components/AddEmployeeForm';
import ModalImportEmployee from '@/pages_admin/EmployeesManagement/components/TableContainer/components/ModalImportEmployee';
import exportToCsv from '@/utils/exportToCsv';
import iconDownload from '@/assets/download-icon-yellow.svg';
import styles from './index.less';
import TableFilter from '../TableFilter';

const { Content } = Layout;
const { TabPane } = Tabs;
@connect(
  ({
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    employee,
    user: { currentUser = {}, permissions = {}, companiesOfUser = [] },
    employee: { filterList = {} } = {},
  }) => ({
    loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
    loadingListMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
    loadingListInActive: loading.effects['employee/fetchListEmployeeInActive'],
    loadingCompaniesOfUser: loading.effects['user/fetchCompanyOfUser'],
    loadingFetchLocations:
      loading.effects['locationSelection/fetchLocationsByCompany'] ||
      loading.effects['locationSelection/fetchLocationListByParentCompany'],
    employee,
    currentUser,
    permissions,
    listLocationsByCompany,
    companiesOfUser,
    filterList,
  }),
)
class DirectoryComponent extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('employee' in nextProps) {
      const { employee: { filter = [] } = {} } = nextProps;
      let employeeType = [];
      let department = [];
      let country = [];
      let state = [];
      let company = [];
      const employeeTypeConst = 'Employment Type';
      const departmentConst = 'Department';
      const countryConst = 'Country';
      const stateConst = 'State';
      const companyConst = 'Company';
      filter.map((item) => {
        if (item.actionFilter.name === employeeTypeConst) {
          employeeType = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === departmentConst) {
          department = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === countryConst) {
          country = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === stateConst) {
          state = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === companyConst) {
          company = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { employeeType, department, countryConst, company };
      });
      return {
        ...prevState,
        department,
        country,
        state,
        employeeType,
        company,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      department: [],
      country: [],
      state: [],
      company: [],
      employeeType: [],
      filterName: '',
      tabList: {
        active: 'active',
        myTeam: 'myTeam',
        inActive: 'inActive',
      },
      tabId: 'active',
      changeTab: false,
      collapsed: true,
      pageSelected: 1,
      bottabs: [],
      visible: false,
      visibleImportEmployee: false,
      listLocationsByCompany: [],
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        filterName: query,
      });
    }, 500);
  }

  componentDidMount = async () => {
    // this.renderData();
    this.initTabId();
    const { dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/fetchRolesList',
    });
    dispatch({
      type: 'employeesManagement/fetchCompanyList',
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { department, country, state, employeeType, company, filterName, tabId, changeTab } =
      this.state;
    // const isOwnerCheck = isOwner();
    // const currentLocation = getCurrentLocation();

    const params = {
      name: filterName,
      department,
      country,
      state,
      employeeType,
      company,
    };
    if (
      prevState.tabId !== tabId ||
      (changeTab && prevState.tabId === tabId) ||
      prevState.department.length !== department.length ||
      prevState.country.length !== country.length ||
      prevState.state.length !== state.length ||
      prevState.employeeType.length !== employeeType.length ||
      prevState.filterName !== filterName ||
      prevState.company.length !== company.length
    ) {
      this.onChangeTab(params, tabId);
    }

    const { filterList = {}, listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(prevProps?.filterList || []) !== JSON.stringify(filterList) ||
      JSON.stringify(prevProps?.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.renderData();
    }
  }

  componentWillUnmount = async () => {
    this.setState = () => {
      return { tabId: 'active', changeTab: false };
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/ClearFilter',
    });
    await dispatch({
      type: 'employee/save',
      payload: {
        filterList: {},
      },
    });
  };

  // fetchApprovalFlowList = () => {
  //   const {
  //     currentUser: {
  //       location: { _id: locationID = '' } = {},
  //       company: { _id: companyID } = {},
  //     } = {},
  //     dispatch,
  //   } = this.props;

  //   dispatch({
  //     type: 'offboarding/fetchApprovalFlowList',
  //     payload: {
  //       company: companyID,
  //       location: locationID,
  //     },
  //   });
  // };

  // Define tabID to filter
  initTabId = () => {
    const { permissions = {} } = this.props;
    let tabId = 'active';
    const viewTabActive = permissions.viewTabActive === -1;
    const viewTabInActive = permissions.viewTabInActive === -1;

    if (viewTabActive) {
      tabId = 'inActive';
    }

    // Set tabId for myTeam to hide button Filter
    if (viewTabActive && viewTabInActive) {
      tabId = 'myTeam';
    }

    this.setState({
      tabId,
    });
  };

  renderData = () => {
    const { dispatch, permissions = {} } = this.props;
    const {
      companiesOfUser = [],
      filterList: { listCountry = [] } = {},
      listLocationsByCompany = [],
      currentUser: { employee: { department: { name: departmentName = '' } = {} } = {} } = {},
    } = this.props;

    const currentCompany = getCurrentCompany();
    const currentLocation = getCurrentLocation();
    const isOwnerCheck = isOwner();

    // OWNER
    // if location selected, render data of current company
    // else, multiple companies
    let companyPayload = [];
    const companyList = companiesOfUser.filter(
      (comp) => comp?._id === currentCompany || comp?.childOfCompany === currentCompany,
    );
    if (!currentLocation && isOwnerCheck) {
      companyPayload = [...companyList];
    } else companyPayload = companyList.filter((lo) => lo?._id === currentCompany);

    let locationPayload = [];

    if (!currentLocation) {
      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (countryItem1 === countryItem2) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    } else {
      const currentLocationObj = listLocationsByCompany.find((loc) => loc?._id === currentLocation);
      const currentLocationCountry = currentLocationObj?.headQuarterAddress?.country?._id;
      const currentLocationState = currentLocationObj?.headQuarterAddress?.state;

      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (
              countryItem1 === countryItem2 &&
              currentLocationCountry === countryItem2 &&
              currentLocationState === stateItem2
            ) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    }

    const viewTabActive = permissions.viewTabActive !== -1;
    const viewTabInActive = permissions.viewTabInActive !== -1;
    const viewTabMyTeam = permissions.viewTabMyTeam !== -1;

    if (viewTabMyTeam) {
      dispatch({
        type: 'employee/fetchListEmployeeMyTeam',
        payload: {
          company: companyPayload,
          department: [departmentName],
          location: locationPayload,
        },
      });
    }

    if (viewTabActive) {
      dispatch({
        type: 'employee/fetchListEmployeeActive',
        payload: {
          company: companyPayload,
          location: locationPayload,
        },
      });
    }
    if (viewTabInActive) {
      dispatch({
        type: 'employee/fetchListEmployeeInActive',
        payload: {
          company: companyPayload,

          location: locationPayload,
        },
      });
    }
  };

  onChangeTab = (params, tabId) => {
    const {
      tabList: { active, myTeam, inActive },
    } = this.state;

    const currentLocation = getCurrentLocation();
    const currentCompany = getCurrentCompany();

    const { dispatch } = this.props;
    const {
      companiesOfUser = [],
      filterList: { listCountry = [] } = {},
      listLocationsByCompany = [],
      currentUser: { employee: { department: { name: departmentName = '' } = {} } = {} } = {},
    } = this.props;
    const { name, department, country, state, employeeType, company } = params;

    // MULTI COMPANY & LOCATION PAYLOAD
    let companyPayload = [];
    const companyList = companiesOfUser.filter(
      (comp) => comp?._id === currentCompany || comp?.childOfCompany === currentCompany,
    );
    const isOwnerCheck = isOwner();

    // OWNER
    if (!currentLocation && isOwnerCheck) {
      if (company.length !== 0) {
        companyPayload = companyList.filter((lo) => company.includes(lo?._id));
      } else {
        companyPayload = [...companyList];
      }
    } else companyPayload = companyList.filter((lo) => lo?._id === currentCompany);

    let locationPayload = [];

    // if country is not selected, select all
    if (!currentLocation) {
      if (country.length === 0) {
        locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
          let stateList = [];
          listCountry.forEach(
            ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
              if (countryItem1 === countryItem2) {
                if (state.length !== 0) {
                  if (state.includes(stateItem2)) {
                    stateList = [...stateList, stateItem2];
                  }
                } else {
                  stateList = [...stateList, stateItem2];
                }
              }
            },
          );
          return {
            country: countryItem1,
            state: stateList,
          };
        });
      } else {
        locationPayload = country.map((item) => {
          let stateList = [];

          listCountry.forEach(
            ({ country: { _id: countryItem = '' } = {}, state: stateItem = '' }) => {
              if (item === countryItem) {
                if (state.length !== 0) {
                  if (state.includes(stateItem)) {
                    stateList = [...stateList, stateItem];
                  }
                } else {
                  stateList = [...stateList, stateItem];
                }
              }
            },
          );

          return {
            country: item,
            state: stateList,
          };
        });
      }
    } else {
      const currentLocationObj = listLocationsByCompany.find((loc) => loc?._id === currentLocation);
      const currentLocationCountry = currentLocationObj?.headQuarterAddress?.country?._id;
      const currentLocationState = currentLocationObj?.headQuarterAddress?.state;

      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (
              countryItem1 === countryItem2 &&
              currentLocationCountry === countryItem2 &&
              currentLocationState === stateItem2
            ) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    }

    const payload = {
      company: companyPayload,
      name,
      department,
      location: locationPayload,
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
        payload: {
          ...payload,
          department: [departmentName],
        },
      });
    }
    if (tabId === inActive) {
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

  handleFilterPane = () => {
    this.setState({
      collapsed: false,
    });
  };

  handleChange = (valueInput) => {
    this.setDebounce(valueInput);
  };

  handleClickTabPane = async (tabId) => {
    this.setState({
      tabId,
      changeTab: true,
      filterName: '',
    });
    const { dispatch } = this.props;
    await dispatch({
      type: 'employee/ClearFilter',
    });

    this.setState({
      changeTab: false,
    });
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

  processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      return {
        'Employee Id': item.employeeId,
        'First Name': item.firstName,
        'Last Name': item.lastName,
        'Joined Date': item.joinDate,
        Location: item.location,
        Department: item.department,
        'Employment Type': item.employeeType,
        Title: item.title,
        'Work Email': item.workEmail,
        'Personal Email': item.personalEmail,
        'Manager Work Email': item.managerWorkEmail,
        'Personal Number': item.personalNumber,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  // Download template to import employees
  downloadTemplate = () => {
    const exportData = [
      {
        employeeId: 'PSI 0000',
        firstName: 'First Name',
        lastName: 'Last Name',
        joinDate: '11/30/2020',
        location: 'Vietnam',
        department: 'Develop',
        employeeType: 'Full Time',
        title: 'Junior Frontend',
        workEmail: 'template@terralogic.com',
        personalEmail: 'template@gmail.com',
        managerWorkEmail: 'manager@terralogic.com',
        personalNumber: '0123456789',
      },
    ];
    exportToCsv('Template_Import_Employees.csv', this.processData(exportData));
  };

  rightButton = (roles, collapsed) => {
    const { tabId } = this.state;
    const { permissions = {} } = this.props;

    const findIndexImport = permissions.importEmployees !== -1;
    const findIndexAdd = permissions.addEmployee !== -1;

    return (
      <div className={styles.tabBarExtra}>
        {findIndexImport && (
          <div className={styles.buttonAddImport} onClick={this.downloadTemplate}>
            <img src={iconDownload} alt="Download Template" />
            <p className={styles.buttonAddImport_text}>
              {formatMessage({ id: 'pages_admin.employees.table.downloadTemplate' })}
            </p>
          </div>
        )}
        {findIndexImport && (
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

        {findIndexAdd && (
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
    return (
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
    );
  };

  renderTabPane = () => {
    const {
      tabList: { active, myTeam, inActive },
    } = this.state;
    const {
      loadingListActive,
      loadingListMyTeam,
      loadingListInActive,
      permissions = {},
    } = this.props;

    const findIndexActive = permissions.viewTabActive;
    const findIndexMyTeam = permissions.viewTabMyTeam;
    const findIndexInActive = permissions.viewTabInActive;
    const findIndexShowLocationActive = permissions.filterLocationActive;
    const findIndexShowLocationInActive = permissions.filterLocationInActive;

    return (
      <>
        {findIndexActive !== -1 &&
          this.renderTab(
            formatMessage({ id: 'pages.directory.directory.activeEmployeesTab' }),
            active,
            loadingListActive,
            findIndexShowLocationActive,
          )}
        {findIndexMyTeam !== -1 && (
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
    const { tabId, collapsed, changeTab } = this.state;
    return (
      <TabPane tab={tabName} key={key}>
        <Layout className={styles.directoryLayout_inner}>
          <Content className="site-layout-background">
            <DirectoryTable
              handleFilterPane={this.handleFilterPane}
              loading={loading}
              list={this.renderListEmployee(key)}
              keyTab={key}
            />
          </Content>
          <TableFilter
            onToggle={this.handleToggle}
            collapsed={collapsed}
            onHandleChange={this.handleChange}
            FormBox={this.handleFormBox}
            changeTab={changeTab}
            tabName={tabId}
            checkLocation={indexShowLocation}
          />
        </Layout>
      </TabPane>
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      visibleImportEmployee: false,
    });
  };

  render() {
    const {
      currentUser: { company, roles = [] },
      companiesOfUser = [],
      loadingFetchLocations = false,
      loadingCompaniesOfUser = false,
    } = this.props;
    const { collapsed, visible, visibleImportEmployee } = this.state;

    return (
      <div className={styles.DirectoryComponent}>
        {loadingFetchLocations || loadingCompaniesOfUser ? (
          <Skeleton />
        ) : (
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
        )}

        <AddEmployeeForm
          company={company}
          titleModal="Add Employee"
          visible={visible}
          handleCancel={this.handleCancel}
          handleRefresh={this.renderData}
          getResponse={this.getResponse}
        />
        {visibleImportEmployee && (
          <ModalImportEmployee
            company={companiesOfUser}
            titleModal="Import Employees"
            visible={visibleImportEmployee}
            handleCancel={this.handleCancel}
            handleRefresh={this.renderData}
          />
        )}
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
