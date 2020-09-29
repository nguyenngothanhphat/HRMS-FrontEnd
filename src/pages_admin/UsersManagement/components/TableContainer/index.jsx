import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import Icon, { FilterOutlined } from '@ant-design/icons';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import TableUsers from '../TableUsers';
import addUser from '../../../../../public/assets/images/addMemberIcon.svg';
import importUsers from '../../../../../public/assets/images/import.svg';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(({ loading, usersManagement }) => ({
  loadingListActive: loading.effects['usersManagement/fetchListUsersActive'],
  loadingListInActive: loading.effects['usersManagement/fetchListUsersInActive'],
  usersManagement,
}))
class TableContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('usersManagement' in nextProps) {
      const { usersManagement: { filter = [] } = {} } = nextProps;
      let role = [];
      let company = [];
      let location = [];
      const roleConst = 'Role';
      const companyConst = 'Company';
      const locationConst = 'Location';
      filter.map((item) => {
        if (item.actionFilter.name === roleConst) {
          role = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === companyConst) {
          company = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === locationConst) {
          location = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { role, company, location };
      });
      return {
        ...prevState,
        role,
        company,
        location,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      changeTab: false,
      collapsed: true,
      role: [],
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
    this.initDataTable();
  }

  componentDidUpdate(prevProps, prevState) {
    const { role, location, company, filterName, tabId } = this.state;
    const params = {
      name: filterName,
      role,
      location,
      company,
    };

    if (
      prevState.tabId !== tabId ||
      prevState.role.length !== role.length ||
      prevState.location.length !== location.length ||
      prevState.company.length !== company.length ||
      prevState.filterName !== filterName
    ) {
      this.getDataTable(params, tabId);
    }
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usersManagement/fetchListUsersActive',
    });
    dispatch({
      type: 'usersManagement/fetchListUsersInActive',
    });
  };

  getDataTable = (params, tabId) => {
    const { dispatch } = this.props;
    if (tabId === 1) {
      dispatch({
        type: 'usersManagement/fetchListUsersActive',
        payload: params,
      });
    }
    if (tabId === 2) {
      dispatch({
        type: 'usersManagement/fetchListUsersInActive',
        payload: params,
      });
    }
  };

  renderListUsers = (tabId) => {
    const {
      usersManagement: { listUsersActive = [], listUsersInActive = [] },
    } = this.props;
    if (tabId === 1) {
      return listUsersActive;
    }
    return listUsersInActive;
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
        <NavLink to="/#" className={styles.buttonAdd}>
          <img src={importUsers} alt="import-user" />
          <span className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages_admin.users.userTable.importUsers' })}
          </span>
        </NavLink>

        <NavLink to="/#" className={styles.buttonAdd}>
          <img src={addUser} alt="import-user" />
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
    const { loadingListActive, loadingListInActive } = this.props;
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
                    <TableUsers
                      loading={loadingListActive || loadingListInActive}
                      data={this.renderListUsers(tab.id)}
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
