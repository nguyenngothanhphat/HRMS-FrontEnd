import { Table } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';
import EmptyComponent from '@/components/Empty';

const CommonTable = (props) => {
  const {
    list = [],
    columns,
    loading = false,
    selectable = false,
    rowKey = '',
    scrollable = false,
    showPagination = true,
    selectedRowKeys = [],
    setSelectedRowKeys = () => {},
    components,
    refreshData = () => {},
    totalQuickLink = 0,
    selectedTab,
    pageSize = 10,
    setPageSize = () => {},
    currentPage = 1,
    setCurrentPage = () => {},
  } = props;

  const onChangePagination = (pageNumber, pageSizes) => {
    setCurrentPage(pageNumber);
    setPageSize(pageSizes);
    refreshData(pageNumber, pageSizes);
  };

  const onSelectChange = (values) => {
    setSelectedRowKeys(values);
  };

  const getTotal = () => {
    let count = 0;
    switch (selectedTab) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        count =
          totalQuickLink.find((x) => x._id === TAB_IDS_QUICK_LINK.GENERAL.toLowerCase())?.count ||
          0;
        break;
      case TAB_IDS_QUICK_LINK.TIMEOFF:
        count =
          totalQuickLink.find((x) => x._id === TAB_IDS_QUICK_LINK.TIMEOFF.toLowerCase())?.count ||
          0;
        break;
      default:
        break;
    }
    return count;
  };

  const pagination = {
    position: ['bottomLeft'],
    total: getTotal(),
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
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize,
    current: currentPage,
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
