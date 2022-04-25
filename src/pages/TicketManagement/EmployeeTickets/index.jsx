import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TicketQueue from './components/TicketQueue';
import MyTickets from './components/MyTickets';
import CheckboxMenu from '@/components/CheckboxMenu';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';

import styles from './index.less';

@connect(
  ({
    ticketManagement: { listOffAllTicket = [], totalList = [], selectedLocations = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
    location: { companyLocationList = [] },
  }) => ({
    employee,
    listOffAllTicket,
    totalList,
    companyLocationList,
    selectedLocations,
  }),
)
class EmployeeTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocations: [getCurrentLocation()],
    };
  }

  componentDidMount() {
    const { tabName = '' } = this.props;

    if (!tabName) {
      history.replace(`/ticket-management/ticket-queue`);
    } else {
      const { dispatch } = this.props;
      if (!dispatch) {
        return;
      }
      dispatch({
        type: 'ticketManagement/fetchDepartments',
        payload: {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        },
      }).then((res) => {
        if (res.statusCode === 200) {
          const { data = [] } = res;
          let departmentNameList = [];

          const newData = data.filter(
            (x) =>
              x.name.includes('HR') ||
              x.name.includes('IT') ||
              x.name.toLowerCase().includes('operations'),
          );
          departmentNameList = [...departmentNameList, ...newData.map((x) => x.name)];
          this.fetchListEmployee(departmentNameList);
        } else {
          this.fetchListEmployee();
        }
      });
      this.fetchListAllTicket();
      this.fetchLocation();
      this.fetchTotalList();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/save',
      payload: {
        selectedLocations: [getCurrentLocation()],
      },
    });
  }

  fetchLocation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  fetchListAllTicket = () => {
    const { dispatch, selectedLocations = [] } = this.props;
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        status: ['New'],
        location: selectedLocations,
      },
    });
  };

  fetchListEmployee = (departmentNameList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchListEmployee',
      payload: {
        department: departmentNameList,
        status: 'ACTIVE',
      },
    });
  };

  fetchTotalList = () => {
    const {
      dispatch,
      employee: {
        departmentInfo: { _id: idDepart = '' },
      },
      employee: { _id = '' } = {},
    } = this.props;
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload: {
        employeeAssignee: _id,
        departmentAssign: idDepart,
      },
    });
  };

  handleChangeTable = (key) => {
    history.push(`/ticket-management/${key}`);
    const {
      dispatch,
      selectedLocations = [],
      employee: { _id = '' },
      employee: { departmentInfo: { _id: idDepart = '' } = {} },
    } = this.props;
    if (key === 'ticket-queue') {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
          location: selectedLocations,
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {
          employeeAssignee: _id,
          departmentAssign: idDepart,
        },
      });
    } else {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['Assigned'],
          location: selectedLocations,
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {
          employeeAssignee: _id,
          departmentAssign: idDepart,
        },
      });
    }
  };

  onLocationChange = (selection) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    this.setState({
      selectedLocations: [...selection],
    });
  };

  getSelectedLocationName = () => {
    const { selectedLocations = [] } = this.state;
    const { companyLocationList = [] } = this.props;
    if (selectedLocations.length === 1) {
      return companyLocationList.find((x) => x._id === selectedLocations[0])?.name || '';
    }
    if (selectedLocations.length > 0 && selectedLocations.length < companyLocationList.length) {
      return `${selectedLocations.length} locations selected`;
    }
    if (selectedLocations.length === companyLocationList.length) {
      return 'All';
    }
    return 'None';
  };

  renderFilterLocation = () => {
    const selectedLocationName = this.getSelectedLocationName();
    const { selectedLocations = [] } = this.state;
    const { companyLocationList = [] } = this.props;
    const locationOptions = companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
    return (
      <div className={styles.item}>
        <span className={styles.label}>Location</span>

        <CheckboxMenu
          options={locationOptions}
          onChange={this.onLocationChange}
          list={companyLocationList}
          default={selectedLocations}
        >
          <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
            <span>{selectedLocationName}</span>
            <img src={SmallDownArrow} alt="" />
          </div>
        </CheckboxMenu>
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;
    const { listOffAllTicket = [], totalList = [] } = this.props;
    const { tabName = '' } = this.props;
    if (!tabName) return '';
    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'ticket-queue'}
            onChange={(key) => {
              this.handleChangeTable(key);
            }}
            destroyInactiveTabPane
            tabBarExtraContent={this.renderFilterLocation()}
          >
            <TabPane tab="Ticket Queue" key="ticket-queue">
              <TicketQueue data={listOffAllTicket} countData={totalList} />
            </TabPane>
            <TabPane tab="My Tickets" key="my-tickets">
              <MyTickets data={listOffAllTicket} countData={totalList} />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default EmployeeTicket;
