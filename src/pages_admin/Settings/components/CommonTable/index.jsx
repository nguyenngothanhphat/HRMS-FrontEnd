import { Empty, Table } from 'antd';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

class CommonTable extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSelected: 1 };
  }

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  render() {
    const { pageSelected } = this.state;
    const { list = [], columns, loading = false } = this.props;
    const rowSize = 10;

    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    return (
      <>
        <div className={styles.CommonTable}>
          <Table
            size="small"
            locale={{
              emptyText: <Empty description="No data" />,
            }}
            columns={columns}
            dataSource={list}
            loading={loading}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={{ ...pagination, total: list.length }}
            // scroll={{ x: 1000, y: 'max-content' }}
          />
        </div>
      </>
    );
  }
}

// export default CommonTable;
export default connect(() => ({}))(CommonTable);
