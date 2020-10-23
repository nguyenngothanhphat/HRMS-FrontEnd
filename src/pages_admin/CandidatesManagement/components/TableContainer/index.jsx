import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Layout } from 'antd';
import TableCandidates from '../TableCandidates';
import styles from './index.less';

@connect(({ loading, candidatesManagement }) => ({
  loadingCandidatesList: loading.effects['candidatesManagement/fetchCandidatesList'],
  candidatesManagement,
}))
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      bottabs: [{ id: 1, name: 'Active Candidates' }],
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
      type: 'candidatesManagement/fetchCandidatesList',
    });
  };

  getDataTable = (tabId) => {
    const { dispatch } = this.props;
    if (tabId === 1) {
      dispatch({
        type: 'candidatesManagement/fetchCandidatesList',
      });
    }
  };

  renderListCandidates = (tabId) => {
    const {
      candidatesManagement: { candidatesList = [] },
    } = this.props;
    if (tabId === 1) {
      return candidatesList;
    }
    return candidatesList;
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
    });
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs } = this.state;
    const { loadingCandidatesList } = this.props;
    return (
      <div className={styles.UsersTableContainer}>
        <div className={styles.contentContainer}>
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
            onTabClick={this.handleClickTabPane}
          >
            {bottabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.directoryLayout_inner}>
                  <Content className="site-layout-background">
                    <TableCandidates
                      loading={loadingCandidatesList}
                      data={this.renderListCandidates(tab.id)}
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
