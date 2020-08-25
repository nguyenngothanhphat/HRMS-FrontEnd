import React, { useState } from 'react';
import { Table, Empty, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Moment from 'moment';
import Link from 'umi/link';
import { extendMoment } from 'moment-range';
import PriceInput from '../../../components/PriceInput';
import styles from './index.less';

const moment = extendMoment(Moment);
const PaymentHistory = props => {
  const {
    disabled,
    data = [],
    loading,
    userCurrency,
    selectedPaymentHistoryId,
    setSelectedPaymentHistoryId,
  } = props;
  const [sortedTable, setSortedTable] = useState({ columnKey: 'paidon', order: 'descend' });
  const [pageSelected, setPageSelected] = useState();
  const onChangePagination = pageNumber => {
    setPageSelected(pageNumber);
  };
  const select = record => {
    const listTmp = [...selectedPaymentHistoryId];
    if (listTmp.indexOf(record.id) !== -1) {
      setSelectedPaymentHistoryId(listTmp.filter(item => item !== record.id));
    } else {
      listTmp.push(record.id);
      setSelectedPaymentHistoryId([...listTmp]);
    }
  };

  const handleChangeTable = (_pagination, _filters, sorter) => {
    setSortedTable(sorter);
  };
  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    current: pageSelected,
    onChange: onChangePagination,
    total: data.length,
  };

  const rowSelection = {
    hideDefaultSelections: true,
    onSelect: select,
    selectedRowKeys: selectedPaymentHistoryId,
    getCheckboxProps: () => ({
      disabled,
    }),
    onSelectAll: (selected, rowsOnPage, changeRows) => {
      let sId = [...selectedPaymentHistoryId];
      if (selected) {
        let isChanged = false;
        rowsOnPage.forEach(row => {
          if (!sId.includes(row.id)) {
            isChanged = true;
            sId.push(row.id);
          }
        });
        if (!isChanged) sId = [];
      } else {
        changeRows.forEach(row => {
          sId = sId.filter(id => id !== row.id);
        });
      }
      setSelectedPaymentHistoryId([...sId]);
    },
    selections: [
      {
        key: 'all-data',
        text: 'Select All',
        onSelect: () => {
          const allListId = data.map(item => {
            return item.id;
          });
          setSelectedPaymentHistoryId([...allListId]);
        },
      },
      {
        key: 'no-data',
        text: 'Unselect All',
        onSelect: () => {
          setSelectedPaymentHistoryId([]);
        },
      },
    ],
  };
  const generateColumn = () => {
    const columns = [
      {
        className: styles.spentColumn,
        title: 'paidon',
        dataIndex: 'createdAt',
        key: 'paidon',
        width: 110,
        render: (date, record) =>
          date
            ? moment(date).format('MMM D, YYYY')
            : moment(record.createdAt).format('MMM D, YYYY'),
        sortOrder: sortedTable.columnKey === 'paidon' && sortedTable.order,
        sorter: (item, nextItem) => moment.utc(item.createdAt).diff(moment.utc(nextItem.createdAt)),
      },
      {
        title: 'payno',
        dataIndex: 'code',
        key: 'payno',
        width: 130,
        render: payno => payno || '',
        sortOrder: sortedTable.columnKey === 'payno' && sortedTable.order,
        sorter: (item, nextItem) => item.code.localeCompare(nextItem.code),
      },
      {
        title: 'employee',
        dataIndex: 'user',
        key: 'employee',
        width: 200,
        render: user => (user ? user.fullName : ''),
        sortOrder: sortedTable.columnKey === 'employee' && sortedTable.order,
        sorter: (item, nextItem) =>
          item.user
            ? item.user.fullName.localeCompare(nextItem.user ? nextItem.user.fullName : '')
            : ''.localeCompare(nextItem.user ? nextItem.user.fullName : ''),
      },
      {
        title: 'finance',
        dataIndex: 'finance',
        key: 'finance',
        width: 200,
        render: finance => (finance ? finance.fullName : ''),
        sortOrder: sortedTable.columnKey === 'finance' && sortedTable.order,
        sorter: (item, nextItem) =>
          item.finance
            ? item.finance.fullName.localeCompare(nextItem.finance ? nextItem.finance.fullName : '')
            : ''.localeCompare(nextItem.finance ? nextItem.finance.fullName : ''),
      },
      {
        title: 'totalAmount',
        dataIndex: 'amount',
        key: 'totalAmount',
        render: amount => <PriceInput value={{ number: amount, currency: userCurrency }} />,
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedTable.columnKey === 'totalAmount' && sortedTable.order,
      },
      {
        title: 'reimbursable',
        dataIndex: 'reimbursable',
        key: 'reimbursable',
        render: reimbursable => (
          <PriceInput value={{ number: reimbursable, currency: userCurrency }} />
        ),
        sorter: (item, nextItem) => item.reimbursable - nextItem.reimbursable,
        sortOrder: sortedTable.columnKey === 'reimbursable' && sortedTable.order,
      },
      {
        title: '',
        width: 50,
        dataIndex: 'id',
        align: 'center',
        key: 'action',
        className: styles.tbAction,
        render: id =>
          selectedPaymentHistoryId.indexOf(id) === -1 ? (
            ''
          ) : (
            <Link to={`/payment/detail/${id}`}>
              <Icon className={styles.eyeIcon} type="eye" />
            </Link>
          ),
      },
    ];
    return columns.map(col => ({
      ...col,
      title: col.key !== 'action' ? formatMessage({ id: `payment.${col.title}` }) : col.title,
    }));
  };
  return (
    <div className={styles.paymentHistoryTableWrapper}>
      <Table
        bordered={false}
        size="small"
        locale={{
          emptyText: <Empty description={formatMessage({ id: 'rp.table.empty' })} />,
        }}
        rowSelection={rowSelection}
        columns={generateColumn()}
        dataSource={data}
        pagination={pagination}
        rowKey="id"
        loading={loading}
        onChange={handleChangeTable}
        scroll={{ x: 'max-content' }}
        onRow={record => ({
          onClick: () => {
            select(record);
          },
        })}
      />
    </div>
  );
};

export default PaymentHistory;
