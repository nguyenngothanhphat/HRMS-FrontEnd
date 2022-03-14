import { Tabs } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import AllTicket from './components/AllTickets';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

@connect(
  ({
    user: { permissions = {} },
    ticketManagement: { listOffAllTicket = [], totalList = [] } = {},
  }) => ({
    listOffAllTicket,
    totalList,
    permissions,
  }),
)
class ManagerTicket extends Component {
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

  fetchToTalList = (departmentList) => {
    const { dispatch } = this.props;

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

  fetchListEmployee = (departmentNameList) => {
    const { dispatch } = this.props;
    let payload = {};
    if (departmentNameList && departmentNameList.length > 0) {
      payload = {
        ...payload,
        department: departmentNameList,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListEmployee',
      payload,
    });
  };

  fetchListAllTicket = (departmentList) => {
    const { dispatch } = this.props;

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
      type: 'ticketManagement/fetchListAllTicket',
      payload,
    });
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
