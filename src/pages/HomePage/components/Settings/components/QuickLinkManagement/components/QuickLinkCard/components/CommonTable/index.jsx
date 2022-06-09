import { Table } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

const CommonTable = (props) => {
  const {
    list = [],
    columns,
    loading = false,
    page = 1,
    limit = 4,
    selectable = false,
    rowKey = '',
    scrollable = false,
    showPagination = true,
    selectedRowKeys = [],
    setSelectedRowKeys = () => {},
    components,
  } = props;
  const [pageSelected, setPageSelected] = useState(page);

  const onChangePagination = (pageNumber) => {
    setPageSelected(pageNumber);
  };

  const onSelectChange = (values) => {
    setSelectedRowKeys(values);
  };

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
    pageSize: limit,
    current: pageSelected,
    onChange: onChangePagination,
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div className={styles.CommonTable}>
        <Table
          // eslint-disable-next-line react/jsx-props-no-spreading
          components={components}
          size="middle"
          locale={{
            emptyText: <EmptyComponent description="No data" />,
          }}
          rowSelection={selectable ? rowSelection : null}
          columns={columns}
          dataSource={list}
          loading={loading}
          // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          pagination={showPagination ? pagination : null}
          scroll={scrollable ? { x: '101%', y: 'fit-content' } : {}}
          rowKey={rowKey ? (record) => record[rowKey] : null}
        />
      </div>
    </>
  );
};

// export default CommonTable;
export default connect(() => ({}))(CommonTable);
