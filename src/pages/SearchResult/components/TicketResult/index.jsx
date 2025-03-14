/* eslint-disable react/jsx-curly-newline */
import { Card } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect, history, Link } from 'umi';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import { LIST_STATUS_TICKET } from '@/constants/globalSearch';
import { isOwner } from '@/utils/authority';
import styles from '../../index.less';

const TicketResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    ticketAdvance,
    isSearchAdvance,
    ticketList,
    loadTableData2,
    tabName,
    employee: currentUser,
  } = props;

  useEffect(() => {
    if (isSearch && tabName === 'tickets') {
      if (isSearchAdvance) {
        dispatch({
          type: 'searchAdvance/searchTicket',
          payload: { ...ticketAdvance },
        });
      } else if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'TICKET',
          },
        });
      }
    }
  }, [isSearch]);

  const clickFilter = () => {
    history.push('tickets/advanced-search');
  };

  const onClickTicket = (record) => {
    const { id = '', title = '', ticketID, employee: { _id: employeeId } = {} } = record;
    let path = '';
    switch (title) {
      case 'Offboarding Request':
        path = `/offboarding/list/review/${id}`;
        break;
      case 'Leave Request':
      case 'Compoff Request':
        if (employeeId === currentUser?._id)
          path = `/time-off/overview/personal-timeoff/view/${id}`;
        else path = `/time-off/overview/manager-timeoff/view/${id}`;
        break;
      case 'Onboarding Ticket':
        path = `/onboarding/list/view/${ticketID}`;
        break;
      default:
        break;
    }
    history.push(path);
  };

  const handleProfileEmployee = (_id, tenant, userId) => {
    localStorage.setItem('tenantCurrentEmployee', tenant);
    const pathname = isOwner()
      ? `/employees/employee-profile/${userId}`
      : `/directory/employee-profile/${userId}`;
    return pathname;
  };
  const renderStatus = (status) => {
    const result = LIST_STATUS_TICKET.find((item) => item.key === status);
    return result.value || '-';
  };
  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketID',
      key: 'ticketId',
      width: 200,
      render: (ticketID, record) => (
        <div className={styles.blueText} onClick={() => onClickTicket(record)}>
          {ticketID}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title) => <div>{title}</div>,
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      width: 300,
      render: (employee) => {
        if (employee) {
          const {
            generalInfo: { legalName, firstName = '', middleName = '', lastName = '' } = {},
          } = employee;
          const fullName = legalName || `${firstName} ${middleName} ${lastName}`;
          return <div className={styles.blueText}>{fullName}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      title: 'Assignee To',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 300,
      render: (assignee) => {
        if (assignee) {
          const {
            _id,
            departmentInfo: department = {},
            employeeId,
            employeeTypeInfo: employeeType = {},
            titleInfo: title = {},
            generalInfoInfo: generalInfo = {},
            locationInfo: location = {},
          } = assignee;
          const manager = {
            _id,
            department,
            employeeId,
            title,
            generalInfo,
            location,
            employeeType,
          };
          return (
            <Link
              className={styles.managerName}
              to={() =>
                handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
              }
            >
              {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
            </Link>
          );
        }
        return '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <div>{renderStatus(status)}</div>,
    },
  ];

  const renderOption = () => {
    return (
      <div className={styles.options}>
        <CustomOrangeButton onClick={clickFilter}>Filter</CustomOrangeButton>
      </div>
    );
  };

  return (
    <Card className={styles.ResultContent} extra={renderOption()}>
      <div className={styles.tableContainer}>
        <CommonTable
          columns={columns}
          list={ticketList}
          loading={loadTableData || loadTableData2}
          scrollable
        />
      </div>
    </Card>
  );
});
export default connect(
  ({
    loading,
    user: { currentUser: { employee = {} } = {} },
    location: { companyLocationList = [] },
    searchAdvance: {
      keySearch = '',
      isSearch,
      isSearchAdvance,
      ticketAdvance,
      globalSearchAdvance: { tickets: ticketList, totalTickets },
    },
  }) => ({
    loadTableData: loading.effects['searchAdvance/searchTicket'],
    loadTableData2: loading.effects['searchAdvance/searchGlobalByType'],
    ticketList,
    totalTickets,
    ticketAdvance,
    isSearch,
    isSearchAdvance,
    keySearch,
    employee,
    companyLocationList,
  }),
)(TicketResult);
