import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import TableCompanies from '../TableCompanies';
import styles from './index.less';

@connect(({ loading, companiesManagement }) => ({
  loadingListActive: loading.effects['companiesManagement/fetchActiveCompaniesList'],
  loadingListInActive: loading.effects['companiesManagement/fetchInActiveCompaniesList'],
  companiesManagement,
}))
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      tabs: [
        { id: 1, name: formatMessage({ id: 'pages_admin.companies.table.activeCompaniesTab' }) },
        { id: 2, name: formatMessage({ id: 'pages_admin.companies.table.inActiveCompaniesTab' }) },
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
      type: 'companiesManagement/fetchActiveCompaniesList',
    });
    dispatch({
      type: 'companiesManagement/fetchInActiveCompaniesList',
    });
  };

  getDataTable = (tabId) => {
    const { dispatch } = this.props;
    if (tabId === 1) {
      dispatch({
        type: 'companiesManagement/fetchActiveCompaniesList',
      });
    }
    if (tabId === 2) {
      dispatch({
        type: 'companiesManagement/fetchInActiveCompaniesList',
      });
    }
  };

  renderCompaniesList = (tabId) => {
    const {
      companiesManagement: { activeCompaniesList = [], inActiveCompaniesList = [] },
    } = this.props;
    if (tabId === 1) {
      return activeCompaniesList;
    }
    return inActiveCompaniesList;
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
    });
  };

  rightButton = () => {
    return (
      <div className={styles.tabBarExtra}>
        <NavLink to="/#" className={styles.buttonAddImport}>
          <img src="/assets/images/addMemberIcon.svg" alt="Add Company" />
          <p className={styles.buttonAddImport_text}>
            {formatMessage({ id: 'pages_admin.companies.table.addEmployee' })}
          </p>
        </NavLink>
      </div>
    );
  };

  handleChange = (valueInput) => {
    this.setDebounce(valueInput);
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { tabs } = this.state;
    const { loadingListActive, loadingListInActive } = this.props;

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableContent}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton()}
          >
            {tabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.managementLayout}>
                  <Content className="site-layout-background">
                    <TableCompanies
                      loading={loadingListActive || loadingListInActive}
                      data={this.renderCompaniesList(tab.id)}
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

export default TableContainer;
