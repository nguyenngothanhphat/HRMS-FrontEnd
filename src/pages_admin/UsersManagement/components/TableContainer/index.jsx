import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import { getCurrentCompany, getCurrentLocation, isOwner } from '@/utils/authority';
import TableUsers from '../TableUsers';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(
  ({
    loading,
    usersManagement,
    location: { companyLocationList = [] } = {},
    employee,
    user: { currentUser = {}, permissions = {}, companiesOfUser = [] },
    usersManagement: { filterList = {}, totalActiveEmployee = '', totalInactiveEmployee = '' } = {},
  }) => ({
    employee,
    currentUser,
    permissions,
    companyLocationList,
    companiesOfUser,
    filterList,
    loadingList: loading.effects['usersManagement/fetchEmployeesList'],
    usersManagement,
    totalActiveEmployee,
    totalInactiveEmployee,
  }),
)
class TableContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('usersManagement' in nextProps) {
      const { usersManagement: { filter = [] } = {} } = nextProps;
      let roles = [];
      let company = [];
      let country = [];
      let state = [];
      const roleConst = 'Role';
      const companyConst = 'Company';
      const countryConst = 'Country';
      const stateConst = 'State';
      filter.map((item) => {
        if (item.actionFilter.name === roleConst) {
          roles = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === companyConst) {
          company = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === countryConst) {
          country = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === stateConst) {
          state = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { roles, company, country, state };
      });
      return {
        ...prevState,
        roles,
        company,
        country,
        state,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      changeTab: false,
      collapsed: false,
      pageSelected: 1,
      size: 10,
      roles: [],
      location: [],
      company: [],
      filterName: '',
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

  // componentDidMount() {

  // }

  componentDidUpdate(prevProps, prevState) {
    const { roles, department, country, state, company, filterName, tabId, pageSelected, size } =
      this.state;
    const { filterList = {}, companyLocationList = [] } = this.props;
    const params = {
      name: filterName,
      roles,
      company,
      department,
      country,
      state,
      page: 1,
      limit: size,
    };

    if (
      prevState.tabId !== tabId ||
      prevState.roles.length !== roles.length ||
      prevState.company.length !== company.length ||
      prevState.country.length !== country.length ||
      prevState.state.length !== state.length ||
      prevState.filterName !== filterName ||
      prevState.size !== size
    ) {
      this.getTableData(params, tabId);
    }

    if (
      JSON.stringify(prevProps?.filterList || []) !== JSON.stringify(filterList) ||
      JSON.stringify(prevProps?.companyLocationList) !== JSON.stringify(companyLocationList)
    ) {
      this.getTableData(params, 1);
    }

    if (prevState.pageSelected !== pageSelected) {
      const paramsPage = {
        ...params,
        page: pageSelected,
      };
      this.getPageChange(paramsPage, 1);
    }
  }

  getPageAndSize = (pageSelected, size) => {
    this.setState({
      pageSelected,
      size,
    });
  };

  getPageChange = async (params, tabId) => {
    const currentLocation = getCurrentLocation();
    const { size } = this.state;
    const currentCompany = getCurrentCompany();
    // console.log(pageSelected, size);
    const { dispatch } = this.props;
    const {
      companiesOfUser = [],
      filterList: { listCountry = [] } = {},
      companyLocationList = [],
    } = this.props;
    const {
      name = '',
      department = [],
      country = [],
      state = [],
      company = [],
      roles = [],
      page,
      // limit,
    } = params;

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
      const currentLocationObj = companyLocationList.find((loc) => loc?._id === currentLocation);
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
      roles,
      location: locationPayload,
      page,
      limit: size,
    };

    if (tabId === 1) {
      await dispatch({
        type: 'usersManagement/fetchEmployeesList',
        payload: { ...payload, status: ['ACTIVE'] },
      });
    }
    if (tabId === 2) {
      await dispatch({
        type: 'usersManagement/fetchEmployeesList',
        payload: { ...payload, status: ['INACTIVE'] },
      });
    }
  };

  getTableData = async (params, tabId) => {
    const currentLocation = getCurrentLocation();
    const currentCompany = getCurrentCompany();
    const { dispatch } = this.props;
    const {
      companiesOfUser = [],
      filterList: { listCountry = [] } = {},
      companyLocationList = [],
    } = this.props;
    const {
      name = '',
      department = [],
      country = [],
      state = [],
      company = [],
      roles = [],
      page,
      limit,
    } = params;

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
      const currentLocationObj = companyLocationList.find((loc) => loc?._id === currentLocation);
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
      roles,
      location: locationPayload,
      page,
      limit,
    };
    this.setState({
      pageSelected: page,
    });
    if (tabId === 1) {
      await dispatch({
        type: 'usersManagement/fetchEmployeesList',
        payload: { ...payload, status: ['ACTIVE'] },
      });
    }
    if (tabId === 2) {
      await dispatch({
        type: 'usersManagement/fetchEmployeesList',
        payload: { ...payload, status: ['INACTIVE'] },
      });
    }
  };

  renderListUsers = (tabId) => {
    const {
      usersManagement: { activeEmployeesList = [], inActiveEmployeesList = [] },
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

  handleChange = (valueInput) => {
    this.setDebounce(valueInput);
  };

  handleClickTabPane = (tabId) => {
    this.setState({
      tabId: Number(tabId),
      changeTab: true,
      filterName: '',
      pageSelected: 1,
      size: 10,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/ClearFilter',
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

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs, collapsed, changeTab, tabId, pageSelected, size } = this.state;
    const { loadingList, totalActiveEmployee, totalInactiveEmployee } = this.props;
    const total = tabId === 1 ? totalActiveEmployee : totalInactiveEmployee;
    return (
      <div className={styles.UsersTableContainer}>
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
                    <TableUsers
                      getTableData={this.getTableData}
                      loading={loadingList}
                      data={this.renderListUsers(tab.id)}
                      tabId={tabId}
                      total={total}
                      pageSelected={pageSelected}
                      size={size}
                      getPageAndSize={this.getPageAndSize}
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
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
