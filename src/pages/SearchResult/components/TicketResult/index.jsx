/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from 'react';
import { Table, Popover } from 'antd';
import { formatMessage, connect, history, Link } from 'umi';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { isOwner } from '@/utils/authority';
import filterIcon from '@/assets/offboarding-filter.svg';
import { getTimezoneViaCity } from '@/utils/times';
import PopoverInfo from '@/pages/Directory/components/DirectoryTable/components/ModalTerminate/PopoverInfo';
import { LIST_STATUS_TICKET } from '@/utils/globalSearch';
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
    totalTickets,
    loadTableData2,
    companyLocationList,
    tabName,
    employee: currentUser,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [timezoneList, setTimezoneList] = useState([]);
  const [currentTime] = useState(moment());

  const fetchTimezone = () => {
    const timezoneListTemp = [];
    companyLocationList.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneListTemp.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    setTimezoneList(timezoneListTemp);
  };

  useEffect(() => {
    fetchTimezone();
  }, []);

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
            <Popover
              content={
                <PopoverInfo
                  companyLocationList={companyLocationList}
                  propsState={{ currentTime, timezoneList }}
                  data={manager}
                />
              }
              placement="bottomRight"
              trigger="hover"
            >
              <Link
                className={styles.managerName}
                to={() =>
                  handleProfileEmployee(manager._id, manager.tenant, manager.generalInfo?.userId)
                }
              >
                {!isEmpty(manager?.generalInfo) ? `${manager?.generalInfo?.legalName}` : ''}
              </Link>
            </Popover>
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

  const pagination = {
    position: ['bottomLeft'],
    total: totalTickets,
    showTotal: (total, range) => (
      <span>
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: limit,
    current: page,
    onChange: (nextPage, pageSize) => {
      setPage(nextPage);
      setLimit(pageSize);
    },
  };
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" onClick={clickFilter} />
      </div>
      <div className={styles.result}>
        <Table
          columns={columns}
          dataSource={ticketList}
          size="middle"
          pagination={pagination}
          loading={loadTableData || loadTableData2}
        />
      </div>
    </div>
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
