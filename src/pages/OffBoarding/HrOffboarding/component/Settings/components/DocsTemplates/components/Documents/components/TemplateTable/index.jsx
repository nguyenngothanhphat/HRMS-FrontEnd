import React, { Component } from 'react';
import { Table, Empty } from 'antd';
import { formatMessage, connect, history } from 'umi';
import moment from 'moment';
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
        dataIndex: 'titleAndId',
        key: 'titleAndId',
        width: '20%',
        render: (titleAndId) => {
          return (
            <div
              className={styles.fileName}
              onClick={() => this.viewTemplateDetail(titleAndId?._id)}
            >
              <img src={DocIcon} alt="name" />
              <span>{titleAndId?.title}</span>
            </div>
          );
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '40%',
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '20%',
        render: (createdAt) => {
          return <span>{moment(createdAt).locale('en').format('MM.DD.YY')}</span>;
        },
      },
      {
        title: 'Actions',
        dataIndex: '_id',
        key: 'actions',
        render: (_id) => {
          return (
            <div className={styles.actionsButton}>
              <img src={DownloadIcon} onClick={() => this.onDownload(_id)} alt="download" />
              {/* <img src={EditIcon} onClick={() => this.onEdit(_id)} alt="edit" /> */}
              <img src={DeleteIcon} onClick={() => this.onDelete(_id)} alt="delete" />
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

  onDelete = async (id) => {
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'employeeSetting/removeTemplateById',
      payload: {
        id,
      },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'employeeSetting/fetchDefaultTemplateListOffboarding',
      });
      dispatch({
        type: 'employeeSetting/fetchCustomTemplateListOffboarding',
      });
    }
  };

  viewTemplateDetail = (id) => {
    history.push(`/template-details/${id}`);
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  parseList = () => {
    const { list = [] } = this.props;
    return list.map((value) => {
      return {
        ...value,
        titleAndId: {
          title: value.title || '',
          _id: value._id || '',
        },
      };
    });
  };

  render() {
    const { pageSelected } = this.state;
    const { list = [], loading = false } = this.props;
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
            dataSource={this.parseList()}
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

// export default TemplateTable;
export default connect(({ candidateInfo }) => ({
  candidateInfo,
}))(TemplateTable);
