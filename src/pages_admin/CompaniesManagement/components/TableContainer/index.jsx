import React, { PureComponent } from 'react';
import { connect, formatMessage, NavLink } from 'umi';
import { Tabs, Layout } from 'antd';
import TableCompanies from '../TableCompanies';
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

  rightButton = () => {
    return (
      <NavLink to="/companies/add-company">
        <div className={styles.buttonAddImport}>
          <img src="/assets/images/addMemberIcon.svg" alt="Add Company" />
          <p className={styles.buttonAddImport_text}>
            {formatMessage({ id: 'pages_admin.companies.table.addEmployee' })}
          </p>
        </div>
      </NavLink>
    );
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { loadingCompaniesList, companiesList } = this.props;

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableContent}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            tabBarExtraContent={this.rightButton()}
          >
            <TabPane>
              <Layout className={styles.managementLayout}>
                <Content className="site-layout-background">
                  <TableCompanies loading={loadingCompaniesList} data={companiesList} />
                </Content>
              </Layout>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TableContainer;
