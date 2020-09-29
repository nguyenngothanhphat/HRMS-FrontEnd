import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import { debounce } from 'lodash';
import addDocument from '../../../../../public/assets/images/addMemberIcon.svg';
import importDocuments from '../../../../../public/assets/images/import.svg';
import TableDocuments from '../TableDocuments';
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
      bottabs: [
        {
          id: 1,
          name: formatMessage({ id: 'pages_admin.documents.documentTable.activeDocumentsTab' }),
        },
        {
          id: 2,
          name: formatMessage({ id: 'pages_admin.documents.documentTable.inactiveDocumentsTab' }),
        },
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

  rightButton = () => {
    return (
      <div className={styles.tabBarExtra}>
        <NavLink to="/#" className={styles.buttonAdd}>
          <img src={importDocuments} alt="import-documents" />
          <span className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages_admin.documents.documentTable.importDocuments' })}
          </span>
        </NavLink>
        <NavLink to="/#" className={styles.buttonAdd}>
          <img src={addDocument} alt="add-document" />
          <span className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages_admin.documents.documentTable.addDocument' })}
          </span>
        </NavLink>
      </div>
    );
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs } = this.state;
    const { loadingListActive, loadingListInActive } = this.props;
    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.contentContainer}>
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton()}
          >
            {bottabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.directoryLayout_inner}>
                  <Content className="site-layout-background">
                    <TableDocuments
                      loading={loadingListActive || loadingListInActive}
                      data={this.renderListUsers(tab.id)}
                    />
                  </Content>
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
