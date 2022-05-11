import { Tabs } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import CheckboxMenu from '@/components/CheckboxMenu';
import AllTicket from './components/AllTickets';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';
import { getAuthority, getCurrentLocation } from '@/utils/authority';

@connect(
  ({
    user: {
      permissions = {},
      currentUser: {
        employee: {
          location: { _id: locationId = '', headQuarterAddress: { country = '' } = {} } = {},
        } = {},
      } = {},
    },
    location: { companyLocationList = [] },

    ticketManagement: { listOffAllTicket = [], totalList = [], selectedLocations = [] } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    permissions,
    country,
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
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`/ticket-management/all-tickets`);
    } else {
      const { dispatch } = this.props;
      if (!dispatch) {
        return;
      }
      const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));

      if (permissions && permissions.length > 0) {
        this.fetchListAllTicket(permissions);
        this.fetchToTalList(permissions);
      } else {
        this.fetchListAllTicket();
        this.fetchToTalList();
      }
      this.fetchListEmployee();
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

  fetchToTalList = (permissions) => {
    const { dispatch, country = '', selectedLocations = [] } = this.props;

    let payload = {
      status: ['New'],
      location: selectedLocations,
    };
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload,
    });
  };

  fetchLocationList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  fetchListEmployee = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'ticketManagement/fetchListEmployee',
      payload: {
        status: 'ACTIVE',
      },
    });
  };

  fetchListAllTicket = (permissions) => {
    const { dispatch, selectedLocations, country = '' } = this.props;

    let payload = {
      status: ['New'],
      location: selectedLocations,
    };
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        permissions,
        country,
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
