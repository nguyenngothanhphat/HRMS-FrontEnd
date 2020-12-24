import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import empty from '@/assets/empty.svg';
import s from './index.less';

class TableSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  componentDidMount() {}

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    const { data = [] } = this.props;
    const { pageNavigation } = this.state;
    const rowSize = 10;
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
      pageSize: rowSize,
      current: pageNavigation,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={s.title}>Title</span>,
        dataIndex: 'title',
        render: (title) => <p className={s.text}>{title}</p>,
      },
      {
        title: <span className={s.title}>Tags</span>,
        dataIndex: 'tags',
        render: (tags) => <p className={s.text}>{tags}</p>,
      },
      {
        title: <span className={s.title}>Date</span>,
        dataIndex: 'date',
        render: (date) => <p className={s.text}>{date}</p>,
      },
      {
        title: <span className={s.title}>Status</span>,
        dataIndex: 'status',
        render: (status) => <p className={s.text}>{status}</p>,
      },
      {
        title: <span className={s.title}>Owner</span>,
        dataIndex: 'owner',
        render: (owner) => <p className={s.text}>{owner}</p>,
      },
    ];

    return (
      <>
        <div className={s.tableAssigned}>
          <Table
            locale={{
              emptyText: (
                <div className={s.viewEmpty}>
                  <img src={empty} alt="" />
                  <p className={s.textEmpty}>No Result</p>
                </div>
              ),
            }}
            columns={columns}
            dataSource={data}
            hideOnSinglePage
            pagination={{
              ...pagination,
              total: data.length,
            }}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            loading={false}
          />
        </div>
      </>
    );
  }
}
export default TableSearch;
