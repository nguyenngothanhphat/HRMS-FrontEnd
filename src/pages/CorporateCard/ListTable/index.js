import React, { useState } from 'react';
import { Table, Empty } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Moment from 'moment';
// import Link from 'umi/link';
import { extendMoment } from 'moment-range';
// import PriceInput from '@/components/PriceInput';
// import { ReactComponent as ViewIcon } from '@/assets/svg/view_report.svg';
// import StatusIcon from './StatusIcon';
import styles from './index.less';

const moment = extendMoment(Moment);
const ListTable = props => {
  const { list = [], loading } = props;
  const [sortedTable, setSortedTable] = useState({});

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: list.length,
  };

  const onDetectTypeCard = value => {
    let re = new RegExp('^4');
    if (value && value.toString().match(re) != null) {
      return 'VISA';
    }

    re = new RegExp('^(34|37)');
    if (value && value.toString().match(re) != null) {
      return 'American Express';
    }

    re = new RegExp('^5[1-5]');
    if (value && value.toString().match(re) != null) {
      return 'MasterCard';
    }

    re = new RegExp('^6011');
    if (value && value.toString().match(re) != null) {
      return 'Discover';
    }

    return null;
  };

  const handleChangeTable = (_pagination, _filters, sorter) => {
    setSortedTable(sorter);
  };

  const generateColumn = () => {
    const columns = [
      {
        title: 'view',
        width: 20,
        render: () => '',
      },
      {
        className: styles.spentColumn,
        title: 'AssignDate',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 110,
        render: date => moment(date).format('MMM D, YYYY'),
        sortOrder: sortedTable.columnKey === 'updatedAt' && sortedTable.order,
        sorter: (item, nextItem) => moment.utc(item.updatedAt).diff(moment.utc(nextItem.updatedAt)),
      },
      {
        title: 'CardType',
        dataIndex: 'number',
        key: 'number',
        width: 110,
        render: number => onDetectTypeCard(number),
        sortOrder: sortedTable.columnKey === 'number' && sortedTable.order,
        sorter: (item, nextItem) => item.number.localeCompare(nextItem.number),
      },
      {
        title: 'CardNumber',
        dataIndex: 'lastFourDigits',
        key: 'lastFourDigits',
        width: 150,
        render: lastFourDigits => `xxxx-xxxx-xxxx-${lastFourDigits}`,
        sortOrder: sortedTable.columnKey === 'reportName' && sortedTable.order,
        sorter: (item, nextItem) => item.lastFourDigits.localeCompare(nextItem.lastFourDigits),
      },
      {
        title: 'HolderName',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 200,
        render: firstName => firstName.toUpperCase() || '',
        sortOrder: sortedTable.columnKey === 'owner' && sortedTable.order,
        sorter: (item, nextItem) => item.firstName.localeCompare(nextItem.firstName),
      },
      {
        className: styles.spentColumn,
        title: 'ExpiredOn',
        dataIndex: 'expirationMonth',
        key: 'expirationMonth',
        width: 110,
        render: (expirationMonth, record) =>
          moment(`01/${expirationMonth}/${record.expirationYear}`, 'DD/MM/YYYY').format(
            'MMM, YYYY'
          ),
        sortOrder: sortedTable.columnKey === 'expirationMonth' && sortedTable.order,
        sorter: (item, nextItem) =>
          moment.utc(item.expirationMonth).diff(moment.utc(nextItem.expirationMonth)),
      },
      {
        title: 'Assigner',
        dataIndex: 'user',
        key: 'user',
        width: 200,
        render: (user = {}) => {
          const { email = '' } = user || {};
          return email;
        },
        sortOrder: sortedTable.columnKey === 'user' && sortedTable.order,
        sorter: (a = {}, b = {}) => {
          const { email = '' } = a || {};
          const { email: emailB = '' } = b || {};
          return email.localeCompare(emailB);
        },
      },
    ];
    return columns.map(col => ({
      ...col,
      title: formatMessage({ id: `rp.table.${col.title}` }),
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
        columns={generateColumn()}
        dataSource={list}
        pagination={pagination}
        rowKey="_id"
        onChange={handleChangeTable}
        scroll={{ x: 'max-content' }}
        loading={loading}
      />
    </div>
  );
};

export default ListTable;
