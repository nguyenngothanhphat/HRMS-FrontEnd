import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Layout } from 'antd';
import TableCandidates from '../TableCandidates';
import TableFilter from '../TableFilter';
import styles from './index.less';

@connect(({ loading, candidatesManagement }) => ({
  loadingCandidatesList: loading.effects['candidatesManagement/fetchCandidatesList'],
  candidatesManagement,
}))
class TableContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('candidatesManagement' in nextProps) {
      const { candidatesManagement: { filter = [] } = {} } = nextProps;
      let processStatus = [];
      const statusConst = 'Progress Status';
      filter.map((item) => {
        if (item.actionFilter.name === statusConst) {
          processStatus = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { processStatus };
      });
      return {
        ...prevState,
        processStatus,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      bottabs: [{ id: 1, name: 'Active Candidates' }],
      collapsed: true,
      processStatus: [],
    };
  }

  componentDidMount() {
    this.initDataTable();
  }

  componentDidUpdate(prevProps, prevState) {
    const { processStatus, tabId } = this.state;
    const params = {
      processStatus,
    };
    if (prevState.tabId !== tabId || prevState.processStatus.length !== processStatus.length) {
      this.getDataTable(params, tabId);
    }
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidatesManagement/fetchCandidatesList',
    });
  };

  getDataTable = (params, tabId) => {
    const { dispatch } = this.props;
    const { processStatus = [] } = params;
    if (tabId === 1) {
      dispatch({
        type: 'candidatesManagement/fetchCandidatesList',
        processStatus,
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
    const { loadingCandidatesList } = this.props;
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
                    <TableCandidates
                      loading={loadingCandidatesList}
                      data={this.renderListCandidates(tab.id)}
                    />
                  </Content>
                  <TableFilter
                    collapsed={collapsed}
                    onHandleChange={this.handleChange}
                    FormBox={this.handleFormBox}
                    // changeTab={changeTab}
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
