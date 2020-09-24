import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import Icon, { FilterOutlined } from '@ant-design/icons';
import { Tabs, Layout } from 'antd';
// import { debounce } from 'lodash';
import TableUsers from '../TableUsers';
import addUser from './icon.js';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(({ loading, usersManagement }) => ({
  loadingListActive: loading.effects['usersManagement/fetchListUsersActive'],
  loadingListInActive: loading.effects['usersManagement/fetchListUsersInActive'],
  usersManagement,
}))
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      changeTab: false,
      collapsed: true,
      bottabs: [
        { id: 1, name: formatMessage({ id: 'pages_admin.users.userTable.activeUsersTab' }) },
        { id: 2, name: formatMessage({ id: 'pages_admin.users.userTable.inactiveUsersTab' }) },
      ],
    };
  }

  componentDidMount() {
    this.initDataTable();
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabId } = this.state;
    if (prevState.tabId !== tabId) {
      this.getDataTable(tabId);
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

  getDataTable = (tabId) => {
    const { dispatch } = this.props;
    if (tabId === 1) {
      dispatch({
        type: 'usersManagement/fetchListUsersActive',
      });
    }
    if (tabId === 2) {
      dispatch({
        type: 'usersManagement/fetchListUsersInActive',
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
    const { loadingListActive, loadingListInActive } = this.props;
    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.contentContainer}>
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
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
