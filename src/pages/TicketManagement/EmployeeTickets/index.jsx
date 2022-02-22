import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TicketQueue from './components/TicketQueue';
import MyTickets from './components/MyTickets';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

import styles from './index.less';

@connect(
  ({
    ticketManagement: { listOffAllTicket = [], totalList = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    employee,
    listOffAllTicket,
    totalList,
  }),
)
class EmployeeTicket extends Component {
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
    }
    this.fetchListAllTicket();
    this.fetchLocation();
    this.fetchTotalList();
  }

  fetchLocation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchLocationList',
      payload: {},
    });
  };

  fetchListAllTicket = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload: {
        status: ['New'],
      },
    });
  };

  fetchListEmployee = (departmentNameList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketManagement/fetchListEmployee',
      payload: {
        department: departmentNameList,
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
      employee: { _id = '' },
      employee: { departmentInfo: { _id: idDepart = '' } = {} },
    } = this.props;
    if (key === 'ticket-queue') {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
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
