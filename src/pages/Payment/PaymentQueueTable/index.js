import React, { useState } from 'react';
import { Table, Empty, Button, Tooltip, Icon, notification } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { formatMessage } from 'umi-plugin-react/locale';
import PriceInput from '../../../components/PriceInput';
import styles from './index.less';

const moment = extendMoment(Moment);
const PaymentQueueTable = props => {
  const {
    data,
    loading,
    disabled,
    selectedListID,
    setSelectedListID,
    dispatch,
    currentUser,
  } = props;
  const [expandRowId, setExpandRowId] = useState([]);
  const getReimbursableOfReport = item => {
    const { bills } = item;
    let totalAmount = 0;
    bills.forEach(bill => {
      if (bill.reimbursable) {
        totalAmount += Number(bill.amount);
      }
    });
    return totalAmount;
  };
  const generateNestedTableData = queueTableItem => {
    const dataResult = [];
    data.forEach(item => {
      const { user } = item;
      if (user._id === queueTableItem.id) {
        dataResult.push({
          ...item,
          reimbursable: getReimbursableOfReport(item),
        });
      }
    });
    return dataResult;
  };

  const generateQueueTableData = () => {
    const trackEmployeeId = [];
    let resultData = [];
    data.forEach(item => {
      const { user = {}, currency } = item;
      if (user._id && trackEmployeeId.indexOf(user._id) === -1) {
        trackEmployeeId.push(user._id);
        resultData.push({
          ...user,
          currency,
          numberReport: 1,
          totalAmount: item.amount,
          totalReimbursable: getReimbursableOfReport(item),
        });
      } else {
        const newObject = [];
        resultData.forEach(resultItem => {
          if (resultItem._id === user._id) {
            newObject.push({
              ...resultItem,
              numberReport: resultItem.numberReport + 1,
              totalAmount: resultItem.totalAmount + item.amount,
              totalReimbursable: resultItem.totalReimbursable + getReimbursableOfReport(item),
            });
          } else {
            newObject.push(resultItem);
          }
        });
        resultData = [...newObject];
      }
    });

    return resultData;
  };

  const queueTableData = generateQueueTableData();
  const selectRow = record => {
    let listTmp = [...selectedListID];
    if (listTmp.indexOf(record._id) !== -1) {
      listTmp = listTmp.filter(item => item !== record._id);
      setSelectedListID([...listTmp]);
    } else {
      listTmp.push(record._id);
      setSelectedListID([...listTmp]);
    }
    if (listTmp.length > 0) {
      const { user: { id: userId } = {} } = record;
      if (userId) {
        const employeeTotalReport = queueTableData.filter(item => item.id === userId)[0];
        if (listTmp.length !== employeeTotalReport.numberReport) {
          document.getElementById(`markbtn-${userId}`).innerText = formatMessage({
            id: 'payment.markSelect',
          });
        } else {
          document.getElementById(`markbtn-${userId}`).innerText = formatMessage({
            id: 'payment.markAll',
          });
        }
      }
    } else {
      const { user: { id: userId } = {} } = record;
      if (userId) {
        document.getElementById(`markbtn-${userId}`).innerText = formatMessage({
          id: 'payment.markAll',
        });
      }
    }
  };
  const expandedRowRender = queueTableItem => {
    const rowSelection = {
      hideDefaultSelections: true,
      onSelect: selectRow,
      selectedRowKeys: selectedListID,
      getCheckboxProps: () => ({
        disabled,
      }),
      onSelectAll: (selected, rowsOnPage, changeRows) => {
        let sId = [...selectedListID];
        if (changeRows.length > 0) {
          const firstItem = changeRows[0];
          const { user: { id: userId } = {} } = firstItem;
          if (userId) {
            document.getElementById(`markbtn-${userId}`).innerText = formatMessage({
              id: 'payment.markAll',
            });
          }
        }
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
    };
    const fetchItem = id => {
      dispatch({ type: 'reimbursement/fetchItem', payload: { reId: id } });
    };

    const nestedTableData = generateNestedTableData(queueTableItem);
    const columns = [
      {
        title: formatMessage({ id: 'payment.submmitedOn' }),
        dataIndex: 'date',
        key: 'date',
        width: 150,
        render: (date, record) =>
          date
            ? moment(date).format('MMM D, YYYY')
            : moment(record.createdAt).format('MMM D, YYYY'),
      },
      {
        title: formatMessage({ id: 'payment.reportsNumber' }),
        width: 150,
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: formatMessage({ id: 'payment.reportsName' }),
        width: 180,
        dataIndex: 'title',
        key: 'title',
        render: reportName => (
          <Tooltip placement="topLeft" title={reportName || ''}>
            <div className={styles.description}>{reportName || ''}</div>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'payment.amount' }),
        dataIndex: 'amount',
        width: 150,
        key: 'amount',
        render: (amount, record) => (
          <PriceInput value={{ number: amount, currency: record.currency }} />
        ),
      },
      {
        title: formatMessage({ id: 'payment.reimbursable' }),
        dataIndex: 'reimbursable',
        key: 'reimbursable',
        render: (reimbursable, record) => (
          <PriceInput value={{ number: reimbursable, currency: record.currency }} />
        ),
      },
      {
        title: '',
        width: 100,
        dataIndex: 'id',
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
    return (
      <Table
        className={styles.nestedTable}
        columns={columns}
        dataSource={nestedTableData}
        rowSelection={rowSelection}
        rowKey="id"
        pagination={false}
        onRow={record => ({
          onClick: () => {
            selectRow(record);
          },
        })}
      />
    );
  };

  const handleMarkPaid = async userId => {
    let totalAmount = 0;
    let totalReimbursable = 0;
    let isSameUser = true;
    let reportIds = [];

    if (selectedListID.length > 0) {
      reportIds = [...selectedListID];
    } else {
      await data.forEach(item => {
        if (item.user && item.user.id === userId) reportIds.push(item._id);
      });
    }
    const listReport = data.filter(item => reportIds.indexOf(item._id) !== -1);
    listReport.forEach(item => {
      if (item.user.id !== userId) {
        isSameUser = false;
      }
      totalAmount += item.amount;
      totalReimbursable += getReimbursableOfReport(item);
    });
    if (isSameUser === false) {
      setSelectedListID([]);
      notification.error({
        message: formatMessage({ id: 'payment.notSameUser' }),
      });
    } else {
      await dispatch({
        type: 'reimbursement/save',
        payload: {
          selectedReportPaid: {
            reportIds,
            user: userId,
            finance: currentUser._id,
            amount: totalAmount,
            reimbursable: totalReimbursable,
            location: currentUser.location._id,
            listReport,
          },
        },
      });
      router.push(`/payment/detail/queue_${userId}`);
    }
  };
  const columns = [
    {
      title: formatMessage({ id: 'payment.employee' }),
      dataIndex: 'id',
      key: 'employee',
      width: 400,
      render: (id, record) => `${record.fullName} - ${record.email}`,
    },
    {
      title: formatMessage({ id: 'payment.noOfReports' }),
      dataIndex: 'numberReport',
      key: 'numberreport',
      width: 150,
      render: numberReport =>
        numberReport > 1
          ? `${numberReport} ${formatMessage({ id: 'payment.reportsInTotal' })}`
          : `${numberReport} ${formatMessage({ id: 'payment.reportInTotal' })}`,
    },
    {
      title: formatMessage({ id: 'payment.totalAmount' }),
      dataIndex: 'totalAmount',
      key: 'totalamount',
      render: (totalAmount, record) => (
        <PriceInput value={{ number: totalAmount, currency: record.currency }} />
      ),
    },
    {
      title: formatMessage({ id: 'payment.totalReimbursable' }),
      dataIndex: 'totalReimbursable',
      key: 'totalreimbursable',
      render: (totalReimbursable, record) => (
        <PriceInput value={{ number: totalReimbursable, currency: record.currency }} />
      ),
    },
    {
      title: formatMessage({ id: 'payment.action' }),
      dataIndex: '_id',
      key: 'action',
      width: 180,
      render: id => (
        <Button
          key={id}
          onClick={() => handleMarkPaid(id)}
          id={`markbtn-${id}`}
          className={styles.markPaidBtn}
        >
          {formatMessage({ id: 'payment.markAll' })}
        </Button>
      ),
    },
  ];
  const handleExpandRow = expandedRows => {
    const currentEmployeeId = expandedRows[expandedRows.length - 1];
    setExpandRowId([currentEmployeeId]);
    setSelectedListID([]);
    queueTableData.forEach(item => {
      const userId = item.id;
      if (userId) {
        document.getElementById(`markbtn-${userId}`).innerText = formatMessage({
          id: 'payment.markAll',
        });
      }
    });
  };
  return (
    <div className={styles.paymentQueueTableWrapper}>
      <Table
        bordered={false}
        size="small"
        locale={{
          emptyText: <Empty description={formatMessage({ id: 'rp.table.empty' })} />,
        }}
        columns={columns}
        expandedRowKeys={expandRowId}
        rowKey="id"
        expandedRowRender={queueTableItem => expandedRowRender(queueTableItem)}
        dataSource={queueTableData}
        loading={loading}
        expandRowByClick
        onExpandedRowsChange={expandedRows => handleExpandRow(expandedRows)}
      />
    </div>
  );
};

export default PaymentQueueTable;
