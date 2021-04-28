import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import {
  getCurrentCompany,
  getCurrentLocation,
  getCurrentTenant,
  isOwner,
} from '@/utils/authority';
import TableUsers from '../TableUsers';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(
  ({
    loading,
    usersManagement,
    locationSelection: { listLocationsByCompany = [] } = {},
    employee,
    user: { currentUser = {}, permissions = {}, companiesOfUser = [] },
    employee: { filterList = {} } = {},
  }) => ({
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
    loadingList: loading.effects['usersManagement/fetchEmployeesList'],
    usersManagement,
  }),
)
class TableContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('usersManagement' in nextProps) {
      const { usersManagement: { filter = [] } = {} } = nextProps;
      let roles = [];
      let company = [];
      let location = [];
      const roleConst = 'Role';
      const companyConst = 'Company';
      const locationConst = 'Location';
      filter.map((item) => {
        if (item.actionFilter.name === roleConst) {
          roles = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === companyConst) {
          company = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === locationConst) {
          location = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { roles, company, location };
      });
      return {
        ...prevState,
        roles,
        company,
        location,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      tabId: 'active',
      changeTab: false,
      collapsed: true,
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

  componentDidMount() {
    this.getTableData({}, 1);
  }

  componentDidUpdate(prevProps, prevState) {
    const { roles, location, company, filterName, tabId } = this.state;
    const params = {
      name: filterName,
      roles,
      location,
      company,
    };

    if (
      prevState.tabId !== tabId ||
      prevState.roles.length !== roles.length ||
      prevState.location.length !== location.length ||
      prevState.company.length !== company.length ||
      prevState.filterName !== filterName
    ) {
      this.getTableData(params, tabId);
    }
  }

  getTableData = (params, tabId) => {
    const currentLocation = getCurrentLocation();
    const currentCompany = getCurrentCompany();

    const { dispatch } = this.props;
    const {
      companiesOfUser = [],
      filterList: { listCountry = [] } = {},
      listLocationsByCompany = [],
    } = this.props;
    const {
      name = '',
      department = [],
      country = [],
      state = [],
      employeeType = [],
      company = [],
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

    if (tabId === 1) {
      dispatch({
        type: 'usersManagement/fetchEmployeesList',
        payload: { ...payload, status: ['ACTIVE'] },
      });
    }
    if (tabId === 2) {
      dispatch({
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
    const { bottabs, collapsed } = this.state;
    const { loadingList } = this.props;
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
                    <TableUsers loading={loadingList} data={this.renderListUsers(tab.id)} />
                  </Content>
                  {/* <TableFilter
                    onToggle={this.handleToggle}
                    collapsed={collapsed}
                    onHandleChange={this.handleChange}
                    FormBox={this.handleFormBox}
                    changeTab={changeTab}
                  /> */}
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
