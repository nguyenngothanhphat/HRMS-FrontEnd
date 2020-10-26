import React, { PureComponent } from 'react';
import { connect, formatMessage, NavLink } from 'umi';
import { Tabs, Layout } from 'antd';
import TableCompanies from '../TableCompanies';
import TabFilter from '../TabFilter';
import styles from './index.less';

@connect(({ loading, companiesManagement: { companiesList = [] } }) => ({
  loadingCompaniesList: loading.effects['companiesManagement/fetchCompaniesList'],
  companiesList,
}))
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      collapsed: true,
      changeTab: false,
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
      type: 'companiesManagement/fetchCompaniesList',
    });
  };

  rightButton = (collapsed) => {
    return (
      <div className={styles.tabBarExtra}>
        <NavLink to="/companies/add-company">
          <div className={styles.buttonAddImport}>
            <img src="/assets/images/addMemberIcon.svg" alt="Add Company" />
            <p className={styles.buttonAddImport_text}>
              {formatMessage({ id: 'pages_admin.companies.table.addEmployee' })}
            </p>
          </div>
        </NavLink>
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

  handleToggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { loadingCompaniesList, companiesList } = this.props;
    const { collapsed, changeTab } = this.state;
    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableContent}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            tabBarExtraContent={this.rightButton(collapsed)}
          >
            <TabPane>
              <Layout className={styles.managementLayout}>
                <Content className="site-layout-background">
                  <TableCompanies loading={loadingCompaniesList} data={companiesList} />
                </Content>
                <TabFilter
                  onToggle={this.handleToggle}
                  collapsed={collapsed}
                  FormBox={this.handleFormBox}
                  // onHandleChange={this.handleChange}
                  changeTab={changeTab}
                />
              </Layout>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TableContainer;
