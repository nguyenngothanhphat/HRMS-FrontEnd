import React, { useState } from 'react';
import { Table, Tooltip, Empty } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Moment from 'moment';
import Link from 'umi/link';
import { extendMoment } from 'moment-range';
import PriceInput from '@/components/PriceInput';
import { ReactComponent as ViewIcon } from '@/assets/svg/view_report.svg';
import StatusIcon from './StatusIcon';
import styles from './index.less';

const moment = extendMoment(Moment);
const ListReportTable = props => {
  const {
    dispatch,
    list = [],
    listLocation,
    disabled,
    rowSelection: rowSelectionProps,
    pagination: paginationProps,
    setSelectedListId,
    currentUser,
    loading,
    isViewReportInTeamReport = false,
    getDataWithPagination,
    filter,
    totalRecord,
  } = props;
  const [sortedTable, setSortedTable] = useState({ columnKey: 'submittedon', order: 'descend' });
  const [pageSelected, setPageSelected] = useState();
  const [selectedListID, setSelectedListID] = useState([]);
  const onChangePagination = pageNumber => {
    setPageSelected(pageNumber);
    const payload = {
      page: pageNumber,
    };
    getDataWithPagination(payload);
  };
  const select = record => {
    const listTmp = [...selectedListID];
    if (listTmp.indexOf(record._id) !== -1) {
      setSelectedListID(listTmp.filter(item => item !== record._id));
      setSelectedListId(listTmp.filter(item => item !== record._id));
    } else {
      listTmp.push(record._id);
      setSelectedListID([...listTmp]);
      setSelectedListId([...listTmp]);
    }
  };

  const onChangePageSize = (current, size) => {
    const payload = {
      page: current,
      limit: size,
    };
    getDataWithPagination(payload);
  };

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageSelected,
    onChange: onChangePagination,
    onShowSizeChange: onChangePageSize,
    total: totalRecord,
  };

  const selectAllChange = selectedList => {
    setSelectedListID([...selectedList]);
    setSelectedListId([...selectedList]);
  };

  const triggerChange = selectedList => {
    selectAllChange(selectedList);
  };

  const rowSelection = {
    hideDefaultSelections: true,
    onSelect: select,
    selectedRowKeys: selectedListID,
    getCheckboxProps: () => ({
      disabled,
    }),
    onSelectAll: (selected, rowsOnPage, changeRows) => {
      let sId = [...selectedListID];
      if (selected) {
        let isChanged = false;
        rowsOnPage.forEach(row => {
          if (!sId.includes(row._id)) {
            isChanged = true;
            sId.push(row._id);
          }
        });
        if (!isChanged) sId = [];
      } else {
        changeRows.forEach(row => {
          sId = sId.filter(id => id !== row._id);
        });
      }
      triggerChange(sId || []);
    },
    selections: [
      {
        key: 'all-data',
        text: 'Select All',
        onSelect: () => {
          triggerChange(list.map(item => item._id) || []);
        },
      },
      {
        key: 'no-data',
        text: 'Unselect All',
        onSelect: () => {
          triggerChange([]);
        },
      },
    ],
  };
  const getCountryName = locationId => {
    let countryName = '';
    listLocation.forEach(location => {
      if (location._id === locationId) {
        countryName = location.country ? location.country.name : '';
      }
    });
    return countryName;
  };

  const handleChangeTable = (_pagination, _filters, sorter) => {
    setSortedTable(sorter);
  };
  const generateColumn = () => {
    let columns = [
      {
        className: styles.spentColumn,
        title: 'submittedon',
        dataIndex: 'date',
        key: 'submittedon',
        width: 130,
        render: (date, record) =>
          date
            ? moment(date).format('MMM D, YYYY')
            : moment(record.createdAt).format('MMM D, YYYY'),
        sortOrder: sortedTable.columnKey === 'submittedon' && sortedTable.order,
        sorter: (item, nextItem) =>
          moment
            .utc(item.date || item.createdAt)
            .diff(moment.utc(nextItem.date || nextItem.createdAt)),
      },
      {
        title: 'reportNumber',
        dataIndex: 'code',
        key: 'reportNumber',
        width: 130,
        render: reportNumber => reportNumber || '',
        sortOrder: sortedTable.columnKey === 'reportNumber' && sortedTable.order,
        sorter: (item, nextItem) => item.code.localeCompare(nextItem.code),
      },
      {
        title: 'reportName',
        dataIndex: 'title',
        key: 'reportName',
        width: 240,
        render: reportName => (
          <Tooltip placement="topLeft" title={reportName || ''}>
            <div className={styles.description}>{reportName || ''}</div>
          </Tooltip>
        ),
        sortOrder: sortedTable.columnKey === 'reportName' && sortedTable.order,
        sorter: (item, nextItem) => item.title.localeCompare(nextItem.title),
      },
      {
        title: 'employee',
        dataIndex: 'user',
        key: 'owner',
        width: 110,
        render: user => user.fullName || '',
        sortOrder: sortedTable.columnKey === 'owner' && sortedTable.order,
        sorter: (item, nextItem) => item.user.fullName.localeCompare(nextItem.user.fullName),
      },
      {
        title: 'location',
        dataIndex: 'location',
        key: 'location',
        width: 100,
        render: location => getCountryName(location.id) || '',
        sortOrder: sortedTable.columnKey === 'location' && sortedTable.order,
        sorter: (item, nextItem) =>
          getCountryName(item.location.id).localeCompare(getCountryName(nextItem.location.id)),
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        width: 135,
        render: status => <StatusIcon status={status} />,
        sortOrder: sortedTable.columnKey === 'status' && sortedTable.order,
        sorter: (item, nextItem) => item.status.localeCompare(nextItem.status),
      },
      {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 150,
        render: amount => (
          <Tooltip placement="topLeft" title={amount || ''}>
            <div className={styles.amount}>
              <PriceInput value={{ number: amount, currency: currentUser.location.currency._id }} />
            </div>
          </Tooltip>
        ),
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedTable.columnKey === 'amount' && sortedTable.order,
      },
      {
        title: 'view',
        dataIndex: 'id',
        key: 'id',
        render: (id, record) =>
          selectedListID.includes(record.id) ? (
            <Link
              to={`${isViewReportInTeamReport ? '/teamreport/view/' : '/report/view/'}${record.id}`}
              onClick={() => {
                dispatch({ type: 'reimbursement/fetchItem', payload: { reId: record.id } });
              }}
            >
              <ViewIcon />
            </Link>
          ) : (
            ''
          ),
      },
    ];

    if (filter.currentMenuFilter === 'all') {
      columns = [
        {
          className: styles.spentColumn,
          title: 'submittedon',
          dataIndex: 'date',
          key: 'submittedon',
          width: 130,
          render: (date, record) =>
            date
              ? moment(date).format('MMM D, YYYY')
              : moment(record.createdAt).format('MMM D, YYYY'),
          sortOrder: sortedTable.columnKey === 'submittedon' && sortedTable.order,
          sorter: (item, nextItem) =>
            moment
              .utc(item.date || item.createdAt)
              .diff(moment.utc(nextItem.date || nextItem.createdAt)),
        },
        {
          title: 'reportNumber',
          dataIndex: 'code',
          key: 'reportNumber',
          width: 130,
          render: reportNumber => reportNumber || '',
          sortOrder: sortedTable.columnKey === 'reportNumber' && sortedTable.order,
          sorter: (item, nextItem) => item.code.localeCompare(nextItem.code),
        },
        {
          title: 'reportName',
          dataIndex: 'title',
          key: 'reportName',
          width: 130,
          render: reportName => (
            <Tooltip placement="topLeft" title={reportName || ''}>
              <div className={styles.description}>{reportName || ''}</div>
            </Tooltip>
          ),
          sortOrder: sortedTable.columnKey === 'reportName' && sortedTable.order,
          sorter: (item, nextItem) => item.title.localeCompare(nextItem.title),
        },
        {
          title: 'owner',
          dataIndex: 'user',
          key: 'owner',
          width: 110,
          render: user => (
            <Tooltip placement="topLeft" title={user.fullName || ''}>
              <div className={styles.owner}>{user.fullName || ''}</div>
            </Tooltip>
          ),
          sortOrder: sortedTable.columnKey === 'owner' && sortedTable.order,
          sorter: (item, nextItem) => item.user.fullName.localeCompare(nextItem.user.fullName),
        },
        {
          title: 'location',
          dataIndex: 'location',
          key: 'location',
          width: 100,
          render: location => getCountryName(location.id) || '',
          sortOrder: sortedTable.columnKey === 'location' && sortedTable.order,
          sorter: (item, nextItem) =>
            getCountryName(item.location.id).localeCompare(getCountryName(nextItem.location.id)),
        },
        {
          // className: styles.spentColumn,
          title: 'pendApprove',
          dataIndex: 'manager',
          key: 'pendApprove',
          width: 110,
          render: (approver, record) => (
            <Tooltip placement="topLeft" title={record.manager ? record.manager.fullName : '-'}>
              <div className={styles.pendApprove}>
                {/* {record.status === 'PENDING'.toUpperCase() ? record.manager.fullName : '-'} */}
                {record.manager ? record.manager.fullName : '-'}
              </div>
            </Tooltip>
          ),
          sortOrder: sortedTable.columnKey === 'pendApprove' && sortedTable.order,
          sorter: (item, nextItem) => {
            return item.manager.fullName.localeCompare(nextItem.manager.fullName);
          },
        },
        {
          title: 'status',
          dataIndex: 'status',
          key: 'status',
          width: 115,
          render: status => <StatusIcon status={status} />,
          sortOrder: sortedTable.columnKey === 'status' && sortedTable.order,
          sorter: (item, nextItem) => item.status.localeCompare(nextItem.status),
        },
        {
          title: 'amount',
          dataIndex: 'amount',
          key: 'amount',
          width: 120,
          render: amount => (
            <Tooltip
              placement="topLeft"
              title={
                (
                  <PriceInput
                    value={{ number: amount, currency: currentUser.location.currency._id }}
                  />
                ) || ''
              }
            >
              <div className={styles.amount}>
                <PriceInput
                  value={{ number: amount, currency: currentUser.location.currency._id }}
                />
              </div>
            </Tooltip>
          ),
          sorter: (item, nextItem) => item.amount - nextItem.amount,
          sortOrder: sortedTable.columnKey === 'amount' && sortedTable.order,
        },
        {
          title: 'view',
          dataIndex: 'id',
          key: 'id',
          render: (id, record) =>
            selectedListID.includes(record.id) ? (
              <Link
                to={`${isViewReportInTeamReport ? '/teamreport/view/' : '/report/view/'}${
                  record.id
                }`}
                onClick={() => {
                  dispatch({ type: 'reimbursement/fetchItem', payload: { reId: record.id } });
                }}
              >
                <ViewIcon />
              </Link>
            ) : (
              ''
            ),
        },
      ];
    }

    return columns.map(col => ({
      ...col,
      title: formatMessage({ id: `rp.table.${col.title}` }),
    }));
  };

  const selectRow = record => {
    const selectedRowKeys = [...selectedListID];
    if (selectedRowKeys.indexOf(record._id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record._id), 1);
    } else {
      selectedRowKeys.push(record._id);
    }
    setSelectedListID([...selectedRowKeys]);
    setSelectedListId([...selectedRowKeys]);
  };

  return (
    <div className={styles.listRpTableWrapper}>
      <Table
        bordered={false}
        size="small"
        locale={{
          emptyText: <Empty description={formatMessage({ id: 'rp.table.empty' })} />,
        }}
        rowSelection={rowSelectionProps === null ? null : rowSelection}
        columns={generateColumn()}
        dataSource={list}
        pagination={paginationProps === false ? false : pagination}
        rowKey="_id"
        onChange={handleChangeTable}
        scroll={{ x: 'max-content' }}
        loading={loading}
        onRow={record => ({
          onClick: () => {
            selectRow(record);
          },
        })}
      />
    </div>
  );
};

export default ListReportTable;
