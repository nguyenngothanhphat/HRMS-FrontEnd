import React, { useState } from 'react';
import { Table, Tooltip, Empty, Icon } from 'antd';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PriceInput from '../../../components/PriceInput';
import StatusIcon from './StatusIcon';
import styles from './index.less';

const moment = extendMoment(Moment);
const ListReportTable = props => {
  const {
    dispatch,
    list = [],
    loading,
    disabled,
    rowSelection: rowSelectionProps,
    pagination: paginationProps,
    selectedListID,
    setSelectedListID,
    isPaymentDetailView,
  } = props;
  const [sortedTable, setSortedTable] = useState({ columnKey: 'submittedon', order: 'descend' });
  const [pageSelected, setPageSelected] = useState();

  const onChangePagination = pageNumber => {
    setPageSelected(pageNumber);
  };
  const select = record => {
    const listTmp = [...selectedListID];
    if (listTmp.indexOf(record._id) !== -1) {
      setSelectedListID(listTmp.filter(item => item !== record._id));
    } else {
      listTmp.push(record._id);
      setSelectedListID([...listTmp]);
    }
  };
  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageSelected,
    onChange: onChangePagination,
    total: list.length,
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
      setSelectedListID([...sId]);
    },
    selections: [
      {
        key: 'all-data',
        text: 'Select All',
        onSelect: () => {
          const allListId = list.map(item => {
            return item._id;
          });
          setSelectedListID([...allListId]);
        },
      },
      {
        key: 'no-data',
        text: 'Unselect All',
        onSelect: () => {
          setSelectedListID([]);
        },
      },
    ],
  };

  const fetchItem = id => {
    dispatch({ type: 'reimbursement/fetchItem', payload: { reId: id } });
  };

  const handleChangeTable = (_pagination, _filters, sorter) => {
    setSortedTable(sorter);
  };
  const selectRow = record => {
    const selectedRowKeys = [...selectedListID];
    if (selectedRowKeys.indexOf(record._id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record._id), 1);
    } else {
      selectedRowKeys.push(record._id);
    }
    if (!isPaymentDetailView) {
      setSelectedListID([...selectedRowKeys]);
    }
  };
  const generateColumn = () => {
    const columns = [
      {
        className: styles.spentColumn,
        title: 'submittedon',
        dataIndex: 'date',
        key: 'submittedon',
        width: 110,
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
        title: 'number',
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
        width: 200,
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
        width: 150,
        render: user => (user && user.fullName) || '',
        sortOrder: sortedTable.columnKey === 'owner' && sortedTable.order,
        sorter: (item, nextItem) => item.user.fullName.localeCompare(nextItem.user.fullName),
      },
      {
        className: styles.spentColumn,
        title: 'completedOn',
        dataIndex: 'updatedAt',
        key: 'completedDate',
        width: 110,
        render: (updatedAt, record) =>
          record.status === 'COMPLETE'.toUpperCase()
            ? moment(updatedAt).format('MMM D, YYYY')
            : '-',
        sortOrder: sortedTable.columnKey === 'completedDate' && sortedTable.order,
        sorter: (item, nextItem) => moment.utc(item.updatedAt).diff(moment.utc(nextItem.updatedAt)),
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        width: 135,
        align: 'center',
        render: status => <StatusIcon status={status} />,
        sortOrder: sortedTable.columnKey === 'status' && sortedTable.order,
        sorter: (item, nextItem) => item.status.localeCompare(nextItem.status),
      },
      {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, record) => (
          <PriceInput value={{ number: amount, currency: record.currency }} />
        ),
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedTable.columnKey === 'amount' && sortedTable.order,
      },
      {
        title: '',
        width: 50,
        dataIndex: '_id',
        align: 'center',
        key: 'action',
        className: styles.tbAction,
        render: id =>
          selectedListID.indexOf(id) === -1 ? (
            ''
          ) : (
            <Link
              to={`/report/view/${id}`}
              onClick={() => {
                fetchItem(id);
              }}
            >
              <Icon className={styles.eyeIcon} type="eye" />
            </Link>
          ),
      },
    ];
    return columns.map(col => ({
      ...col,
      title: col.key !== 'action' ? formatMessage({ id: `rp.table.${col.title}` }) : col.title,
    }));
  };

  const generatePaymentDetailColumn = () => {
    const columns = [
      {
        className: styles.paymentSpentColumn,
        title: 'submittedon',
        dataIndex: 'date',
        key: 'submittedon',
        width: 210,
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
        width: 230,
        render: reportNumber => reportNumber || '',
        sortOrder: sortedTable.columnKey === 'reportNumber' && sortedTable.order,
        sorter: (item, nextItem) => item.code.localeCompare(nextItem.code),
      },
      {
        title: 'reportName',
        dataIndex: 'title',
        key: 'reportName',
        width: 230,
        render: reportName => (
          <Tooltip placement="topLeft" title={reportName || ''}>
            <div className={styles.description}>{reportName || ''}</div>
          </Tooltip>
        ),
        sortOrder: sortedTable.columnKey === 'reportName' && sortedTable.order,
        sorter: (item, nextItem) => item.title.localeCompare(nextItem.title),
      },
      {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 200,
        render: (amount, record) => (
          <PriceInput value={{ number: amount, currency: record.currency }} />
        ),
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedTable.columnKey === 'amount' && sortedTable.order,
      },
      {
        title: 'reim',
        dataIndex: 'amount',
        key: 'reim',
        render: (amount, record) => (
          <PriceInput value={{ number: amount, currency: record.currency }} />
        ),
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedTable.columnKey === 'amount' && sortedTable.order,
      },
      {
        title: '',
        width: 50,
        dataIndex: '_id',
        align: 'center',
        key: 'action',
        className: styles.tbAction,
        render: id => (
          <Link
            to={`/report/view/${id}`}
            onClick={() => {
              if (!isPaymentDetailView) {
                fetchItem(id);
              }
            }}
          >
            <Icon className={styles.eyeIcon} type="eye" />
          </Link>
        ),
      },
    ];
    return columns.map(col => ({
      ...col,
      title: col.key !== 'action' ? formatMessage({ id: `rp.table.${col.title}` }) : col.title,
    }));
  };

  return (
    <div className={styles.listRpTableWrapper}>
      <Table
        bordered={false}
        size="small"
        locale={{
          emptyText: <Empty description={formatMessage({ id: 'rp.table.empty' })} />,
        }}
        rowSelection={rowSelectionProps === null || isPaymentDetailView ? null : rowSelection}
        columns={!isPaymentDetailView ? generateColumn() : generatePaymentDetailColumn()}
        dataSource={list}
        pagination={paginationProps === false ? false : pagination}
        rowKey="_id"
        loading={loading}
        onChange={handleChangeTable}
        scroll={{ x: 'max-content' }}
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
