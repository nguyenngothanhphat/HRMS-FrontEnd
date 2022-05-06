import { Tabs } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import CheckboxMenu from '@/components/CheckboxMenu';
import AllTicket from './components/AllTickets';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';

@connect(
  ({
    user: {
      permissions = {},
      currentUser: { employee: { location: { _id: locationId = '' } = {} } = {} } = {},
    },
    location: { companyLocationList = [] },

    ticketManagement: { listOffAllTicket = [], totalList = [], selectedLocations = [] } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    permissions,
    companyLocationList,
    locationId,
    selectedLocations,
  }),
)
class ManagerTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocations: [getCurrentLocation()],
    };
  }

  componentDidMount() {
    const { tabName = '', permissions = {} } = this.props;
    if (!tabName) {
      history.replace(`/ticket-management/all-tickets`);
    } else {
      const { dispatch } = this.props;
      if (!dispatch) {
        return;
      }

      const viewTicketHR = permissions.viewTicketHR !== -1;

      const viewTicketIT = permissions.viewTicketIT !== -1;

      const viewTicketOperations = permissions.viewTicketOperations !== -1;

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
          let departmentList = [];

          if (viewTicketHR) {
            const find = data.filter((x) => x.name.includes('HR'));
            departmentList = [...departmentList, ...find.map((x) => x._id)];
            departmentNameList = [...departmentNameList, ...find.map((x) => x.name)];
          }
          if (viewTicketIT) {
            const find = data.filter((x) => x.name.includes('IT'));
            departmentList = [...departmentList, ...find.map((x) => x._id)];
            departmentNameList = [...departmentNameList, ...find.map((x) => x.name)];
          }
          if (viewTicketOperations) {
            const find = data.filter((x) => x.name.toLowerCase().includes('operations'));
            departmentList = [...departmentList, ...find.map((x) => x._id)];
            departmentNameList = [...departmentNameList, ...find.map((x) => x.name)];
          }

          if (departmentList.length > 0) {
            dispatch({
              type: 'ticketManagement/save',
              payload: {
                departmentPayload: departmentList,
              },
            });
          }
          this.fetchListAllTicket(departmentList);
          this.fetchToTalList(departmentList);
          this.fetchListEmployee(departmentNameList);
        } else {
          this.fetchListAllTicket();
          this.fetchToTalList();
          this.fetchListEmployee();
        }
      });
      this.fetchLocationList();
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

  fetchToTalList = (departmentList) => {
    const { dispatch, selectedLocations = [] } = this.props;

    let payload = {
      status: ['New'],
    };
    if (departmentList && departmentList.length > 0) {
      payload = {
        ...payload,
        department: departmentList,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload: {
        ...payload,
        location: selectedLocations,
      },
    });
  };

  fetchLocationList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  fetchListEmployee = (departmentNameList) => {
    const { dispatch } = this.props;
    let payload = {};
    if (departmentNameList && departmentNameList.length > 0) {
      payload = {
        ...payload,
        department: departmentNameList,
        status: 'ACTIVE',
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListEmployee',
      payload,
    });
  };

  fetchListAllTicket = (departmentList) => {
    const { dispatch, selectedLocations } = this.props;

    let payload = {
      status: ['New'],
      location: selectedLocations,
    };
    if (departmentList && departmentList.length > 0) {
      payload = {
        ...payload,
        department: departmentList,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload,
    });
  };

  onLocationChange = (selection) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload: {
        location: [...selection],
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
    const { listOffAllTicket = [], totalList = [], tabName = '' } = this.props;

    if (!tabName) return '';
    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'all-tickets'}
            onChange={(key) => {
              history.push(`/ticket-management/${key}`);
            }}
            tabBarExtraContent={this.renderFilterLocation()}
          >
            <TabPane tab="Overview" key="overview">
              <WorkInProgress />;
            </TabPane>
            <TabPane tab="All Tickets" key="all-tickets">
              <AllTicket data={listOffAllTicket} countData={totalList} />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default ManagerTicket;
