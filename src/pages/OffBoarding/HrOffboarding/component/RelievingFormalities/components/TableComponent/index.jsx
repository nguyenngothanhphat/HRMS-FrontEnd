import React, { PureComponent } from 'react';
import { Table } from 'antd';
// import empty from '@/assets/empty.svg';
// import persion from '@/assets/people.svg';
import { history } from 'umi';
// import persion from '@/assets/people.svg';
import styles from './index.less';

class TableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  push = () => {
    history.push('/hr-offboarding/HrRequest/1854545');
  };

  renderAction = () => {
    return (
      <div className={styles.rowAction}>
        <span onClick={this.push}>Start Relieving Formalities</span>
      </div>
    );
  };

  render() {
    const { data = [], isClosedTable = false } = this.props;

    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      // pageSize: rowSize,
      // current: pageSelected,
      // onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketId',
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employeeId',
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'name',
      },
      {
        title: <span className={styles.title}>Department </span>,
        dataIndex: 'department',
      },
      {
        title: <span className={styles.title}>LWD </span>,
        dataIndex: 'lwd',
      },
      {
        title: !isClosedTable ? <span className={styles.title}>Action </span> : null,
        dataIndex: 'Action',
        align: 'left',
        render: () => (!isClosedTable ? this.renderAction() : null),
      },
    ];

    return (
      <div className={styles.tableComponent}>
        <Table
          locale={{
            emptyText: (
              <span>
                {/* <img src={empty} alt="" /> */}
                <p className={styles.textEmpty}>No data</p>
              </span>
            ),
          }}
          columns={columns}
          dataSource={data}
          pagination={{ ...pagination, total: data.length }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableComponent;
