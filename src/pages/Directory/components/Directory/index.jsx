import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import { FilterOutlined } from '@ant-design/icons';
import { Tabs, Layout, Image } from 'antd';
import DirectoryTable from '@/components/DirectoryTable';
import { debounce } from 'lodash';
import addTeam from '@/assets/addTeam.svg';
import styles from './index.less';
import TableFilter from '../TableFilter';

@connect(({ loading, employee }) => ({
  loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
  loadingListMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
  loadingListInActive: loading.effects['employee/fetchListEmployeeInActive'],
  employee,
}))
class DirectoryComponent extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('employee' in nextProps) {
      const { employee: { filter = [] } = {} } = nextProps;
      let employeeType = [];
      let department = [];
      let location = [];
      const employeeTypeConst = 'Employment Type';
      const departmentConst = 'Department';
      const locationConst = 'Location';
      filter.map((item) => {
        if (item.actionFilter.name === employeeTypeConst) {
          employeeType = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === departmentConst) {
          department = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        if (item.actionFilter.name === locationConst) {
          location = item.checkedList ? item.checkedList : item.actionFilter.checkedList;
        }
        return { employeeType, department, location };
      });
      return {
        ...prevState,
        department,
        location,
        employeeType,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      department: [],
      location: [],
      employeeType: [],
      filterName: '',
      tabId: 1,
      changeTab: false,
      collapsed: false,
      pageSelected: 1,
      bottabs: [
        { id: 1, name: formatMessage({ id: 'pages.directory.directory.activeEmployeesTab' }) },
        { id: 2, name: formatMessage({ id: 'pages.directory.directory.myTeamTab' }) },
        { id: 3, name: formatMessage({ id: 'pages.directory.directory.inactiveEmployeesTab' }) },
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
    const { department, location, employeeType, filterName, tabId } = this.state;
    const params = {
      name: filterName,
      department,
      location,
      employeeType,
    };

    if (
      prevState.tabId !== tabId ||
      prevState.department.length !== department.length ||
      prevState.location.length !== location.length ||
      prevState.employeeType.length !== employeeType.length ||
      prevState.filterName !== filterName
    ) {
      this.getDataTable(params, tabId);
    }
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
    });
    dispatch({
      type: 'employee/fetchListEmployeeActive',
    });
    dispatch({
      type: 'employee/fetchListEmployeeInActive',
    });
  };

  getDataTable = (params, tabId) => {
    const { dispatch } = this.props;
    if (tabId === 1) {
      dispatch({
        type: 'employee/fetchListEmployeeActive',
        payload: params,
      });
    }
    if (tabId === 2) {
      dispatch({
        type: 'employee/fetchListEmployeeMyTeam',
        payload: params,
      });
    }
    if (tabId === 3) {
      dispatch({
        type: 'employee/fetchListEmployeeInActive',
        payload: params,
      });
    }
  };

  renderListEmployee = (tabId) => {
    const {
      employee: { listEmployeeActive = [], listEmployeeMyTeam = [], listEmployeeInActive = [] },
    } = this.props;
    if (tabId === 1) {
      return listEmployeeActive;
    }
    if (tabId === 2) {
      return listEmployeeMyTeam;
    }
    return listEmployeeInActive;
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
      type: 'employee/ClearFilter',
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
        <NavLink to="/directory" className={styles.buttonCreate}>
          {/* <UserAddOutlined /> */}
          <Image width={20} src={addTeam} alt="" className={styles.AddTeamimg} />
          <p className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages.directory.directory.addTeamMember' })}
          </p>
        </NavLink>
        <div className={styles.filterSider} onClick={this.handleToggle}>
          <div className={styles.filterBackgroundButton} />
          <div className={styles.filterButton}>
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
    const { loadingListActive, loadingListMyTeam, loadingListInActive } = this.props;

    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.contentContainer}>
          {/* <Layout className={styles.directoryLayout}> */}
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={this.rightButton()}
          >
            {bottabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.directoryLayout_inner}>
                  <TableFilter
                    onToggle={this.handleToggle}
                    collapsed={collapsed}
                    onHandleChange={this.handleChange}
                    FormBox={this.handleFormBox}
                    changeTab={changeTab}
                  />
                  <Content className="site-layout-background">
                    <DirectoryTable
                      loading={loadingListActive || loadingListMyTeam || loadingListInActive}
                      list={this.renderListEmployee(tab.id)}
                    />
                  </Content>
                </Layout>
              </TabPane>
            ))}
          </Tabs>
          {/* <Footer> */}
          {/* <Pagination
                defaultCurrent={1}
                defaultPageSize={9}
                onChange={this.handleChange}
                total={15}
              /> */}
          {/* </Footer> */}
          {/* </Layout> */}
        </div>
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
