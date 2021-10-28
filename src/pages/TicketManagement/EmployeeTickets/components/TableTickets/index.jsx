import React from 'react';
import { Table } from 'antd';
import styles from './index.less'
const columns = [
    {
        title: 'Ticket ID',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'User ID',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Name',
        dataIndex: 'address',
        key: '1',
    },
    {
        title: 'Request Date',
        dataIndex: 'address',
        key: '2',
    },
    {
        title: 'Request Type',
        dataIndex: 'address',
        key: '3',
    },
    {
        title: 'Priority',
        dataIndex: 'address',
        key: '4',
    },
    {
        title: 'Loacation',
        dataIndex: 'address',
        key: '5',
    },
    {
        title: 'Subject',
        dataIndex: 'address',
        key: '6',
    },
    {
        title: 'Status',
        key: 'operation',
        fixed: 'right',
        render: () => <a>Select User</a>,
    },
];
const data = [];
for (let i = 0; i < 50; i++) {
    data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

const rowSize = 10;
const pagination = {
    position: ['bottomLeft'],
    total: 30,
    showTotal: (total, range) => (
        <span>
            Showing{' '}
            <b>
                {range[0]} - {range[1]}
            </b>{' '}
            of
        </span>
    ),
    pageSize: rowSize,
    current: 1,
    onChange: onChangePagination,
};

const onChangePagination = (pageNumber) => {

};

const TableTickets = () => {
    return (
        <div className={styles.TableTickets}>
            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 1500, y: 487 }}
                pagination={{
                    ...pagination,
                    total: 30,
                }}
            />
        </div>
    )
}

export default TableTickets
