import { Layout, Skeleton, Tabs } from 'antd';
import React, { PureComponent, Suspense } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { getCurrentTenant } from '@/utils/authority';
import FilterContent from '../FilterContent';
import TableCandidates from '../TableCandidates';
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
      pageSelected: 1,
      size: 10,
      filter: [],
      form: null,
    };
  }

  componentDidMount() {
    this.initDataTable();
  }

  componentDidUpdate(prevProps, prevState) {
    const { processStatus, tabId, pageSelected, size } = this.state;
    const params = {
      processStatus,
    };
    if (
      prevState.tabId !== tabId ||
      prevState.processStatus.length !== processStatus.length ||
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size
    ) {
      this.getDataTable(params, tabId);
    }
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidatesManagement/fetchCandidatesList',
      payload: {
        tenantId: getCurrentTenant(),
      },
    });
  };

  getPageAndSize = (page, size) => {
    this.setState({
      pageSelected: page,
      size,
    });
  };

  getDataTable = (params, tabId) => {
    const { dispatch } = this.props;
    const { processStatus = [] } = params;
    if (tabId === 1) {
      dispatch({
        type: 'candidatesManagement/fetchCandidatesList',
        payload: {
          processStatus,
          tenantId: getCurrentTenant(),
        },
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

    const { dispatch } = this.props;
    if (Number(tabId) === 1) {
      dispatch({
        type: 'candidatesManagement/fetchCandidatesList',
        payload: {
          tenantId: getCurrentTenant(),
        },
      });
    }
  };

  onClearFilter = () => {
    const { form } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'candidatesManagement/ClearFilter',
    });
    form.resetFields();
    this.setState({ filter: {} });
    this.initDataTable();
  };

  setForm = (form) => {
    this.setState({
      form,
    });
  };

  rightButton = () => {
    const { tabId, filter } = this.state;
    const applied = Object.values(filter).filter((v) => v).length;
    return (
      <div className={styles.tabBarExtra}>
        <FilterCountTag count={applied} onClearFilter={this.onClearFilter} />
        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent
                onFilter={(val) => this.setState({ filter: val })}
                activeTab={tabId}
                setForm={(val) => this.setForm(val)}
              />
            </Suspense>
          }
        >
          <CustomOrangeButton fontSize={14} showDot={applied > 0} />
        </FilterPopover>
      </div>
    );
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs, collapsed, pageSelected, size } = this.state;
    const { loadingCandidatesList, candidatesManagement: { total = '' } = {} } = this.props;
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
                      total={total}
                      pageSelected={pageSelected}
                      size={size}
                      getPageAndSize={this.getPageAndSize}
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
