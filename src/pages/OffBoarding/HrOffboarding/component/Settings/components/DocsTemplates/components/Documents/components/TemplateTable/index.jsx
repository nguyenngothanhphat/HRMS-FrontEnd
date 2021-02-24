import React, { Component } from 'react';
import { Table, Empty } from 'antd';
import { formatMessage, connect } from 'umi';
import DownloadIcon from './images/download.svg';
import EditIcon from './images/edit.svg';
import DeleteIcon from './images/delete.svg';
import DocIcon from './images/doc.svg';

import styles from './index.less';

class TemplateTable extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSelected: 1 };
  }

  generateColumns = () => {
    const columns = [
      {
        title: 'Template Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: (name) => {
          return (
            <div className={styles.fileName}>
              <img src={DocIcon} alt="name" />
              <span>{name}</span>
            </div>
          );
        },
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        width: '20%',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '40%',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: () => {
          return (
            <div className={styles.actionsButton}>
              <img src={DownloadIcon} onClick={() => this.onDownload()} alt="download" />
              <img src={EditIcon} onClick={() => this.onEdit()} alt="edit" />
              <img src={DeleteIcon} onClick={() => this.onDelete()} alt="delete" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  // ACTIONS
  onDownload = () => {
    // eslint-disable-next-line no-alert
    alert('Download');
  };

  onEdit = () => {
    // eslint-disable-next-line no-alert
    alert('Edit');
  };

  onDelete = () => {
    // eslint-disable-next-line no-alert
    alert('Delete');
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  render() {
    const { pageSelected } = this.state;
    const { list } = this.props;
    const rowSize = 10;

    const rowSelection = {
      // onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
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
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const { columnArr, type, inTab, hasCheckbox } = this.props;
    return (
      <>
        <div className={`${styles.TemplateTable} ${inTab ? styles.inTab : ''}`}>
          <Table
            size="small"
            rowSelection={
              hasCheckbox && {
                type: 'checkbox',
                ...rowSelection,
              }
            }
            locale={{
              emptyText: (
                <Empty
                  description={formatMessage(
                    { id: 'component.onboardingOverview.noData' },
                    { format: 0 },
                  )}
                />
              ),
            }}
            columns={this.generateColumns(columnArr, type)}
            dataSource={list}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={{ ...pagination, total: list.length }}
            // scroll={{ x: 1000, y: 'max-content' }}
          />
        </div>
      </>
    );
  }
}

// export default TemplateTable;
export default connect(({ candidateInfo }) => ({
  candidateInfo,
}))(TemplateTable);
