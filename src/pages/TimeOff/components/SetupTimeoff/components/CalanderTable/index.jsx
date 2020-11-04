import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import empty from '@/assets/empty.svg';
import t from './index.less';

class CalanderTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    moment.locale('en');
  }

  render() {
    const { data = [] } = this.props;
    const { selectedRowKeys } = this.state;

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
    };

    const columns = [
      {
        title: <span className={t.title}>Holliday Title</span>,
        dataIndex: 'hollidayTitle',
      },
      {
        title: <span className={t.title}>Date</span>,
        dataIndex: 'date',
        render: (date) => <span>{moment(date).locale('en').format('Do MMM')}</span>,
      },
      {
        title: <span className={t.title}>Day</span>,
        dataIndex: 'date',
        render: (date) => <span>{moment(date).locale('en').format('dddd')}</span>,
      },
      {
        title: <span className={t.title}>Holliday Type</span>,
        dataIndex: 'hollidayType',
      },
    ];

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={t.styles}>
        <Table
          locale={{
            emptyText: (
              <span>
                <img src={empty} alt="" />
                <p className={t.textEmpty}>No data</p>
              </span>
            ),
          }}
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          pagination={{
            ...pagination,
            total: data.length,
          }}
          rowKey="id"
          scroll={{ x: 800 }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default CalanderTable;
